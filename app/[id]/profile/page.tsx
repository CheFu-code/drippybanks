"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buildChefuAuthRedirectUrl } from "@/config/chefuAuth";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ProfilePageUI } from "../_components/ProfilePageUI";

const ProfilePage = () => {
    const { handleLogout } = useLogout();
    const { user, loading } = useAuthUser();
    const params = useParams<{ id?: string | string[] }>();
    const routeUserId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [activeTab, setActiveTab] = useState<
        "orders" | "addresses" | "payment"
    >("orders");
    const isRouteOwner = useMemo(() => routeUserId === user?.id, [routeUserId, user?.id]);
    const loginHref = useMemo(() => {
        const targetPath = routeUserId ? `/${routeUserId}/profile` : "/profile";
        return buildChefuAuthRedirectUrl(targetPath, typeof window !== "undefined" ? window.location.origin : "");
    }, [routeUserId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
                <div className="max-w-4xl mx-auto space-y-8 p-5">
                    <Card className="bg-slate-900/80 border-white/10">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-slate-800 animate-pulse" />
                        <div className="flex-1 space-y-3 w-full">
                            <div className="h-7 w-52 rounded bg-slate-800 animate-pulse" />
                            <div className="h-4 w-72 rounded bg-slate-800 animate-pulse" />
                            <div className="h-4 w-44 rounded bg-slate-800 animate-pulse" />
                        </div>
                        <div className="h-10 w-32 rounded-md bg-slate-800 animate-pulse" />
                    </CardHeader>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <Card className="md:col-span-1 bg-slate-900/80 border-white/10">
                        <CardContent className="p-4 space-y-3">
                            <div className="h-10 w-full rounded bg-slate-800 animate-pulse" />
                            <div className="h-10 w-full rounded bg-slate-800 animate-pulse" />
                            <div className="h-10 w-full rounded bg-slate-800 animate-pulse" />
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-3 bg-slate-900/80 border-white/10">
                        <CardContent className="p-6 space-y-4">
                            <div className="h-5 w-36 rounded bg-slate-800 animate-pulse" />
                            <div className="h-24 w-full rounded bg-slate-800 animate-pulse" />
                            <div className="h-24 w-full rounded bg-slate-800 animate-pulse" />
                        </CardContent>
                    </Card>
                </div>
            </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
                <div className="p-5 max-w-2xl mx-auto">
                    <Card className="bg-slate-900/80 border-white/10">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-white">Sign in required</h2>
                        <p className="text-sm text-slate-400">
                            You need to be signed in to view your profile.
                        </p>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                        <Button asChild>
                            <a href={loginHref}>Go to Login</a>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        );
    }

    if (!isRouteOwner) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
                <div className="p-5 max-w-2xl mx-auto">
                    <Card className="bg-slate-900/80 border-white/10">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-white">Access denied</h2>
                        <p className="text-sm text-slate-400">
                            You can only view your own profile.
                        </p>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                        <Button asChild>
                            <Link href={`/${user.id}/profile`}>Go to your profile</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        );
    }
    return (
        <ProfilePageUI
            user={user}
            handleLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />
    );
};
export default ProfilePage;
