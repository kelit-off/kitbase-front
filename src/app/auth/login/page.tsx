"use client"

import AuthLayout from "@/layout/authLayout";
import { useState, useEffect } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {}
    );
    const [status, setStatus] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const canResetPassword = true;
    const canRegister = true;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Optional: detect prefers-color-scheme
    useEffect(() => {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        setDarkMode(prefersDark);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setStatus("");

        let hasError = false;
        const newErrors: { email?: string; password?: string } = {};

        if (!email.includes("@")) {
            newErrors.email = "Invalid email address";
            hasError = true;
        }

        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }

        setTimeout(() => {
            setStatus("Logged in successfully!");
            setEmail("");
            setPassword("");
            setRemember(false);
            setProcessing(false);
        }, 1000);
    };

    return (
        <AuthLayout>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded shadow-md grid gap-6"
            >
                {status && (
                    <p className="text-green-600 dark:text-green-400 text-center">
                        {status}
                    </p>
                )}

                {/* Email */}
                <div className="grid gap-2">
                    <label
                        htmlFor="email"
                        className="font-medium text-gray-700 dark:text-gray-200"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autoFocus
                        autoComplete="email"
                        placeholder="email@example.com"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                        <p className="text-red-600 dark:text-red-400 text-sm">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="font-medium text-gray-700 dark:text-gray-200"
                        >
                            Password
                        </label>
                        {canResetPassword && (
                            <a
                                href="/auth/reset-password"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </a>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="Password"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <p className="text-red-600 dark:text-red-400 text-sm">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-3">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <label
                        htmlFor="remember"
                        className="font-medium text-gray-700 dark:text-gray-200"
                    >
                        Remember me
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`mt-4 w-full py-2 px-4 rounded text-white ${
                        processing
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    }`}
                >
                    {processing ? "Logging in..." : "Log in"}
                </button>

                {/* Register */}
                {canRegister && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <a
                            href="/auth/register"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Sign up
                        </a>
                    </div>
                )}

                {/* Separator */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-800 px-2 text-gray-400 dark:text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Social login buttons */}
                <div className="grid gap-2">
                    <button
                        type="button"
                        className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() =>
                            (window.location.href = `${API_URL}/auth/google`)
                        }
                    >
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() =>
                            (window.location.href = `${API_URL}/auth/github`)
                        }
                    >
                        Continue with GitHub
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
