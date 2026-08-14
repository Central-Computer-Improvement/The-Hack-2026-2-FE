"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Username wajib diisi");
      hasError = true;
    } else {
      setUsernameError(null);
    }

    if (!password.trim() || password.length < 6) {
      setPasswordError("Password salah");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (!hasError) {
      // Set a cookie to simulate authentication
      document.cookie = "simgizi-auth=true; path=/; max-age=86400"; // 1 day expiration

      // Redirect to dashboard
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-[649px] min-h-[500px] md:h-[546px] bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-12 flex flex-col justify-between transition-colors duration-200 select-none">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between h-full space-y-6 md:space-y-0"
      >
        {/* Top Header & Inputs */}
        <div>
          {/* Logo & App Name */}
          <div className="flex items-center gap-2.5 mb-5 md:mb-6">
            <div className="w-[32px] h-[32px] rounded-lg bg-[#0d472c] flex items-center justify-center text-white shadow-xs shrink-0">
              <Zap className="w-4 h-4 fill-white stroke-none" />
            </div>
            <span className="font-ag text-[16px] leading-[24px] font-semibold text-zinc-900 dark:text-zinc-100">
              SimGizi
            </span>
          </div>

          {/* Heading Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="font-ag text-[32px] leading-[40px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Login
            </h1>
            <p className="font-inter text-[16px] text-zinc-500 dark:text-zinc-400 mt-1">
              Masuk ke akun anda
            </p>
          </div>

          {/* Form Input Fields */}
          <div className="space-y-4 md:space-y-5">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block font-inter text-[16px] font-medium text-zinc-800 dark:text-zinc-200 mb-1.5 md:mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (usernameError) setUsernameError(null);
                }}
                placeholder="Masukan username anda"
                className={`w-full px-4 py-3 rounded-xl font-inter text-[16px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none transition-all duration-150 ${
                  usernameError
                    ? "bg-white dark:bg-[#1e222d] border border-[#a52a2a] dark:border-red-500 focus:border-[#a52a2a] dark:focus:border-red-500"
                    : "bg-[#f5f6f8] dark:bg-[#1e222d] border border-transparent focus:border-[#0d472c] dark:focus:border-[#2d6a4f] focus:bg-white dark:focus:bg-[#1e222d]"
                }`}
              />
              {usernameError && (
                <p className="font-inter text-[13px] md:text-[14px] text-[#a52a2a] dark:text-red-400 mt-1.5">
                  {usernameError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block font-inter text-[16px] font-medium text-zinc-800 dark:text-zinc-200 mb-1.5 md:mb-2"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="Masukan password anda"
                  className={`w-full px-4 py-3 pr-12 rounded-xl font-inter text-[16px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none transition-all duration-150 ${
                    passwordError
                      ? "bg-white dark:bg-[#1e222d] border border-[#a52a2a] dark:border-red-500 focus:border-[#a52a2a] dark:focus:border-red-500"
                      : "bg-[#f5f6f8] dark:bg-[#1e222d] border border-transparent focus:border-[#0d472c] dark:focus:border-[#2d6a4f] focus:bg-white dark:focus:bg-[#1e222d]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 stroke-[1.8]" />
                  ) : (
                    <EyeOff className="w-5 h-5 stroke-[1.8]" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="font-inter text-[13px] md:text-[14px] text-[#a52a2a] dark:text-red-400 mt-1.5">
                  {passwordError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div className="pt-2 md:pt-4">
          <button
            type="submit"
            className="w-full py-3.5 bg-[#0d472c] hover:bg-[#0a3923] active:bg-[#072a1a] text-white font-inter text-[15px] font-medium rounded-xl transition-colors shadow-xs flex items-center justify-center cursor-pointer"
          >
            Login
          </button>

          <p className="font-inter text-[12.5px] text-zinc-500 dark:text-zinc-400 text-center mt-3.5 md:mt-4 leading-normal">
            By continuing, you agree to our{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Terms
            </span>{" "}
            and{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Privacy Policy
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
