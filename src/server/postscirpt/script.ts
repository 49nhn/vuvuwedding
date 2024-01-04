// import { PrismaClient, type Role } from '@prisma/client';
// import bcsrypt from 'bcrypt'
//
// export const prisma = new PrismaClient({})
//
// async function initAdmin() {
//     const permissionRole = [
//         {
//             role: 'admin', permission: [
//                 { name: 'create', value: true },
//                 { name: 'read', value: true },
//                 { name: 'update', value: true },
//                 { name: 'delete', value: true },
//             ]
//         },
//         {
//             role: 'CEO',
//             permission: [
//                 { name: 'create', value: true },
//                 { name: 'read', value: true },
//                 { name: 'update', value: true },
//                 { name: 'delete', value: true },
//             ]
//
//         },
//         {
//             role: 'Manager', permission: [
//                 { name: 'create', value: true },
//                 { name: 'read', value: true },
//                 { name: 'update', value: true },
//                 { name: 'delete', value: false },
//             ]
//         },
//         {
//             role: 'Staff', permission: [
//                 { name: 'create', value: false },
//                 { name: 'read', value: true },
//                 { name: 'update', value: false },
//                 { name: 'delete', value: false },
//             ]
//         },
//     ]
//
//     for (const item of permissionRole) {
//         const role = await prisma.role.findUnique({
//             where: {
//                 name: item.role
//             }
//         })
//         if (!role) {
//             await prisma.role.create({
//                 data: {
//                     name: item.role,
//                 }
//             })
//             for (const permission of item.permission) {
//                 await prisma.permission.create({
//                     data: {
//                         name: permission.name,
//                         isAllow: permission.value,
//                         Role: {
//                             connect: {
//                                 name: item.role
//                             }
//                         }
//                     }
//                 })
//             }
//         }
//     }
//     console.log('init role success')
//     const adminRole = await prisma.role.findUnique({
//         where: {
//             name: 'admin'
//         }
//     })
//
//     let admin = await prisma.user.findUnique({
//         where: {
//             username: 'admin'
//         }
//     })
//
//     if (!admin || !adminRole) {
//         admin = await prisma.user.create({
//             data: {
//                 username: 'admin',
//                 password: bcsrypt.hashSync("VuvuWedding@2021", 10),
//                 roles: {
//                     connect: {
//                         id: adminRole?.id
//                     }
//                 }
//             }
//         })
//     }
// }
//
//
//
// void initAdmin()