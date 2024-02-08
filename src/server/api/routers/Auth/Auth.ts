import { TRPCError } from "@trpc/server";
import { compare } from "bcrypt";
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
            message: 'Role not exist',
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
 
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.setHeader('Set-Cookie', serialize("access_token", "", {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: -1,
    }))
    return;
  }),


  me: AuthMiddleware.query(async ({ ctx }) => {
    if (!ctx.req.cookies.access_token)
      return null;

    const res = jwt.verify(ctx.req.cookies.access_token, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload;

    const checkUser = (await ctx.prisma.user.findUnique({
      where: {
        username: res.username as string,
      },
      include: {
        roles: true,
      },
    })) as unknown as User;
    if (checkUser)
      return {
        username: checkUser.username,
      };
    return null;
  }),
});

