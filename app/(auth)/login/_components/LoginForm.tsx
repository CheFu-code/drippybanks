"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getLoginErrorMessage } from "@/helpers/getErrorMsg";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully!");

            router.push("/");
        } catch (error: unknown) {
            toast.error("Login failed", {
                description: getLoginErrorMessage(error),
                style: {
                    background: "#000",
                    color: "#fff",
                    border: "1px solid #333",
                },

            });
            return; // prevents bubbling
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>
                    Log in to access your account, track orders, and continue shopping.
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-3">
                        {/* EMAIL */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* REGISTER LINK */}
                        <div className="flex items-center justify-end text-sm">
                            <span>Don&apos;t have an account?</span>
                            <Link
                                className="ml-1 text-primary hover:underline"
                                href="/register"
                            >
                                Sign up
                            </Link>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <Button type="submit" className="cursor-pointer" disabled={loading}>
                            {loading ? "Logging in..." : "Continue"}
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}