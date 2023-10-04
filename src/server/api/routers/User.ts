import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { User } from "@prisma/client";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const userRouter = createTRPCRouter({
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
      const users = await ctx.prisma.user.findMany(
        {
          skip: page * itemPerPage,
          take: itemPerPage,
          include: { roles: true },
        });
      return {
        data: users.map(e => ({ ...e, password: "Secure", createdAt: e.createdAt.toLocaleDateString() })),
        total: await ctx.prisma.user.count(),
        itemPerPage,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string().min(8).max(24),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      let user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User already exists',
        });
      const hashedPassword = await hash(input.password, 10);
      user = (await ctx.prisma.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          roles: { // add a default value for roles
            connect: { name: 'default' }
          }
        },
      })) as unknown as User;
      return {
        message: 'Success',
      };
    }),


});

