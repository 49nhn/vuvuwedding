import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";
import { TRPCError } from "@trpc/server";

export const numberingConfig = createTRPCRouter({

    getList: AuthMiddleware
        .input(
            z.object({
                page: z.number(),
                filter: z.object({
                    name: z.string().nullish(),
                    prefix: z.string().nullish(),
                    description: z.string().nullish(),
                    suffix: z.string().nullish(),
                    number: z.number().nullish(),
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

                const numberingConfigs = await ctx.prisma.numberingConfig.findMany(
                    {
                        skip: page * itemPerPage,
                        take: itemPerPage,
                        where: {
                            name: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.name ?? undefined,
                            },
                            prefix: input?.filter?.prefix ?? undefined,
                            description: input?.filter?.description ?? undefined,
                            suffix: input?.filter?.suffix ?? undefined,
                            number: input?.filter?.number ?? undefined,
                        },
                        orderBy: sort,
                    });
                if (!numberingConfigs) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
                return {
                    data: numberingConfigs,
                    total: await ctx.prisma.numberingConfig.count(),
                    itemPerPage,
                };
            }
        ),
    
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
                prefix: z.string(),
                description: z.string().nullish(),
                suffix: z.string(),
                number: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const numberingConfig = await ctx.prisma.numberingConfig.create({
                data: {
                    name: input.name,
                    prefix: input.prefix,
                    description: input.description,
                    suffix: input.suffix,
                    number: input.number,
                },
            });
            if (!numberingConfig) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
            return numberingConfig;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                prefix: z.string(),
                description: z.string().nullish(),
                suffix: z.string(),
                number: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const numberingConfig = await ctx.prisma.numberingConfig.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    prefix: input.prefix,
                    description: input.description,
                    suffix: input.suffix,
                    number: input.number,
                },
            });
            if (!numberingConfig) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
            return numberingConfig;
        }),
    delete: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const numberingConfig = await ctx.prisma.numberingConfig.delete({
                where: {
                    id: input.id,
                },
            });
            if (!numberingConfig) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
            return numberingConfig;
        }),
    getOne: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const numberingConfig = await ctx.prisma.numberingConfig.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!numberingConfig) new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
            return numberingConfig;
        }),
});