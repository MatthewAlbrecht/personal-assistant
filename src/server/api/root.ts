import { personRouter } from "~/server/api/routers/person";
import { createTRPCRouter } from "~/server/api/trpc";
import { checkInRouter } from "./routers/check-in";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  person: personRouter,
  checkIn: checkInRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
