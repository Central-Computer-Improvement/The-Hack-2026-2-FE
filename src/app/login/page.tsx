import React from "react";
import ThemeToggle from "@/components/layouts/ThemeToggle";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-6 bg-[#f8f9fa] dark:bg-[#0f1115] transition-colors duration-200">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Centered Login Card */}
      <div className="w-full flex items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
