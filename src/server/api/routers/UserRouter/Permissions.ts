import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const permissionRouter = createTRPCRouter({

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
            const permissions = await ctx.prisma.permission.findMany({
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
                    Role: true
                },
            })
            return {
                data: permissions,
                total: await ctx.prisma.permission.count(),
                itemPerPage,
            };
        }),
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
                roleId: z.string().nullable(),

            })
        )
        .mutation(async ({ ctx, input }) => {
            const permission = await ctx.prisma.permission.create({
                data: {
                    name: input.name,
                    roleId: input.roleId ?? null,

                },
            });
            return permission;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.string(),
                isAllow: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const permission = await ctx.prisma.permission.update({
                where: {
                    id: input.id,
                },
                data: {
                    isAllow: input.isAllow,
                },
            });
            if (!permission) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Permission not found",
                });
            }
            return permission;
        }),
});

