/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["@node-rs/argon2"],
    },
    images: {
        domains: ['https://cnducrozrpvuuztqkxhz.supabase.co'],
    },
};

export default nextConfig;
