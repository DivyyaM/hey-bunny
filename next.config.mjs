/** @type {import('next').NextConfig} */
const nextConfig = {
    
    images:{
        domains:['cdn-icons-png.flaticon.com', 'https://res.cloudinary.com'],
        unoptimized:true
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
        // Exclude native modules from client-side bundle
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
                onnxruntime: false,
            };
            
            // Exclude onnxruntime-node from client bundle
            config.externals = config.externals || [];
            config.externals.push('onnxruntime-node');
        }
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push('@xenova/transformers');
        }
        
        return config;
    },
};

export default nextConfig;
