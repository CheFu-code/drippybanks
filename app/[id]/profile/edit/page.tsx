"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/config/firebaseConfig";
import { useAuthUser } from "@/hooks/useAuthUser";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ProfileEditForm = {
    fullname: string;
    phone: string;
    avatarUrl: string;
    addressStreet: string;
    addressCity: string;
    addressPostalCode: string;
    countryName: string;
    countryCode: string;
    storeName: string;
    storeDescription: string;
};

export default function EditProfilePage() {
    const params = useParams<{ id?: string | string[] }>();
    const routeUserId = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const { user, loading } = useAuthUser();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<ProfileEditForm>({
        fullname: "",
        phone: "",
        avatarUrl: "",
        addressStreet: "",
        addressCity: "",
        addressPostalCode: "",
        countryName: "",
        countryCode: "",
        storeName: "",
        storeDescription: "",
    });

    useEffect(() => {
        if (!user) return;
        setForm({
            fullname: user.fullname ?? "",
            phone: user.phone ?? "",
            avatarUrl: user.avatarUrl ?? "",
            addressStreet: user.addressStreet ?? "",
            addressCity: user.addressCity ?? "",
            addressPostalCode: user.addressPostalCode ?? "",
            countryName: user.country?.name ?? "",
            countryCode: user.country?.code ?? "",
            storeName: user.storeName ?? "",
            storeDescription: user.storeDescription ?? "",
        });
    }, [user]);

    const isRouteOwner = useMemo(() => {
        if (!routeUserId || !user?.id) return true;
        return routeUserId === user.id;
    }, [routeUserId, user?.id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error("Please sign in again.");
            return;
        }

        if (!form.fullname.trim()) {
            toast.error("Full name is required.");
            return;
        }

        setSaving(true);
        try {
            await setDoc(
                doc(db, "drippy-banks-users", user.id),
                {
                    fullname: form.fullname.trim(),
                    phone: form.phone.trim(),
                    avatarUrl: form.avatarUrl.trim(),
                    addressStreet: form.addressStreet.trim(),
                    addressCity: form.addressCity.trim(),
                    addressPostalCode: form.addressPostalCode.trim(),
                    country: form.countryCode.trim() || form.countryName.trim()
                        ? {
                            code: form.countryCode.trim().toUpperCase(),
                            name: form.countryName.trim(),
                        }
                        : null,
                    storeName: form.storeName.trim(),
                    storeDescription: form.storeDescription.trim(),
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            toast.success("Profile updated.");
            router.push(`/${user.id}/profile`);
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Failed to update profile.", {
                description: err.message ?? "Unknown error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-5 max-w-3xl mx-auto">
                <Card>
                    <CardHeader className="space-y-3">
                        <div className="h-7 w-40 rounded-md bg-gray-200 animate-pulse" />
                        <div className="h-4 w-72 rounded-md bg-gray-100 animate-pulse" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                            <div className="h-10 w-full rounded-md bg-gray-100 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                            <div className="h-10 w-full rounded-md bg-gray-100 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-10 w-full rounded-md bg-gray-100 animate-pulse" />
                            <div className="h-10 w-full rounded-md bg-gray-100 animate-pulse" />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <div className="h-10 w-24 rounded-md bg-gray-100 animate-pulse" />
                            <div className="h-10 w-32 rounded-md bg-gray-200 animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-5 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign in required</CardTitle>
                        <CardDescription>
                            You need to be signed in to edit your profile details.
                        </CardDescription>
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
                        <CardTitle>Access denied</CardTitle>
                        <CardDescription>You can only edit your own profile.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href={`/${user.id}/profile`}>Go to your profile</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal and account details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full name</Label>
                                <Input
                                    id="fullname"
                                    value={form.fullname}
                                    onChange={(e) => setForm((prev) => ({ ...prev, fullname: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={user.email} disabled />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                                    <Input
                                        id="avatarUrl"
                                        value={form.avatarUrl}
                                        onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="addressStreet">Street address</Label>
                                    <Input
                                        id="addressStreet"
                                        value={form.addressStreet}
                                        onChange={(e) => setForm((prev) => ({ ...prev, addressStreet: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="addressCity">City</Label>
                                    <Input
                                        id="addressCity"
                                        value={form.addressCity}
                                        onChange={(e) => setForm((prev) => ({ ...prev, addressCity: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="addressPostalCode">Postal code</Label>
                                    <Input
                                        id="addressPostalCode"
                                        value={form.addressPostalCode}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, addressPostalCode: e.target.value }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="countryName">Country</Label>
                                    <Input
                                        id="countryName"
                                        value={form.countryName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, countryName: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="countryCode">Country code (ISO)</Label>
                                <Input
                                    id="countryCode"
                                    placeholder="e.g. ZA, US, GB"
                                    value={form.countryCode}
                                    onChange={(e) => setForm((prev) => ({ ...prev, countryCode: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store name</Label>
                                    <Input
                                        id="storeName"
                                        value={form.storeName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, storeName: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storeDescription">Store description</Label>
                                    <Input
                                        id="storeDescription"
                                        value={form.storeDescription}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, storeDescription: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button type="button" variant="outline" asChild>
                                <Link href={`/${user.id}/profile`}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
