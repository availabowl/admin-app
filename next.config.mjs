/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.availabowl.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "bucketeer-ba012f24-3291-4642-8fd0-677ac237a075.s3.amazonaws.com",
                port: "",
                pathname: "/public/**"
            },
            {
                protocol: "https",
                hostname: "ui-avatars.com",
                port: "",
                pathname: "/**",
            }
        ]
    }
};

export default nextConfig;
