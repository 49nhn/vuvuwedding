import type { Context } from '~/server/api/trpc';
import type { User } from '@prisma/client';
import { middleware, publicProcedure } from '~/server/api/trpc';
import * as jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

export const AuthMiddleware = publicProcedure.use(middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.req.cookies.access_token)
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    const res = jwt.verify(ctx.req.cookies.access_token, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload;

    const checkUser = (await ctx.prisma.user.findUnique({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            username: res.username,
        },
    })) as unknown as User;
    if (!checkUser) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return opts.next({
        ctx: {
            ...ctx,
            user: checkUser,
        },
    });
}));

export interface authContext extends Context {
    user: User;
}