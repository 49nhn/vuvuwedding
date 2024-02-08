import { authRouter } from "~/server/api/routers/Auth/Auth";
import { createTRPCRouter } from "~/server/api/trpc";
import { roleRouter } from "./routers/Mdm/Role";
import { permissionRouter } from "./routers/Mdm/Permission";
import { numberingConfigRouter } from "~/server/api/routers/Mdm/NumberingConfig";
import { departmentRouter } from "~/server/api/routers/Employee/Deparment";
import { userRouter } from "~/server/api/routers/Employee/User";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    Auth: authRouter,
    Role: roleRouter,
    Permission: permissionRouter,
    NumberingConfig: numberingConfigRouter,
    Department: departmentRouter,
    User: userRouter,
    
});

// export type definition of API
export type AppRouter = typeof appRouter;
