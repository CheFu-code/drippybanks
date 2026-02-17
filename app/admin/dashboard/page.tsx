"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import {
    Loader2,
    Search,
    ShieldCheck,
    ShoppingBag,
    Users,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS } from "@/app/shop/products";
import { Navbar } from "@/components/Home/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/config/firebaseConfig";
import { useAuthUser } from "@/hooks/useAuthUser";

type OrderStatus =
    | "Processing"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
type AdminOrder = {
    id: string;
    customerName: string;
    customerEmail: string;
    status: OrderStatus;
    total: number;
    createdAt: Date | null;
    items: Array<{ id: string; name: string; quantity: number; price: number }>;
};
type AdminUser = { id: string; fullname: string; email: string; role: string };

const ORDER_STATUSES: OrderStatus[] = [
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
];

const currency = (value: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        value,
    );
const asDate = (value: unknown) => {
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value === "string" || typeof value === "number") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
};
const statusClass = (status: OrderStatus) =>
    status === "Delivered"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : status === "Cancelled"
            ? "bg-red-50 text-red-700 border-red-200"
            : status === "Shipped"
                ? "bg-sky-50 text-sky-700 border-sky-200"
                : status === "Packed"
                    ? "bg-violet-50 text-violet-700 border-violet-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";

export default function AdminDashboardPage() {
    const { user, loading } = useAuthUser();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [tab, setTab] = useState("overview");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, "drippy-banks-orders"),
            orderBy("createdAt", "desc"),
        );
        return onSnapshot(
            q,
            (snapshot) => {
                setOrders(
                    snapshot.docs.map((orderDoc) => {
                        const data = orderDoc.data() as {
                            status?: string;
                            total?: number;
                            createdAt?: unknown;
                            date?: unknown;
                            customer?: { fullName?: string; email?: string };
                            items?: Array<{
                                id?: string;
                                name?: string;
                                quantity?: number;
                                price?: number;
                            }>;
                        };
                        const rawStatus = data.status ?? "Processing";
                        const status = ORDER_STATUSES.includes(rawStatus as OrderStatus)
                            ? (rawStatus as OrderStatus)
                            : "Processing";
                        return {
                            id: orderDoc.id,
                            customerName: data.customer?.fullName ?? "Guest customer",
                            customerEmail: data.customer?.email ?? "No email",
                            status,
                            total: Number(data.total ?? 0),
                            createdAt: asDate(data.createdAt) ?? asDate(data.date),
                            items: (data.items ?? []).map((item, index) => ({
                                id: item.id ?? `${orderDoc.id}-${index}`,
                                name: item.name ?? "Unknown item",
                                quantity: Number(item.quantity ?? 0),
                                price: Number(item.price ?? 0),
                            })),
                        };
                    }),
                );
            },
            () => toast.error("Could not load admin orders."),
        );
    }, []);

    useEffect(() => {
        return onSnapshot(
            collection(db, "drippy-banks-users"),
            (snapshot) => {
                setUsers(
                    snapshot.docs.map((userDoc) => {
                        const data = userDoc.data() as {
                            fullname?: string;
                            email?: string;
                            role?: string;
                        };
                        return {
                            id: userDoc.id,
                            fullname: data.fullname ?? "Unknown user",
                            email: data.email ?? "No email",
                            role: data.role ?? "customer",
                        };
                    }),
                );
            },
            () => toast.error("Could not load users."),
        );
    }, []);

    const revenue = useMemo(
        () => orders.reduce((acc, order) => acc + order.total, 0),
        [orders],
    );
    const pendingOrders = useMemo(
        () => orders.filter((order) => order.status !== "Delivered").length,
        [orders],
    );
    const filteredOrders = useMemo(() => {
        const q = search.trim().toLowerCase();
        return orders.filter((order) => {
            const byStatus = statusFilter === "all" || order.status === statusFilter;
            const bySearch =
                q.length === 0 ||
                order.id.toLowerCase().includes(q) ||
                order.customerName.toLowerCase().includes(q) ||
                order.customerEmail.toLowerCase().includes(q);
            return byStatus && bySearch;
        });
    }, [orders, search, statusFilter]);
    const topProducts = useMemo(() => {
        const countByName = new Map<string, number>();
        orders.forEach((order) => {
            order.items.forEach((item) =>
                countByName.set(
                    item.name,
                    (countByName.get(item.name) ?? 0) + item.quantity,
                ),
            );
        });
        return PRODUCTS.map((product) => ({
            ...product,
            sold: countByName.get(product.name) ?? 0,
        }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 8);
    }, [orders]);

    const handleStatusUpdate = async (
        orderId: string,
        nextStatus: OrderStatus,
    ) => {
        setUpdatingOrderId(orderId);
        try {
            await updateDoc(doc(db, "drippy-banks-orders", orderId), {
                status: nextStatus,
                updatedAt: serverTimestamp(),
            });
            toast.success(`Order ${orderId} updated.`);
        } catch {
            toast.error("Could not update this order status.");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-950" />;
    }
    if (!user || user.role !== "admin") {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar />
                <main className="max-w-3xl mx-auto px-5 pt-24 pb-12">
                    <Card className="bg-white">
                        <CardContent className="py-10 text-center space-y-4">
                            <ShieldCheck className="mx-auto h-8 w-8 text-red-600" />
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Admin access required
                            </h1>
                            <p className="text-slate-600">
                                This page is only available to admin users.
                            </p>
                            <Button asChild>
                                <Link href="/">Back Home</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar />
            <main className="max-w-7xl mx-auto px-5 pb-12 pt-24">
                <section className="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 to-cyan-950 p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                        Admin Dashboard
                    </p>
                    <h1 className="text-3xl font-semibold mt-2">
                        Drippy Banks Control Center
                    </h1>
                    <p className="text-slate-300 mt-2">
                        Manage orders, products, and customer activity.
                    </p>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-5">
                            <Wallet className="h-5 w-5 text-emerald-300" />
                            <p className="text-slate-400 text-xs mt-2">Revenue</p>
                            <p className="text-2xl font-semibold text-white">{currency(revenue)}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-5">
                            <ShoppingBag className="h-5 w-5 text-cyan-300" />
                            <p className="text-slate-400 text-xs mt-2">Orders</p>
                            <p className="text-2xl font-semibold text-white">{orders.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-5">
                            <Users className="h-5 w-5 text-fuchsia-300" />
                            <p className="text-slate-400 text-xs mt-2">Customers</p>
                            <p className="text-2xl font-semibold text-white">{users.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-5">
                            <ShoppingBag className="h-5 w-5 text-amber-300" />
                            <p className="text-slate-400 text-xs mt-2">Pending</p>
                            <p className="text-2xl font-semibold text-white">{pendingOrders}</p>
                        </CardContent>
                    </Card>
                </section>

                <section className="mt-6">
                    <Tabs value={tab} onValueChange={setTab}>
                        <TabsList className="bg-white/10 border border-white/10 ">
                            <TabsTrigger className="text-white" value="overview">Overview</TabsTrigger>
                            <TabsTrigger className="text-white" value="orders">Orders</TabsTrigger>
                            <TabsTrigger className="text-white" value="products">Products</TabsTrigger>
                            <TabsTrigger className="text-white" value="customers">Customers</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4">
                            <Card className="bg-slate-900/70 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Latest Orders</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {orders.slice(0, 6).map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-lg border border-white/10 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                        >
                                            <div>
                                                <p className="font-medium text-white">{order.id}</p>
                                                <p className="text-xs text-slate-400">
                                                    {order.customerName} ({order.customerEmail})
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="font-medium text-white">{currency(order.total)}</p>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full border ${statusClass(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-4">
                            <Card className="bg-slate-900/70 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Manage Orders</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search orders..."
                                                className="pl-9 bg-slate-800 border-slate-700 text-white"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value as "all" | OrderStatus)
                                            }
                                            className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm"
                                        >
                                            <option className="text-white" value="all">All statuses</option>
                                            {ORDER_STATUSES.map((s) => (
                                                <option className="text-white" key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {filteredOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-lg border border-white/10 p-4"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-white">{order.id}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {order.customerName} ({order.customerEmail})
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-green-500">{currency(order.total)}</p>
                                                    <select
                                                        defaultValue={order.status}
                                                        onChange={(e) =>
                                                            handleStatusUpdate(
                                                                order.id,
                                                                e.target.value as OrderStatus,
                                                            )
                                                        }
                                                        className="h-9 text-white rounded-md border border-slate-700 bg-slate-800 px-3 text-sm"
                                                    >
                                                        {ORDER_STATUSES.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {updatingOrderId === order.id && (
                                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="products" className="mt-4">
                            <Card className="bg-slate-900/70 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Product Performance</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {topProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="rounded-lg border border-white/10 p-3 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <p className="font-medium text-white">{product.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {product.category}
                                                </p>
                                            </div>
                                            <div className="text-right text-white">
                                                <p>{currency(product.price)}</p>
                                                <p className="text-xs text-slate-400">
                                                    {product.sold} sold
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="customers" className="mt-4">
                            <Card className="bg-slate-900/70 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Customer Accounts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {users.map((account) => (
                                        <div
                                            key={account.id}
                                            className="rounded-lg border border-white/10 p-3 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <p className="font-medium text-white">{account.fullname}</p>
                                                <p className="text-xs text-slate-400">
                                                    {account.email}
                                                </p>
                                            </div>
                                            <span className="text-xs uppercase tracking-wider text-cyan-300">
                                                {account.role}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
            </main>
        </div>
    );
}
