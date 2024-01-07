import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const departmentRouter = createTRPCRouter({
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
            }).nullable()
        )
        .query(async ({ ctx, input }) => {
                const page = Number(input?.page) - 1 || 0;
                const itemPerPage = input?.itemPerPage ?? 10;
                const sort = input?.sort ? input.sort.map((item) => ({
                        [item.field]: item.order,
                    })
                ) : undefined;

                const departments = await ctx.prisma.department.findMany(
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
                        orderBy: sort,
                    });
                if (!departments) throw new TRPCError({ code: "NOT_FOUND", message: "Department not found" })
                return {
                    data: departments,
                    total: await ctx.prisma.department.count(),
                    itemPerPage,
                };
            }
        ),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
                const department = await ctx.prisma.department.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name,
                        description: input.description,
                    },
                });
                if (!department) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
                return department;
            }
        ),
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
                description: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
                const department = await ctx.prisma.department.create({
                    data: {
                        name: input.name,
                        description: input.description,
                    },
                });
                if (!department) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
                return department;
            }
        ),
    delete: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
                const department = await ctx.prisma.department.delete({
                    where: {
                        id: input.id,
                    },
                });
                if (!department) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
                return department;
            }
        ),
    
  


});
