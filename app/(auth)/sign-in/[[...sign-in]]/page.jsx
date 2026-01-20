"use client";
import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Call your API or Clerk backend auth here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=100&q=80"
            alt="Logo"
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden"
            }
          }}

        />

        <p className="text-sm text-center text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-purple-600">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
