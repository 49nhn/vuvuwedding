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
                            salesMan: {
                                select: {
                                    id: true,
                                    phone: true,
                                    fullName: true,
                                },
                            },
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
                                    others: true,
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
                salesManId: z.array(z.string()).nullish(),
                decorations: z.array(z.object({
                    title: z.string(),
                    description: z.string(),
                    price: z.number().nullish(),
                    dateShowStart: z.date(),
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
                    packAncestralId: z.string().nullish(),
                    ceremonyType: z.number().nullish(),
                })).nullish(),
                weddingPresents: z.array(z.object({
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
                })).nullish(),
                photos: z.array(z.object({
                    title: z.string(),
                    price: z.number(),
                    dateShowStart: z.date(),
                    description: z.string(),
                })).nullish(),
                makeups: z.array(z.object({
                    title: z.string(),
                    price: z.number(),
                    dateShowStart: z.date(),
                    description: z.string(),
                })).nullish(),
                weddingDresses: z.array(z.object({
                    title: z.string(),
                    price: z.number(),
                    dateShowStart: z.date(),
                    description: z.string(),
                })).nullish(),
                weddingFlowers: z.array(z.object({
                    title: z.string(),
                    price: z.number(),
                    dateShowStart: z.date(),
                    description: z.string(),
                })).nullish(),
                others: z.array(z.object({
                    title: z.string(),
                    price: z.number(),
                    dateShowStart: z.date(),
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
                        connect: input.salesManId?.map((item) => ({
                            id: item,
                        })),
                    },
                    decorations: {
                        create: input.decorations?.map((item) => ({
                                title: item.title,
                                description: item.description,
                                price: item.price ?? 0,
                                packAncestralId: item.packAncestralId ?? "",
                                ceremonyType: item.ceremonyType ?? -1,
                                dateShowStart: item.dateShowStart,
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
                                dateShowStart: item.dateShowStart,
                            })
                        ),
                    },
                    photos: {
                        create: input.photos?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                                dateShowStart: item.dateShowStart,
                            })
                        ),
                    },
                    makeups: {
                        create: input.makeups?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                                dateShowStart: item.dateShowStart,
                            })
                        ),
                    },
                    weddingDresses: {
                        create: input.weddingDresses?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                                dateShowStart: item.dateShowStart,
                            })
                        ),
                    },
                    weddingFlowers: {
                        create: input.weddingFlowers?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                                dateShowStart: item.dateShowStart,
                            })
                        ),
                    },
                    others: {
                        create: input.others?.map((item) => ({
                                title: item.title,
                                price: item.price,
                                description: item.description,
                                dateShowStart: item.dateShowStart,
                            })
                        ),
                    },
                },
            })),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.string(),
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
                salesManId: z.array(z.string()).nullish(),
                decorations: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    description: z.string(),
                    price: z.number().nullish(),
                    dateShowStart: z.date(),
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
                    packAncestralId: z.string().nullish(),
                    ceremonyType: z.number().nullish(),
                })).nullish(),
                weddingPresents: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
                })).nullish(),
                photos: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
                })).nullish(),
                makeups: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
                })).nullish(),
                weddingDresses: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
                })).nullish(),
                weddingFlowers: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
                })).nullish(),
                others: z.array(z.object({
                    id: z.string().nullish(),
                    title: z.string(),
                    price: z.number(),
                    description: z.string(),
                    dateShowStart: z.date(),
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
                            connect: input.salesManId?.map((item) => ({
                                id: item,
                            })),
                        },
                        decorations: {
                            upsert: input.decorations?.map((item) => ({
                                    where: {
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        description: item.description,
                                        price: item.price ?? 0,
                                        packAncestralId: item.packAncestralId ?? null ,
                                        ceremonyType: item.ceremonyType ?? -1,
                                        dateShowStart: item.dateShowStart,
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
                                        price: item.price ?? 0,
                                        packAncestralId: item.packAncestralId ?? -1,
                                        ceremonyType: item.ceremonyType ?? -1,
                                        dateShowStart: item.dateShowStart,
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
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                })
                            ),
                        },
                        photos: {
                            upsert: input.photos?.map((item) => ({
                                    where: {
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                })
                            ),
                        },
                        makeups: {
                            upsert: input.makeups?.map((item) => ({
                                    where: {
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                })
                            ),
                        },
                        weddingDresses: {
                            upsert: input.weddingDresses?.map((item) => ({
                                    where: {
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                })
                            ),
                        },
                        weddingFlowers: {
                            upsert: input.weddingFlowers?.map((item) => ({
                                    where: {
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                })
                            ),
                        },
                        others: {
                            upsert: input.others?.map((item) => ({
                                    where: {
                                        id: item.id ?? "",
                                    },
                                    update: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
                                    },
                                    create: {
                                        title: item.title,
                                        price: item.price,
                                        description: item.description,
                                        dateShowStart: item.dateShowStart,
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
            z.string()
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
