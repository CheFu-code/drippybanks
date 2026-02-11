"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { useLogout } from "@/hooks/useLogout";
import { useState } from "react";
import { ProfilePageUI } from "../_components/ProfilePageUI";

export const ORDERS = [
    {
        id: "#ORD-7723",
        date: "Feb 10, 2025",
        total: 124.0,
        status: "Delivered",
        items: ["Vintage Denim Jeans", "Classic White Tee"],
    },
    {
        id: "#ORD-7611",
        date: "Jan 24, 2025",
        total: 199.0,
        status: "Processing",
        items: ["Leather Biker Jacket"],
    },
    {
        id: "#ORD-7544",
        date: "Dec 12, 2024",
        total: 55.0,
        status: "Delivered",
        items: ["Essential Black Hoodie"],
    },
];

const ProfilePage = () => {
    const { handleLogout } = useLogout();
    const { user, loading } = useAuthUser();
    const [activeTab, setActiveTab] = useState<
        "orders" | "addresses" | "payment"
    >("orders");

    if (loading) return <div>Loading...</div>;
    if (!user) return;
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
