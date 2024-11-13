import { PrismaClient } from '@prisma/client';
import bcsrypt from 'bcrypt'

export const prisma = new PrismaClient({})

const permissions = [
    {
        name: "create:users",
        description: "Create user permission"
    },
    {
        name: "read:users",
        description: "Read user permission"
    },
    {
        name: "update:users",
        description: "Update user permission"
    },
    {
        name: "delete:users",
        description: "Delete user permission"
    },
    {
        name: "create:roles",
        description: "Create role permission"
    },
    {
        name: "read:roles",
        description: "Read role permission"
    },
    {
        name: "update:roles",
        description: "Update role permission"
    },
    {
        name: "delete:roles",
        description: "Delete role permission"
    },
    {
        name: "create:permissions",
        description: "Create permission permission"
    },
    {
        name: "read:permissions",
        description: "Read permission permission"
    },
    {
        name: "update:permissions",
        description: "Update permission permission"
    },
    {
        name: "delete:permissions",
        description: "Delete permission permission"
    },

    {
        name: "create:packAncestral",
        description: "Create packAncestral permission"
    },
    {
        name: "read:packAncestral",
        description: "Read packAncestral permission"
    },
    {
        name: "update:packAncestral",
        description: "Update packAncestral permission"
    },
    {
        name: "delete:packAncestral",
        description: "Delete packAncestral permission"
    },

    {
        name: "create:department",
        description: "Create department permission"
    },
    {
        name: "read:department",
        description: "Read department permission"
    },
    {
        name: "update:department",
        description: "Update department permission"
    },
    {
        name: "delete:department",
        description: "Delete department permission"
    },

    {
        name: "create:shows",
        description: "Create shows permission"
    },
    {
        name: "read:shows",
        description: "Read shows permission"
    },
    {
        name: "update:shows",
        description: "Update shows permission"
    },
    {
        name: "delete:shows",
        description: "Delete shows permission"
    },

    {
        name: "create:decoration",
        description: "Create decoration permission"
    },
    {
        name: "read:decoration",
        description: "Read decoration permission"
    },
    {
        name: "update:decoration",
        description: "Update decoration permission"
    },
    {
        name: "delete:decoration",
        description: "Delete decoration permission"
    },

    {
        name: "create:photo",
        description: "Create photo permission"
    },
    {
        name: "read:photo",
        description: "Read photo permission"
    },
    {
        name: "update:photo",
        description: "Update photo permission"
    },
    {
        name: "delete:photo",
        description: "Delete photo permission"
    },

    {
        name: "create:weddingPresent",
        description: "Create weddingPresent permission"
    },
    {
        name: "read:weddingPresent",
        description: "Read weddingPresent permission"
    },
    {
        name: "update:weddingPresent",
        description: "Update weddingPresent permission"
    },
    {
        name: "delete:weddingPresent",
        description: "Delete weddingPresent permission"
    },

    {
        name: "create:weddingDress",
        description: "Create weddingDress permission"
    },
    {
        name: "read:weddingDress",
        description: "Read weddingDress permission"
    },
    {
        name: "update:weddingDress",
        description: "Update weddingDress permission"
    },
    {
        name: "delete:weddingDress",
        description: "Delete weddingDress permission"
    },

    {
        name: "create:makeup",
        description: "Create makeup permission"
    },
    {
        name: "read:makeup",
        description: "Read makeup permission"
    },
    {
        name: "update:makeup",
        description: "Update makeup permission"
    },
    {
        name: "delete:makeup",
        description: "Delete makeup permission"
    },

    {
        name: "create:weddingDress",
        description: "Create weddingDress permission"
    },
    {
        name: "read:weddingDress",
        description: "Read weddingDress permission"
    },
    {
        name: "update:weddingDress",
        description: "Update weddingDress permission"
    },
    {
        name: "delete:weddingDress",
        description: "Delete weddingDress permission"
    },

    {
        name: "create:weddingFlower",
        description: "Create weddingFlower permission"
    },
    {
        name: "read:weddingFlower",
        description: "Read weddingFlower permission"
    },
    {
        name: "update:weddingFlower",
        description: "Update weddingFlower permission"
    },
    {
        name: "delete:weddingFlower",
        description: "Delete weddingFlower permission"
    }
]

async function initAdmin() {

    for  (let i = 0; i < permissions.length; i++) {
        const permission = permissions[i]
        const perm = await prisma.permission.findFirst({
            where: {
                name: permission.name
            }
        })
        if (!perm) {
            await prisma.permission.create({
                data: permission
            })
        }
    }

    const admin = await prisma.user.findFirst({
        where: {
            username: "admin"
        }
    })
    const rolesAdmin = await prisma.role.findFirst({
        where: {
            name: "admin"
        }
    })

    if (admin) {
        console.log("Admin already exists")
        return
    }
    if (!rolesAdmin) {
        const role = await prisma.role.create({
            data: {
                name: "Admin",
                description: "Admin role"
            }
        })
        await prisma.user.create({
            data: {
                username: "admin",
                password: bcsrypt.hashSync("VuvuWedding@2021", 10),
                fullName: "Admin",
                phone: "0812345678",
                address: "123 Admin Street",
                birthday: new Date(new Date().getFullYear() - 20, 0, 1),
                roles: {
                    connect: {
                        id: role.id
                    }
                }
            }
        })
    }
}

void initAdmin()