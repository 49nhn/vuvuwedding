import { PrismaClient, type Role } from '@prisma/client';
import bcsrypt from 'bcrypt'

export const prisma = new PrismaClient({})

async function initAdmin() {
    let adminRole = await prisma.role.findUnique({
        where: {
            name: 'admin'
        }
    })

    let admin = await prisma.user.findUnique({
        where: {
            username: 'admin'
        }
    })

    if (!admin || !adminRole) {
        adminRole = await prisma.role.create({
            data: {
                name: 'admin',
            }
        }) as unknown as Role

        admin = await prisma.user.create({
            data: {
                username: 'admin',
                password: bcsrypt.hashSync("VuvuWedding@2021", 10),
                roleId: adminRole.id
            }
        })
    }
}

void initAdmin()