import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type Order = {
    id: string;
    date: string;
    total: number;
    status: string;
    items: string[];
};

export const OrdersTab = ({ orders }: { orders: Order[] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
            {orders.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-600">You have no orders yet.</p>
                </div>
            )}
            {orders.map((order) => (
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
