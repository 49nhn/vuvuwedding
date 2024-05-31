/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const makeUpRouter = createTRPCRouter({
        getList: AuthMiddleware
            .input(
                z.object({
                    page: z.number(),
                    filter: z.object({
                        title: z.string().nullish(),
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

                    const makeUps = await ctx.prisma.photo.findMany(
                        {
                            skip: page * itemPerPage,
                            take: itemPerPage,
                            where: {
                                title: {
                                    contains: input?.search ?? undefined,
                                    equals: input?.filter?.title ?? undefined,
                                },
                                description: input?.filter?.description ?? undefined,
                            },
                            orderBy: sort,
                        });
                    if (!makeUps) throw new TRPCError({ code: "NOT_FOUND", message: "Photos not found" })
                    return {
                        items: makeUps,
                        total: await ctx.prisma.photo.count(),
                        itemPerPage,
                    };
                }
            ),
        delete: AuthMiddleware
            .input(
                z.number()
            )
            .mutation(async ({ ctx, input }) => {
                    const decorations = await ctx.prisma.makeup.delete({
                        where: {
                            id: input,
                        },
                    });
                    if (!decorations) new TRPCError({ code: "NOT_FOUND", message: "Shows not found" });
                    return decorations;
                }
            ),

    },
);    
    