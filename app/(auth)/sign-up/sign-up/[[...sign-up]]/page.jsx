"use client";
import { SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    console.log('SignUp component mounted at', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/sign-in" className="text-purple-600">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}