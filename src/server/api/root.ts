import { authRouter } from "~/server/api/routers/Auth";
import { userRouter } from "~/server/api/routers/User";
import { createTRPCRouter } from "~/server/api/trpc";
import { roleRouter } from "./routers/Roles";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  Auth: authRouter,
  User: userRouter,
  Role: roleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
