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
        let isActive = true;
        const fetchOrders = async () => {
            try {
                if (isActive) {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                if (isActive) {
                    setOrders([]);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void fetchOrders();
        return () => {
            isActive = false;
        };
    }, [userId]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold text-white mb-4">Order History</h2>
            {loading && (
                <div className="bg-slate-900 rounded-xl border border-white/10 p-8 text-center">
                    <p className="text-slate-400">Loading your orders...</p>
                </div>
            )}
            {!loading && orders.length === 0 && (
                <div className="bg-slate-900 rounded-xl border border-white/10 p-8 text-center">
                    <p className="text-slate-400">You have no orders yet.</p>
                </div>
            )}
            {!loading && orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition-shadow"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-white">{order.id}</span>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${order.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">{order.date}</p>
                        <p className="text-sm text-slate-400 mt-2">{order.items.join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-bold text-lg">R{order.total.toFixed(2)}</span>
                        <span className="text-slate-500" aria-hidden="true">
                            <ChevronRight className="h-5 w-5" />
                        </span>
                    </div>
                </div>
            ))}
        </motion.div>
    );
};
