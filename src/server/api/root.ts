import { authRouter } from "~/server/api/routers/UserRouter/Auth";
import { userRouter } from "~/server/api/routers/UserRouter/User";
import { createTRPCRouter } from "~/server/api/trpc";
import { roleRouter } from "./routers/UserRouter/Roles";
import { permissionRouter } from "./routers/UserRouter/Permissions";
import { numberingConfig } from "~/server/api/routers/Mdm/NumberingConfig";

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
    NumberingConfig: numberingConfig,
    
});

// export type definition of API
export type AppRouter = typeof appRouter;
