/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "via.placeholder.com",
      "res.cloudinary.com",
      "img.clerk.com",
      "img.icons8.com",
    ],
  },
  // Helps Vercel correctly identify the project root when multiple lockfiles are detected
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
