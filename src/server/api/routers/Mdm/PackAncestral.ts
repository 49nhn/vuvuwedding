import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const packAncestralRouter = createTRPCRouter({
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

                const packAncestrals = await ctx.prisma.packAncestral.findMany(
                    {
                        skip: page * itemPerPage,
                        take: itemPerPage,
                        where: {
                            name: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.name ?? undefined,
                            },
                        },
                        orderBy: sort,
                    });
                if (!packAncestrals) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
                return {
                    items: packAncestrals,
                    total: await ctx.prisma.packAncestral.count(),
                };
            }
        ),
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
                flowerGateType: z.number(),
                flower : z.number(),
                flowerTable : z.number(),
                priceStart : z.number(),
                priceEnd : z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const packAncestral = await ctx.prisma.packAncestral.create({
                data: {
                    name: input.name,
                    flowerGateType: input.flowerGateType,
                    flower: input.flower,
                    flowerTable: input.flowerTable,
                    priceStart: input.priceStart,
                    priceEnd: input.priceEnd,
                },
            });
            if (!packAncestral) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
            return packAncestral;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                flowerGateType: z.number(),
                flower : z.number(),
                flowerTable : z.number(),
                priceStart : z.number(),
                priceEnd : z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const packAncestral = await ctx.prisma.packAncestral.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    flowerGateType: input.flowerGateType,
                    flower: input.flower,
                    flowerTable: input.flowerTable,
                    priceStart: input.priceStart,
                    priceEnd: input.priceEnd,
                },
            });
            if (!packAncestral) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
            return packAncestral;
        }),
    delete: AuthMiddleware
        .input(
            z.number(),
        )
        .mutation(async ({ ctx, input }) => {
            const packAncestral = await ctx.prisma.packAncestral.delete({
                where: {
                    id: input,
                },
            });
            if (!packAncestral) new TRPCError({ code: "NOT_FOUND", message: "Permission not found" });
            return packAncestral;
        }),

});

