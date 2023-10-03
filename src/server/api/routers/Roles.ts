import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const roleRouter = createTRPCRouter({
    list: AuthMiddleware
        .input(
            z.object({
                page: z.number(),
                filter: z.object({
                    string: z.string().nullable(),
                    sort: z.number().nullable(),
                }).nullable(),
                itemPerPage: z.number().nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            const page = Number(input.page) - 1 || 0;
            const itemPerPage = input.itemPerPage ?? 10;
            const roles = await ctx.prisma.role.findMany({
                where: {
                    name: {
                        contains: input.filter?.string ?? "",
                    },
                },
                skip: page * itemPerPage,
                take: itemPerPage,
                orderBy: {
                    id: input.filter?.sort === 1 ? "asc" : "desc",
                },
                include: {
                    User: true
                },
            }
            )
            console.log(roles);

            return {
                data: roles,
                total: await ctx.prisma.role.count(),
                itemPerPage,
            };
        }),
});

