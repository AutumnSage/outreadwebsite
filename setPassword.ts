import { createClient } from "@supabase/supabase-js";
const NEXT_PUBLIC_SUPABASE_URL = "https://cnducrozrpvuuztqkxhz.supabase.co"
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZHVjcm96cnB2dXV6dHFreGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTkzNzIxNywiZXhwIjoyMDQxNTEzMjE3fQ.6kpy0k_okfKhF-Qgjj-VKyp_NB2uPWGtvYiSNfo_0mg"

process.env.NEXT_PUBLIC_SUPABASE_URL = NEXT_PUBLIC_SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE = SUPABASE_SERVICE_ROLE;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
);

(async function () {
    const supabaseAuthId = "70213bf4-1926-48dc-994f-69b5c470f4ea"
    const response = await supabase.auth.admin.updateUserById(supabaseAuthId, {
        password: "Janhvi@0449"
    })

    console.log(response)
})()
