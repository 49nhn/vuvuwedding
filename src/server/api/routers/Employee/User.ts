import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";
import bcsrypt from 'bcrypt'

export const userRouter = createTRPCRouter({
    getList: AuthMiddleware
        .input(
            z.object({
                page: z.number(),
                filter: z.object({
                    fullName: z.string().nullish(),
                    username: z.string().nullish(),

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

                const users = await ctx.prisma.user.findMany(
                    {
                        skip: page * itemPerPage,
                        take: itemPerPage,
                        where: {
                            fullName: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.fullName ?? undefined,
                            },
                            username: {
                                contains: input?.search ?? undefined,
                                equals: input?.filter?.username ?? undefined,
                            },
                        },
                        include: {
                            roles: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                        orderBy: sort,
                    });
                if (!users) new TRPCError({ code: "NOT_FOUND", message: "User not found" });

                const data = users.map((item) => ({
                    ...item,
                    password: '',
                    birthday: item.birthday?.toLocaleDateString("vi-VN"),
                    createdAt: item.createdAt?.toISOString().split('T')[0],
                    deleteAt: item.deletedAt?.toISOString().split('T')[0],
                }))
                return {
                    items: data,
                    total: await ctx.prisma.user.count(),
                };
            }
        ),
    create: AuthMiddleware
        .input(
            z.object({
                fullName: z.string().nullish(),
                username: z.string(),
                password: z.string(),
                email: z.string().nullish(),
                phone: z.string().nullish(),
                address: z.string().nullish(),
                salary: z.number().nullish(),
                birthday: z.date().nullish(),
                roles: z.array(z.string()).nullish(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const password = bcsrypt.hashSync(input.password, 10)
            const user = await ctx.prisma.user.create({
                data: {
                    fullName: input.fullName,
                    username: input.username,
                    password: password,
                    email: input.email,
                    phone: input.phone,
                    address: input.address,
                    salary: input.salary ?? 0,
                    birthday: input.birthday,
                    roles: {
                        connect: input.roles?.map((item) => ({
                                name: item,
                            })
                        ),
                    },
                },
            });
            if (!user) new TRPCError({ code: "NOT_FOUND", message: "User not found" });
            return user;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.number(),
                fullName: z.string().nullish(),
                email: z.string().nullish(),
                phone: z.string().nullish(),
                address: z.string().nullish(),
                salary: z.number().nullish(),
                birthday: z.date().nullish(),
                roles: z.array(z.string()).nullish(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.update({
                where: {
                    id: input.id,
                },
                data: {
                    fullName: input.fullName,
                    email: input.email,
                    phone: input.phone,
                    address: input.address,
                    salary: input.salary ?? 0,
                    birthday: input.birthday,
                    roles: {
                        connect: input.roles?.map((item) => ({
                                name: item,
                            })
                        ),
                    },
                },
            });
            if (!user) new TRPCError({ code: "NOT_FOUND", message: "User not found" });
            return {
                ...user,
                birthday: user.birthday?.toISOString().split('T')[0],
            }
        }),
    delete: AuthMiddleware
        .input(
            z.number(),
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.delete({
                where: {
                    id: input,
                },
            });
            if (!user) new TRPCError({ code: "NOT_FOUND", message: "User not found" });
            return user;
        }),

});
