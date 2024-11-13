import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const permissionRouter = createTRPCRouter({
    getList: AuthMiddleware
        .input(
            z.object({
                page: z.number(),
                filter: z.object({
                    name: z.string().nullish(),
                }).nullish(),
                sort: z.array(z.object({
                        field: z.string(),
                        order: z.enum(['asc', 'desc']).optional().nullish(),
                    }
                )).nullish(),
                search: z.string().nullish(),
                itemPerPage: z.number().nullish(),
            }).nullish()
        )
        .query(async ({ ctx, input }) => {
                const page = Number(input?.page) - 1 || 0;
                const itemPerPage = input?.itemPerPage ?? 10;
                const sort = input?.sort ? input.sort.map((item) => ({
                        [item.field]: item.order,
                    })
                ) : undefined;

                const permissions = await ctx.prisma.permission.findMany(
                    {
                        skip: page * itemPerPage,
                        take: itemPerPage,
                        where: {
                            name: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.name ?? undefined,
                            },
                        },
                        include: {
                            Roles: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                        orderBy: sort,
                    });
                if (!permissions) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
                return {
                    items: permissions,
                    total: await ctx.prisma.permission.count(),
                };
            }
        ),
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const permission = await ctx.prisma.permission.create({
                data: input,
            });
            if (!permission) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
            return permission;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.string(),
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const permission = await ctx.prisma.permission.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                }
            });
            if (!permission) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
            return permission;
        }),
    delete: AuthMiddleware
        .input(
            z.string(),
        )
        .mutation(async ({ ctx, input }) => {
            const permission = await ctx.prisma.permission.delete({
                where: {
                    id: input,
                },
            });
            if (!permission) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
            return permission;
        }),

});

