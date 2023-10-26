import { authRouter } from "~/server/api/routers/UserRouter/Auth";
import { userRouter } from "~/server/api/routers/UserRouter/User";
import { createTRPCRouter } from "~/server/api/trpc";
import { roleRouter } from "./routers/UserRouter/Roles";
import { permissionRouter } from "./routers/UserRouter/Permissions";
import { employeeRouter } from "./routers/Employee/Employee";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  Auth: authRouter,
  User: userRouter,
  Role: roleRouter,
  Permission: permissionRouter,
  Employee: employeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
