"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/button";

function Hero() {
  const router = useRouter();

  return (
    <section className="relative">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-[80vh] lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold sm:text-7xl">
            <span className="gradient-text block mb-2">AI Course Generator</span>
            <span className="text-foreground text-4xl sm:text-6xl block mt-4">
              Custom Learning Paths
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Unleash your potential with AI-curated courses tailored to your goals.
            Create, learn, and master any subject in seconds.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg h-12 px-8"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg h-12 px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
