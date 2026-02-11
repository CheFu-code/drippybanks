import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    ChevronRight,
    CreditCard,
    LogOut,
    MapPin,
    Package,
    Settings,
} from "lucide-react";
import { ORDERS } from "../profile/page";
import { AppUser } from "@/types/user";
export const ProfilePageUI = ({
    user,
    handleLogout,
    activeTab,
    setActiveTab,
}: {
    user: AppUser
    handleLogout: (redirectTo?: string | undefined) => Promise<void>
    activeTab: "orders" | "addresses" | "payment"
    setActiveTab: (tab: "orders" | "addresses" | "payment") => void
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <Avatar className="h-full w-full object-cover rounded-full">
                            <AvatarImage
                                src={user?.avatarUrl || "/drippybanks.png"}
                                alt="Profile image"
                            />
                            <AvatarFallback>{user?.fullname?.[0] || "DB"}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 size-5 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.fullname}
                        </h1>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Gold Member
                        </span>
                    </div>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Member since:{" "}
                        {user?.createdAt?.toLocaleString("en-ZA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                <Button className="flex items-center gap-2 px-4 py-2  text-sm font-medium">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 p-2 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "orders"
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        My Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("addresses")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "addresses"
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <MapPin className="h-4 w-4" />
                        Addresses
                    </button>
                    <button
                        onClick={() => setActiveTab("payment")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "payment"
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <CreditCard className="h-4 w-4" />
                        Payment Methods
                    </button>

                    <div className="pt-4 border-t border-gray-100 mt-4">
                        <Button
                            className="cursor-pointer"
                            variant={"destructive"}
                            onClick={() => handleLogout()}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    {activeTab === "orders" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Order History
                            </h2>
                            {ORDERS.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900">
                                                {order.id}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${order.status === "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{order.date}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {order.items.join(", ")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-lg">
                                            ${order.total.toFixed(2)}
                                        </span>
                                        <button className="text-gray-400 hover:text-black">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === "addresses" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Saved Addresses
                            </h2>

                            <Card className="relative">
                                {/* Default Badge */}
                                <div className="absolute top-6 right-6">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        Default
                                    </span>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-gray-900 font-bold">
                                        Home
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-1">
                                    <p className="text-gray-600">{user?.addressStreet}</p>
                                    <p className="text-gray-600">
                                        {user?.addressCity} {user?.addressPostalCode}
                                    </p>
                                    <p className="text-gray-600">{user?.country?.name}</p>

                                    <div className="mt-4 flex gap-3">
                                        <button className="text-sm font-medium text-black underline">
                                            Edit
                                        </button>
                                        <button className="text-sm font-medium text-red-600 hover:underline">
                                            Remove
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Add New Address
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "payment" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Payment Methods
                            </h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <CreditCard className="h-6 w-6 text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            Visa ending in 4242
                                        </p>
                                        <p className="text-sm text-gray-500">Expires 12/26</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-600 font-medium">
                                    Remove
                                </button>
                            </div>

                            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Add New Card
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
