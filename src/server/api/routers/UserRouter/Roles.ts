import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const roleRouter = createTRPCRouter({
    
});

