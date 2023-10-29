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
        roleId: z.string(),
        employee: z.object({
          jobCatelogyName: z.array(z.string()),
          fullname: z.string().nullable(),
          phone: z.string().nullable(),
          email: z.string().nullable(),
          address: z.string().nullable(),
          birthDate: z.date().default(new Date()),
          salary: z.number(),
          isSalesman: z.boolean(),
        }).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
          roles: {
            connect: { id: input.roleId }
          },
          employees: {
            create:
            {
              fullName: input.employee?.fullname,
              phone: input.employee?.phone,
              email: input.employee?.email,
              address: input.employee?.address,
              birthday: input.employee?.birthDate ?? new Date(),
              salary: input.employee?.salary,
              JobNames: {
                create: input.employee?.jobCatelogyName.map((name) => ({
                  JobCategory: {
                    connect: { name },
                  },
                })),
              },
              salesmans: {
                create: input.employee?.isSalesman ? {} : undefined,
              },
            },
          },
        }
      }));
return {
  message: 'Success',
};
    }),


});

