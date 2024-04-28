import { authRouter } from "~/server/api/routers/Auth/Auth";
import { createTRPCRouter } from "~/server/api/trpc";
import { roleRouter } from "./routers/Mdm/Role";
import { permissionRouter } from "./routers/Mdm/Permission";
import { numberingConfigRouter } from "~/server/api/routers/Mdm/NumberingConfig";
import { departmentRouter } from "~/server/api/routers/Employee/Deparment";
import { userRouter } from "~/server/api/routers/Employee/User";
import { weddingPresentRouter } from "~/server/api/routers/Show/WeddingPresent";
import { otherRouter } from "~/server/api/routers/Show/Other";
import { makeUpRouter } from "~/server/api/routers/Show/MakeUp";
import { photoRouter } from "~/server/api/routers/Show/Photo";
import { weddingDressRouter } from "~/server/api/routers/Show/WeddingDress";
import { weddingFlowerRouter } from "~/server/api/routers/Show/WeddingFlower";
import { showsRouter } from "~/server/api/routers/Show/Shows";
import { packAncestralRouter } from "~/server/api/routers/Mdm/PackAncestral";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    Auth: authRouter,
    //Region Mdm Router
    Role: roleRouter,
    Permission: permissionRouter,
    PackAncestral: packAncestralRouter,
    NumberingConfig: numberingConfigRouter,
    Department: departmentRouter,
    User: userRouter,
    
    //Region Shows Rowter
    Shows: showsRouter,
    WeddingPresent: weddingPresentRouter,
    MakeUp: makeUpRouter,
    WeddingDress: weddingDressRouter,
    WeddingFlower: weddingFlowerRouter,
    Photo: photoRouter,
    Other: otherRouter,
    //EndRegion
    
});

// export type definition of API
export type AppRouter = typeof appRouter;
