import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Order = {
    id: string;
    date: string;
    total: number;
    status: string;
    items: string[];
};

export const OrdersTab = ({ userId }: { userId: string }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersRef = collection(db, "drippy-banks-orders");
                const ordersQuery = query(ordersRef, where("userId", "==", userId));
                const snapshot = await getDocs(ordersQuery);

                const fetchedOrders = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data() as {
                        id?: string;
                        date?: string;
                        total?: number;
                        status?: string;
                        items?: Array<{ name: string }>;
                    };
                    const rawDate = data.date ? new Date(data.date) : null;

                    return {
                        id: data.id ?? docSnap.id,
                        date: rawDate
                            ? rawDate.toLocaleDateString("en-ZA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "Unknown date",
                        total: data.total ?? 0,
                        status: data.status ?? "Processing",
                        items: (data.items ?? []).map((item) => item.name),
                        sortTime: rawDate ? rawDate.getTime() : 0,
                    };
                });

                fetchedOrders.sort((a, b) => b.sortTime - a.sortTime);

                setOrders(
                    fetchedOrders.map((order) => ({
                        id: order.id,
                        date: order.date,
                        total: order.total,
                        status: order.status,
                        items: order.items,
                    })),
                );
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchOrders();
    }, [userId]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
            {loading && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            )}
            {!loading && orders.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-600">You have no orders yet.</p>
                </div>
            )}
            {!loading && orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-gray-900">{order.id}</span>
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
                        <p className="text-sm text-gray-600 mt-2">{order.items.join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                        <span className="text-gray-400" aria-hidden="true">
                            <ChevronRight className="h-5 w-5" />
                        </span>
                    </div>
                </div>
            ))}
        </motion.div>
    );
};
