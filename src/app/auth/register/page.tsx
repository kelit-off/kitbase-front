"use client";

import AuthLayout from "@/layout/authLayout";
import { useState, useEffect } from "react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    // Détection dark mode
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

        const newErrors: { [key: string]: string } = {};
        let hasError = false;

        if (!name.trim()) {
            newErrors.name = "Name is required";
            hasError = true;
        }

        if (!email.includes("@")) {
            newErrors.email = "Invalid email";
            hasError = true;
        }

        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            hasError = true;
        }

        if (password !== passwordConfirm) {
            newErrors.passwordConfirm = "Passwords do not match";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }

        // Simuler un envoi
        setTimeout(() => {
            setStatus("Account created successfully!");
            setName("");
            setEmail("");
            setPassword("");
            setPasswordConfirm("");
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

                {/* Name */}
                <div className="grid gap-2">
                    <label
                        htmlFor="name"
                        className="font-medium text-gray-700 dark:text-gray-200"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Full name"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                        <p className="text-red-600 dark:text-red-400 text-sm">
                            {errors.name}
                        </p>
                    )}
                </div>

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
                    <label
                        htmlFor="password"
                        className="font-medium text-gray-700 dark:text-gray-200"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
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

                {/* Password confirmation */}
                <div className="grid gap-2">
                    <label
                        htmlFor="passwordConfirm"
                        className="font-medium text-gray-700 dark:text-gray-200"
                    >
                        Confirm password
                    </label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        placeholder="Confirm password"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    {errors.passwordConfirm && (
                        <p className="text-red-600 dark:text-red-400 text-sm">
                            {errors.passwordConfirm}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`mt-2 w-full py-2 px-4 rounded text-white ${
                        processing
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    }`}
                >
                    {processing ? "Creating account..." : "Create account"}
                </button>

                {/* Login link */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <a
                        href="/auth/login"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Log in
                    </a>
                </div>

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
                            (window.location.href = "/auth/redirect/google")
                        }
                    >
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() =>
                            (window.location.href = "/auth/redirect/github")
                        }
                    >
                        Continue with GitHub
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
