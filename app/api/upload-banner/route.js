import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { fileBase64 } = await req.json();

    if (!fileBase64) {
      return new Response(
        JSON.stringify({
          url: "https://via.placeholder.com/300x200.png?text=Course+Image",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      folder: "course_banners",
      transformation: [{ width: 600, height: 400, crop: "fill" }],
    });

    return new Response(
      JSON.stringify({ url: uploadResult.secure_url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Cloudinary upload error:", err);

    return new Response(
      JSON.stringify({
        url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&h=400&q=80",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
