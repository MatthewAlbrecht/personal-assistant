import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { checkIns, people } from "~/server/db/schema";
import { addNUnitsToDate } from "~/utils/dates";
import { AssertedCheckInCadenceUnitValues } from "~/utils/enums";

export const checkInRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        personId: z.number(),
        date: z.date(),
        notes: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const person = await tx.query.people.findFirst({
          where: eq(people.id, input.personId),
        });

        if (!person) {
          throw new Error(`Person with id ${input.personId} not found`);
        }

        const parseResult = z
          .enum(AssertedCheckInCadenceUnitValues)
          .safeParse(person.checkInCadenceUnit);

        if (!parseResult.success) {
          throw new Error(
            `Check-in cadence unit "${
              person.checkInCadenceUnit
            }" is not valid. Valid values are: ${AssertedCheckInCadenceUnitValues.join(
              ", ",
            )}`,
          );
        }

        await tx
          .update(people)
          .set({
            lastCheckInDate: input.date,
            nextCheckInDate: addNUnitsToDate(
              person.checkInCadenceNumber,
              parseResult.data,
              input.date,
            ),
          })
          .where(eq(people.id, input.personId));
        await tx.insert(checkIns).values({
          personId: input.personId,
          date: input.date,
          notes: input.notes,
        });
      });
    }),
});
