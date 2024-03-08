/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    rewrites:async()=>{
        return[
           {
                source: "/api/:path*",
                destination: "http://localhost:8080/api/:path*",
              
            },
        ]
    }
};

export default nextConfig;
