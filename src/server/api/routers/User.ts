import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcrypt";
import { z } from "zod";
import jwt from 'jsonwebtoken';

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { serialize } from "cookie";
import type { User } from "@prisma/client";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string().min(8).max(24),
      })
    )
    .mutation(async ({ ctx, input }) => {
      {
        const user = await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });
        if (!user)
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User not exist',
          });
        const comparePassword = await compare(input.password, user.password);
        if (comparePassword) {
          const access_token = jwt.sign({ username: user.username }, process.env.NEXTAUTH_SECRET!, {
            expiresIn: '24h',
          });
          ctx.res.setHeader('Set-Cookie', serialize("access_token", access_token, {
            secure: true,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
          }))

          return {
            message: 'Success',
          };
        }
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
    }),
  register: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string().min(8).max(24),
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
        },
      })) as unknown as User;
      return {
        message: 'Success',
      };
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.setHeader('Set-Cookie', serialize("access_token", "", {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: -1,
    }))
    return;
  }),
  authenticate: AuthMiddleware.mutation(async ({ ctx }) => {
    if (!ctx.req.cookies.access_token)
      return {
        authenticate: false,
      };
    const res = jwt.verify(ctx.req.cookies.access_token, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload;

    const checkUser = (await ctx.prisma.user.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        username: res.username as string,
      },
    })) as unknown as User;
    if (checkUser)
      return {
        authenticate: true,
      };
    return {
      authenticate: false,
    };
  }),
});

