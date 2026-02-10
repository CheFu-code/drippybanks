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

export default function RegisterForm({
    email,
    setEmail,
    fullname,
    setFullname,
    password,
    setPassword,
    handleRegister,
    loading,
}: {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    fullname: string;
    setFullname: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    handleRegister: (e: React.FormEvent<Element>) => Promise<void>;
    loading: boolean;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                    Sign up to start shopping, track orders, and enjoy exclusive offers.
                </CardDescription>
            </CardHeader>
            <form>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                id="name"
                                type="text"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                type="password"
                                placeholder="********"
                            />
                        </div>
                        <div className="flex items-center justify-end text-sm">
                            <span>Already have an account?</span>
                            <Link className="ml-1 text-primary hover:underline" href="/login">
                                Log in
                            </Link>
                        </div>

                        <Button
                            disabled={loading || !fullname || !email || !password}
                            onClick={handleRegister}
                            className="cursor-pointer"
                        >
                            {loading ? "Loading..." : "Register"}
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
