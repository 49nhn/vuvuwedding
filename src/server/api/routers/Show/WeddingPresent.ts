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

export const weddingPresentRouter = createTRPCRouter({
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

                const weddingPresents = await ctx.prisma.photo.findMany(
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
                if (!weddingPresents) throw new TRPCError({ code: "NOT_FOUND", message: "Photos not found" })
                return {
                    items:weddingPresents,
                    total: await ctx.prisma.photo.count(),
                    itemPerPage,
                };
            }
        ),
});    
    