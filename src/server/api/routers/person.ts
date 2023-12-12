import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { people } from "~/server/db/schema";

export const personRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        checkInCadence: z.number().min(1).max(4),
        phoneNumber: z.string().length(10).nullable(),
        email: z.string().email().nullable(),
        birthday: z.date().nullable(),
        yearMet: z.number().min(1900).max(new Date().getFullYear()).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(people).values({
        name: input.name,
        checkInCadence: input.checkInCadence,
        phoneNumber: input.phoneNumber,
        email: input.email,
        birthday: input.birthday,
        yearMet: input.yearMet,
        nextCheckInDate: new Date(),
      });
    }),
  getNextNDays: publicProcedure
    .input(z.object({ days: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.people.findMany({
        where(fields, operators) {
          // get next n days from today (inclusive) and return people who have a check-in date within that range
          // get date: beginning of today 12:00am
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // get date: n days from today 11:59pm  (inclusive)
          const nextNDays = new Date();
          nextNDays.setHours(23, 59, 59, 999);
          nextNDays.setDate(nextNDays.getDate() + input.days);

          return operators.and(
            operators.lte(fields.nextCheckInDate, nextNDays),
          );
        },
        orderBy: (people, { desc }) => [desc(people.createdAt)],
      });
    }),
  pushNextCheckInDate: publicProcedure
    .input(z.object({ personId: z.number(), nextCheckInDate: z.date() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(people)
        .set({ nextCheckInDate: input.nextCheckInDate })
        .where(eq(people.id, input.personId));
    }),
});
