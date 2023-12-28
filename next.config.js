/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				port: '',
			},
		],
		domains: ['rentbabe.com',"images.rentbabe.com","firebasestorage.googleapis.com"],
		deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	eslint: {
		ignoreDuringBuilds: true
	}
};

module.exports = nextConfig

