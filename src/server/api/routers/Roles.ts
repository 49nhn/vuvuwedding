import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const rolesRouter = createTRPCRouter({
    listRoles: AuthMiddleware
        .input(z.object({
            skip: z.number().default(0),
            take: z.number().default(10),
        }))
        .query(async ({ ctx, input }) => {
            const roles = await ctx.prisma.role.findMany({
                skip: input.skip,
                take: input.take,
                include: {
                    User: true
                }
            });
            return roles;
        }),
        
    createRole: publicProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const role = await ctx.prisma.role.create({
                data: {
                    name: input.name,
                }
            });
            return role;
        })
});