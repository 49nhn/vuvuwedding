import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const roleRouter = createTRPCRouter({
    list: AuthMiddleware
        .input(
            z.object({
                page: z.number(),
                filter: z.object({
                    string: z.string().nullable(),
                    sort: z.number().nullable(),
                }).nullable(),
                itemPerPage: z.number().nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            const page = Number(input.page) - 1 || 0;
            const itemPerPage = input.itemPerPage ?? 10;
            const roles = await ctx.prisma.role.findMany({
                where: {
                    name: {
                        contains: input.filter?.string ?? "",
                    },
                },
                skip: page * itemPerPage,
                take: itemPerPage,
                orderBy: {
                    id: input.filter?.sort === 1 ? "asc" : "desc",
                },
                include: {
                    Permissions: true
                },
            }
            )
            return {
                data: roles,
                total: await ctx.prisma.role.count(),
                itemPerPage,
            };
        }),
    create: AuthMiddleware
        .input(
            z.object({
                name: z.string(),
                permissions: z.array(z.string()).nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            const role = await ctx.prisma.role.create({
                data: {
                    name: input.name,
                    Permissions: {
                        create: input.permissions?.map((id) => ({ Permission: { connect: { id } }, name: '' })),
                    },
                },
            });
            return role;
        }),
    update: AuthMiddleware
        .input(
            z.object({
                id: z.string(),
                name: z.string(),
                permissionIds: z.array(z.string()).nullable(),

            })
    )
        .query(async ({ ctx, input }) => {
            const role = await ctx.prisma.role.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    Permissions: {
                        set: input.permissionIds?.map((id) => ({ id })),
                    },
                },
            });
            return role;
        }),
});

