/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

// @ts-ignore
export const showsRouter = createTRPCRouter({
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

                const shows = await ctx.prisma.shows.findMany(
                    {
                        skip: page * itemPerPage,
                        take: itemPerPage,
                        where: {
                            title: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.name ?? undefined,
                            },
                            description: input?.filter?.description ?? undefined,
                        },
                        orderBy: sort,
                        include: {
                            decorations: true,
                            weddingPresents: true,
                            photos: true,
                            makeups: true,
                            weddingDresses: true,
                            weddingFlowers: true,
                            others: true,
                            _count: {
                                select: {
                                    salesMan: true,
                                    decorations: true,
                                    weddingPresents: true,
                                    photos: true,
                                    makeups: true,
                                    weddingDresses: true,
                                    weddingFlowers: true,
                                    others: true
                                },
                            },
                        },
                    });
                if (!shows) throw new TRPCError({ code: "NOT_FOUND", message: "Department not found" })
                return {
                    items: shows,
                    total: await ctx.prisma.shows.count(),
                    itemPerPage,
                };
            }
        ),
    create: AuthMiddleware
        .input(
            z.object({
                title: z.string(),
                status: z.number(),
                totalPrice: z.number(),
                deposits: z.number(),
                balance: z.number(),
                description: z.string(),
                brideName: z.string(),
                bridePhone: z.string(),
                brideAddress: z.string(),
                groomName: z.string(),
                groomPhone: z.string(),
                groomAddress: z.string(),
                otherContact: z.string(),
                saleManId: z.array(z.number()),
                decorations: z.array(z.object({
                    title: z.string(),
                    description: z.string(),
                    price: z.number(),
                    dateShowStart: z.string(),
                    tone_rem: z.string(),
                    tone_hoa: z.string(),
                    so_phong: z.string(),
                    ban_ghe: z.string(),
                    ban_tho: z.string(),
                    tru_qua: z.string(),
                    khung: z.string(),
                    cong: z.string(),
                    chu_hy: z.string(),
                    chai_nuoc: z.string(),
                    cam_hoa: z.string(),
                    den: z.string(),
                    trai_ban: z.string(),
                    lung_ghe: z.string(),
                    rap: z.string(),
                    ban_tron: z.string(),
                    packAncestralId: z.string(),
                    ceremonyType: z.string(),
                })).nullish(),
                weddingPresents: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                photos: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                makeups: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                weddingDresses: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                weddingFlowers: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                others: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
            })
        )

        .mutation(async ({ ctx, input }) =>
            await ctx.prisma.shows.create({
                data: {
                    title: input.title,
                    status: input.status,
                    totalPrice: input.totalPrice,
                    deposits: input.deposits,
                    balance: input.balance,
                    createdBy: ctx.user?.username,
                    description: input.description,
                    brideName: input.brideName,
                    bridePhone: input.bridePhone,
                    brideAddress: input.brideAddress,
                    groomName: input.groomName,
                    groomPhone: input.groomPhone,
                    groomAddress: input.groomAddress,
                    otherContact: input.otherContact,
                    salesMan: {
                        connect: input.saleManId.map((item) => ({
                            id: item,
                        })),
                    },
                    decorations: {
                        create: input.decorations?.map((item) => ({
                                title: item.title,
                                description: item.description,
                                price: item.price,
                                packAncestralId: Number(item.packAncestralId),
                                ceremonyType: Number(item.ceremonyType),
                                dateShowStart: new Date(item.dateShowStart),
                                tone_rem: item.tone_rem,
                                tone_hoa: item.tone_hoa,
                                so_phong: item.so_phong,
                                ban_ghe: item.ban_ghe,
                                ban_tho: item.ban_tho,
                                tru_qua: item.tru_qua,
                                khung: item.khung,
                                cong: item.cong,
                                chu_hy: item.chu_hy,
                                chai_nuoc: item.chai_nuoc,
                                cam_hoa: item.cam_hoa,
                                den: item.den,
                                trai_ban: item.trai_ban,
                                lung_ghe: item.lung_ghe,
                                rap: item.rap,
                                ban_tron: item.ban_tron,
                            })
                        ),
                    },
                    weddingPresents: {
                        create: input.weddingPresents?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                            })
                        ),
                    },
                    photos: {
                        create: input.photos?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                            })
                        ),
                    },
                    makeups: {
                        create: input.makeups?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                            })
                        ),
                    },
                    weddingDresses: {
                        create: input.weddingDresses?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                            })
                        ),
                    },
                    weddingFlowers: {
                        create: input.weddingFlowers?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                            })
                        ),
                    },
                    others: {
                        create: input.others?.map((item) => ({
                                id: item.id,
                                title: item.title,
                                price: item.price,
                                description: item.description,
                            })
                        ),
                    },
                },
            })),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
                title: z.string(),
                status: z.number(),
                totalPrice: z.number(),
                deposits: z.number(),
                balance: z.number(),
                flowerGate: z.string(),
                description: z.string(),
                brideName: z.string(),
                bridePhone: z.string(),
                brideAddress: z.string(),
                groomName: z.string(),
                groomPhone: z.string(),
                groomAddress: z.string(),
                otherContact: z.string(),
                dateShowStart: z.string(),
                dateShowEnd: z.string(),
                saleManId: z.array(z.number()),
                decorations: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    description: z.string(),
                    price: z.number(),
                    dateShowStart: z.string(),
                    tone_rem: z.string(),
                    tone_hoa: z.string(),
                    so_phong: z.string(),
                    ban_ghe: z.string(),
                    ban_tho: z.string(),
                    tru_qua: z.string(),
                    khung: z.string(),
                    cong: z.string(),
                    chu_hy: z.string(),
                    chai_nuoc: z.string(),
                    cam_hoa: z.string(),
                    den: z.string(),
                    trai_ban: z.string(),
                    lung_ghe: z.string(),
                    rap: z.string(),
                    ban_tron: z.string(),
                    packAncestralId: z.string(),
                    ceremonyType: z.string(),
                })).nullish(),
                weddingPresents: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                photos: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                makeups: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                weddingDresses: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                weddingFlowers: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
                others: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                })).nullish(),
            })
        )
        .mutation(async ({ ctx, input }) => {
                const shows = await ctx.prisma.shows.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        title: input.title,
                        status: input.status,
                        totalPrice: input.totalPrice,
                        deposits: input.deposits,
                        balance: input.balance,
                        description: input.description,
                        brideName: input.brideName,
                        bridePhone: input.bridePhone,
                        brideAddress: input.brideAddress,
                        groomName: input.groomName,
                        groomPhone: input.groomPhone,
                        groomAddress: input.groomAddress,
                        otherContact: input.otherContact,
                        salesMan: {
                            connect: input.saleManId.map((item) => ({
                                id: item,
                            })),
                        },
                        decorations: {
                            upsert: input.decorations?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        description: item.description,
                                        price: item.price,
                                        packAncestralId: Number(item.packAncestralId),
                                        ceremonyType: Number(item.ceremonyType),
                                        dateShowStart: new Date(item.dateShowStart),
                                        tone_rem: item.tone_rem,
                                        tone_hoa: item.tone_hoa,
                                        so_phong: item.so_phong,
                                        ban_ghe: item.ban_ghe,
                                        ban_tho: item.ban_tho,
                                        tru_qua: item.tru_qua,
                                        khung: item.khung,
                                        cong: item.cong,
                                        chu_hy: item.chu_hy,
                                        chai_nuoc: item.chai_nuoc,
                                        cam_hoa: item.cam_hoa,
                                        den: item.den,
                                        trai_ban: item.trai_ban,
                                        lung_ghe: item.lung_ghe,
                                        rap: item.rap,
                                        ban_tron: item.ban_tron,
                                    },
                                    create: {
                                        title: item.title,
                                        description: item.description,
                                        price: item.price,
                                        packAncestralId: Number(item.packAncestralId),
                                        ceremonyType: Number(item.ceremonyType),
                                        dateShowStart: new Date(item.dateShowStart),
                                        tone_rem: item.tone_rem,
                                        tone_hoa: item.tone_hoa,
                                        so_phong: item.so_phong,
                                        ban_ghe: item.ban_ghe,
                                        ban_tho: item.ban_tho,
                                        tru_qua: item.tru_qua,
                                        khung: item.khung,
                                        cong: item.cong,
                                        chu_hy: item.chu_hy,
                                        chai_nuoc: item.chai_nuoc,
                                        cam_hoa: item.cam_hoa,
                                        den: item.den,
                                        trai_ban: item.trai_ban,
                                        lung_ghe: item.lung_ghe,
                                        rap: item.rap,
                                        ban_tron: item.ban_tron,
                                    },
                                })
                            ),
                        },
                        weddingPresents: {
                            upsert: input.weddingPresents?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                })
                            ),
                        },
                        photos: {
                            upsert: input.photos?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                })
                            ),
                        },
                        makeups: {
                            upsert: input.makeups?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                })
                            ),
                        },
                        weddingDresses: {
                            upsert: input.weddingDresses?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                })
                            ),
                        },
                        weddingFlowers: {
                            upsert: input.weddingFlowers?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                })
                            ),
                        },
                        others: {
                            upsert: input.others?.map((item) => ({
                                    where: {
                                        id: item.id,
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                    },
                                })
                            ),
                        },
                    },
                });
                if (!shows) new TRPCError({ code: "NOT_FOUND", message: "Shows not found" });
                return shows;
            }
        ),

    delete: AuthMiddleware
        .input(
            z.number()
        )
        .mutation(async ({ ctx, input }) => {
                const shows = await ctx.prisma.shows.delete({
                    where: {
                        id: input,
                    },
                });
                if (!shows) new TRPCError({ code: "NOT_FOUND", message: "Shows not found" });
                return shows;
            }
        ),

});
