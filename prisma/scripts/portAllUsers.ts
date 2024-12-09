import { PrismaClient } from '@prisma/client';
import { AuthError, createClient } from '@supabase/supabase-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
);



async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createSupabaseUser(email: string, password: string, retries = 0): Promise<any> {
    try {
        const { data: supabaseUser, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (error) throw error;
        return supabaseUser;
    } catch (error: any) {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying creation of Supabase user for ${email}. Attempt ${retries + 1} of ${MAX_RETRIES}`);
            await sleep(RETRY_DELAY * (retries + 1)); // Exponential backoff
            return createSupabaseUser(email, password, retries + 1);
        } else {
            console.log(`Failed to create Supabase user for ${email} after ${MAX_RETRIES} attempts:`, error);
            return null;
        }
    }
}

(async function () {

    const prisma = new PrismaClient();

    const data = await fetch("https://out-read.com/wp-json/custom/v1/all-users", {
        method: 'GET',
    });
    const users = await data.json();
    const paidUsers = users.filter((user: any) => user.roles[0] === "s2member_level1");
    const admin = users.filter((user: any) => user.roles[0] === "administrator");

    console.log(paidUsers.length)
    console.log(admin.length)



    const supabaseUsers = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const migratedUsers = await Promise.all((supabaseUsers.data.users || []).map(async (user: any) => {
        let role: 'ADMIN' | 'PAID_USER' | 'USER';
        if (admin.find((u: any) => u.email === user.email)) {
            role = "ADMIN";
        } else if (paidUsers.find((u: any) => u.email === user.email)) {
            role = "PAID_USER";
        } else {
            role = "USER";
        }

        // if (role === 'PAID_USER') {

        //     const deleteUser = await supabase.auth.admin.deleteUser(user.id)

        //     const supabaseUser = await createSupabaseUser(user.email, user.email);

        //     if (!supabaseUser) {
        //         console.error(`Skipping user ${user.email} due to Supabase creation failure`);
        //         return null;
        //     }
        // }


        const temp = users.find((u: any) => u.email === user.email);
        return {
            username: temp ? temp.username : '',
            email: user.email,
            role,
            supabaseUserId: user.id
        };
    }));

    console.log(migratedUsers.length)

    // Filter out any null values (failed migrations)
    const validUsers = migratedUsers.filter(user => user !== null) as {
        username: any;
        email: any;
        role: 'ADMIN' | 'PAID_USER' | 'USER';
        supabaseUserId: any;
    }[];
    console.log(validUsers.length)

    console.log(validUsers.filter(user => user.role === 'ADMIN').length, 'admin users');
    console.log(validUsers.filter(user => user.role === 'PAID_USER').length, 'PAID_USER');
    console.log(validUsers.filter(user => user.role === 'USER').length, 'USER');

    // Create users in Prisma database
    const createMany = await prisma.user.createMany({
        data: validUsers,
        skipDuplicates: true
    });

    console.log(`Migrated ${createMany.count} users to Prisma and Supabase`);

    await prisma.$disconnect();
})();