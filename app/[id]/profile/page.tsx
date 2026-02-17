"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-5">
                <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1 space-y-3 w-full">
                            <div className="h-7 w-52 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-72 rounded bg-gray-100 animate-pulse" />
                            <div className="h-4 w-44 rounded bg-gray-100 animate-pulse" />
                        </div>
                        <div className="h-10 w-32 rounded-md bg-gray-200 animate-pulse" />
                    </CardHeader>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <Card className="md:col-span-1">
                        <CardContent className="p-4 space-y-3">
                            <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
                            <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
                            <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-3">
                        <CardContent className="p-6 space-y-4">
                            <div className="h-5 w-36 rounded bg-gray-200 animate-pulse" />
                            <div className="h-24 w-full rounded bg-gray-100 animate-pulse" />
                            <div className="h-24 w-full rounded bg-gray-100 animate-pulse" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-5 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Sign in required</h2>
                        <p className="text-sm text-muted-foreground">
                            You need to be signed in to view your profile.
                        </p>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                        <Button asChild>
                            <Link href="/login">Go to Login</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isRouteOwner) {
        return (
            <div className="p-5 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Access denied</h2>
                        <p className="text-sm text-muted-foreground">
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
