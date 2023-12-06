import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AuthMiddleware } from "~/server/middleware/Auth.middleware";

export const employeeRouter = createTRPCRouter({
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
            const employees = await ctx.prisma.employee.findMany(
                {
                    skip: page * itemPerPage,
                    take: itemPerPage,
                    include: {
                        salesmans: true,
                        JobNames: {
                            include: {
                                JobCategory: true,
                            },
                        },
                        User: {
                            include: {
                                roles: true,
                            },
                        },
                    },

                });

            if (!employees) throw new TRPCError({ code: "NOT_FOUND" });
            const data = employees.map(({ salesmans, jobNameId, JobNames, User, userId, ...employees }) => {
                return {
                    role: User?.roles?.name,
                    salesman: salesmans ? true : false,
                    jobNames: [...new Set(JobNames.map((jobName) => jobName.JobCategory?.name))],
                    users: User ? User.username : undefined,
                    ...employees,
                };
            });
            return {
                data,
                total: await ctx.prisma.employee.count(),
                itemPerPage,
            };

        }),
    createJobCategory: publicProcedure
        .input(
            z.object({
                jobCategoryName: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const jobCategory = await ctx.prisma.jobCategory.findUnique({
                where: {
                    name: input.jobCategoryName,
                },
            });

            if (jobCategory) throw new TRPCError({ code: "FORBIDDEN", message: "Job Category already exists" });
            return await ctx.prisma.jobCategory.create({
                data: {
                    name: input.jobCategoryName,
                },
            });
        }),
    createJobname: publicProcedure
        .input(
            z.object({
                jobCategory: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.jobName.create({
                data: {
                    JobCategory: {
                        connect: {
                            name: input.jobCategory,
                        },
                    },
                },
            });
        }),
    getJobname: publicProcedure
        .query(async ({ ctx }) => {
            const jobnames = await ctx.prisma.jobName.findMany();
            return jobnames;
        }),
    getJobCategory: publicProcedure
        .query(async ({ ctx }) => {
            const jobCategories = await ctx.prisma.jobCategory.findMany();
            return jobCategories;
        }),
    deleteEmployee: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const employee = await ctx.prisma.employee.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!employee) throw new TRPCError({ code: "NOT_FOUND" });
            return await ctx.prisma.employee.delete({
                where: {
                    id: input.id,
                },
            });
        }),


});
