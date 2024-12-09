"use server";

import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResult } from "next/dist/server/app-render/types";
import { revalidatePath } from "next/cache";

export async function updateUsername(userId: string, formData: FormData): Promise<ActionResult> {

    const username = formData.get("username");


    if (typeof username !== "string") {
        return {
            error: "Invalid username"
        };
    }

    const prisma = new PrismaClient()
    const user = await prisma.user.update({ where: { id: userId }, data: { username: username } });

    return revalidatePath("/user");
}