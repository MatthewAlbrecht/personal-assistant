import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { people } from "~/server/db/schema";
import { AssertedCheckInCadenceUnitValues } from "~/utils/enums";

export const personRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .min(1)
          .toLowerCase(),
        checkInCadenceNumber: z.number(),
        checkInCadenceUnit: z.enum(AssertedCheckInCadenceUnitValues),
        phoneNumber: z.string().length(10).nullable(),
        email: z.string().email().nullable(),
        birthday: z.date().nullable(),
        yearMet: z.number().min(1900).max(new Date().getFullYear()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(people).values({
        name: input.name,
        slug: input.slug,
        checkInCadenceNumber: input.checkInCadenceNumber,
        checkInCadenceUnit: input.checkInCadenceUnit,
        phoneNumber: input.phoneNumber,
        email: input.email,
        birthday: input.birthday,
        yearMet: input.yearMet,
        nextCheckInDate: new Date(),
      });
    }),
  getPerson: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.people.findFirst({
        where: eq(people.slug, input.slug),
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
