import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";
import { TRPCError } from "@trpc/server";

export const roleRouter = createTRPCRouter({

    getList: AuthMiddleware
        .input(
            z.object({
                page: z.number(),
                filter: z.object({
                    name: z.string().nullish(),
                    description: z.string().nullish(),
                }).nullish(),
                sort: z.array(z.object({
                        field: z.string(),
                        order: z.enum(['asc', 'desc']).optional().nullish(),
                    }
                )).nullable(),
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

                const roles = await ctx.prisma.role.findMany(
                    {
                        skip: page * itemPerPage,
                        take: itemPerPage,
                        where: {
                            name: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.name ?? undefined,
                            },
                            description: input?.filter?.description ?? undefined,
                        },
                        include: {
                            permissions: true,
                            Users: {
                                select: {
                                    id: true,
                                    username: true,
                                    fullName: true,
                                    phone: true,
                                },
                            }
                        },
                        orderBy: sort,
                    });
                if (!roles) new TRPCError({ code: "NOT_FOUND", message: "Role not found" });
                return {
                    items: roles,
                    total: await ctx.prisma.role.count(),
                    itemPerPage,
                };
            }
        ),
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
                description: z.string().nullish(),
                permissions: z.array(
                    z.number()
                ).nullish(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const role = await ctx.prisma.role.create({
                data: {
                    name: input.name,
                    description: input.description,
                    permissions: {
                        connect: input.permissions?.map((id) => ({ id: id })) 
                    },
                },
            });
            if (!role) new TRPCError({ code: "NOT_FOUND", message: "Role not found" });
            return role;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                    id: z.number(),
                    name: z.string(),
                    description: z.string().nullish(),
                    permissions: z.array(
                        z.number()
                    ).nullish(),
                }
            )
        )
        .mutation(async ({ ctx, input }) => {
            const role = await ctx.prisma.role.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    description: input.description,
                    permissions: {
                        set: input.permissions?.map((id) => ({ id: id })) 
                    },
                },
            });
            if (!role) new TRPCError({ code: "NOT_FOUND", message: "Role not found" });
            return role;
        }),
    delete: AuthMiddleware
        .input(
            z.number()
        )
        .mutation(async ({ ctx, input }) => {
                const department = await ctx.prisma.role.delete({
                    where: {
                        id: input,
                    },
                });
                if (!department) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
                return department;
            }
        ),

});