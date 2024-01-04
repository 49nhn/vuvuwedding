import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const userRouter = createTRPCRouter({
 
});

