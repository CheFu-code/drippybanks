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
    ArrowUpRight,
    BadgeCheck,
    Clock3,
    Loader2,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
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
const formatDate = (value: Date | null) =>
    value
        ? value.toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "Unknown date";
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
    const deliveredOrders = useMemo(
        () => orders.filter((order) => order.status === "Delivered").length,
        [orders],
    );
    const averageOrderValue = useMemo(
        () => (orders.length === 0 ? 0 : revenue / orders.length),
        [orders.length, revenue],
    );
    const statusBreakdown = useMemo(() => {
        const counts = ORDER_STATUSES.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {} as Record<OrderStatus, number>);

        orders.forEach((order) => {
            counts[order.status] += 1;
        });

        const highest = Math.max(...Object.values(counts), 1);
        return ORDER_STATUSES.map((status) => ({
            status,
            count: counts[status],
            width: `${Math.max((counts[status] / highest) * 100, 6)}%`,
        }));
    }, [orders]);

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
            revenue: product.price * (countByName.get(product.name) ?? 0),
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
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar />
                <main className="max-w-7xl mx-auto px-5 pt-24 pb-12">
                    <Card className="border-white/10 bg-white/5">
                        <CardContent className="py-16 flex items-center justify-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                            <span className="text-slate-200">Loading admin dashboard...</span>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
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
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-8 shadow-[0_30px_80px_-40px_rgba(14,165,233,0.65)]">
                    <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
                    <div className="relative">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                                <Sparkles className="h-3 w-3" />
                                Admin Dashboard
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-emerald-200">
                                <BadgeCheck className="h-3 w-3" />
                                Live Metrics
                            </span>
                        </div>
                        <h1 className="mt-4 text-3xl md:text-4xl font-semibold">
                            Drippy Banks Control Center
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-300">
                            Oversee orders, track product velocity, and monitor customer activity
                            in one polished command surface.
                        </p>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-white/10 bg-gradient-to-br from-emerald-500/12 to-emerald-400/0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <Wallet className="h-5 w-5 text-emerald-300" />
                                <ArrowUpRight className="h-4 w-4 text-emerald-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Total Revenue</p>
                            <p className="text-2xl font-semibold text-white">{currency(revenue)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-gradient-to-br from-cyan-500/12 to-cyan-400/0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <ShoppingBag className="h-5 w-5 text-cyan-300" />
                                <ArrowUpRight className="h-4 w-4 text-cyan-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Orders</p>
                            <p className="text-2xl font-semibold text-white">{orders.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-gradient-to-br from-fuchsia-500/12 to-fuchsia-400/0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <Users className="h-5 w-5 text-fuchsia-300" />
                                <ArrowUpRight className="h-4 w-4 text-fuchsia-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Customers</p>
                            <p className="text-2xl font-semibold text-white">{users.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-gradient-to-br from-amber-500/12 to-amber-400/0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <Clock3 className="h-5 w-5 text-amber-300" />
                                <ArrowUpRight className="h-4 w-4 text-amber-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Pending Orders</p>
                            <p className="text-2xl font-semibold text-white">{pendingOrders}</p>
                        </CardContent>
                    </Card>
                </section>

                <section className="mt-6">
                    <Tabs value={tab} onValueChange={setTab}>
                        <TabsList className="border border-white/10 bg-white/5 p-1 h-auto">
                            <TabsTrigger className="text-white" value="overview">Overview</TabsTrigger>
                            <TabsTrigger className="text-white" value="orders">Orders</TabsTrigger>
                            <TabsTrigger className="text-white" value="products">Products</TabsTrigger>
                            <TabsTrigger className="text-white" value="customers">Customers</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                            <Card className="bg-slate-900/75 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Latest Orders</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {orders.length === 0 && (
                                        <p className="text-sm text-slate-400">No orders yet.</p>
                                    )}
                                    {orders.slice(0, 6).map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                        >
                                            <div>
                                                <p className="font-medium text-white">{order.id}</p>
                                                <p className="text-xs text-slate-400">
                                                    {order.customerName} ({order.customerEmail})
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {formatDate(order.createdAt)}
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

                            <div className="space-y-4">
                                <Card className="bg-slate-900/75 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-white">Performance Snapshot</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                                            <p className="text-xs text-slate-400">Average Order Value</p>
                                            <p className="text-xl font-semibold text-white">
                                                {currency(averageOrderValue)}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                                            <p className="text-xs text-slate-400">Delivered Orders</p>
                                            <p className="text-xl font-semibold text-white">
                                                {deliveredOrders}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-900/75 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-white">Order Status Mix</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {statusBreakdown.map((entry) => (
                                            <div key={entry.status} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs text-slate-300">
                                                    <span>{entry.status}</span>
                                                    <span>{entry.count}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                                                        style={{ width: entry.width }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-4">
                            <Card className="bg-slate-900/75 border-white/10">
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
                                                className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value as "all" | OrderStatus)
                                            }
                                            className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white"
                                        >
                                            <option value="all">All statuses</option>
                                            {ORDER_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {filteredOrders.length === 0 && (
                                        <div className="rounded-lg border border-dashed border-white/20 p-6 text-center">
                                            <p className="text-sm text-slate-400">
                                                No orders match your filters.
                                            </p>
                                        </div>
                                    )}
                                    {filteredOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-white">{order.id}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {order.customerName} ({order.customerEmail})
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-emerald-300">{currency(order.total)}</p>
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
                                                        <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="products" className="mt-4">
                            <Card className="bg-slate-900/75 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Product Performance</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {topProducts.length === 0 && (
                                        <p className="text-sm text-slate-400">No product sales data yet.</p>
                                    )}
                                    {topProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3"
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
                                                <p className="text-xs text-emerald-300">
                                                    {currency(product.revenue)} revenue
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="customers" className="mt-4">
                            <Card className="bg-slate-900/75 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Customer Accounts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {users.length === 0 && (
                                        <p className="text-sm text-slate-400">No customer accounts found.</p>
                                    )}
                                    {users.map((account) => (
                                        <div
                                            key={account.id}
                                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3"
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
