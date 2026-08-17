"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    BadgeCheck,
    Clock3,
    Loader2,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Wallet,
    Package,
    Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useStoredProducts } from "@/hooks/useStoredProducts";
import { Navbar } from "@/components/Home/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthUser } from "@/hooks/useAuthUser";
import { fetchAdminUsersApi } from "@/lib/api/users";
import {
    fetchAdminOrdersApi,
    type OrderStatus,
    updateAdminOrderStatusApi,
} from "@/lib/api/orders";

type AdminOrder = {
    id: string;
    customerName: string;
    customerEmail: string;
    status: OrderStatus;
    total: number;
    createdAt: Date | null;
    items: Array<{ id: string; name: string; quantity: number; price: number }>;
};

type AdminUser = { id: string; fullname: string; email: string; roles: string[] };

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

const statusClass = (status: OrderStatus) =>
    status === "Delivered"
        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
        : status === "Cancelled"
            ? "bg-red-500/10 text-red-300 border-red-500/30"
            : status === "Shipped"
                ? "bg-sky-500/10 text-sky-300 border-sky-500/30"
                : status === "Packed"
                    ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                    : "bg-amber-500/10 text-amber-300 border-amber-500/30";

export default function AdminDashboardPage() {
    const { user, loading } = useAuthUser();
    const { products } = useStoredProducts();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [tab, setTab] = useState("overview");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (!user || user.role !== "admin") return;

        setOrdersLoading(true);
        setOrdersError(null);

        fetchAdminOrdersApi()
            .then((fetched) => {
                const mapped: AdminOrder[] = fetched.map((item) => ({
                    id: item.id,
                    customerName: item.customer.fullName || "Guest Customer",
                    customerEmail: item.customer.email || "customer@chefuinc.com",
                    status: item.status || "Processing",
                    total: Number(item.total) || 0,
                    createdAt: item.date ? new Date(item.date) : item.createdAt ? new Date(item.createdAt) : new Date(),
                    items: Array.isArray(item.items)
                        ? item.items.map((i) => ({
                            id: String(i.id),
                            name: String(i.name),
                            quantity: Number(i.quantity) || 1,
                            price: Number(i.price) || 0,
                        }))
                        : [],
                }));
                setOrders(mapped);
            })
            .catch((err: unknown) => {
                const msg = err instanceof Error ? err.message : "Failed to load orders";
                setOrdersError(msg);
            })
            .finally(() => setOrdersLoading(false));
    }, [user]);

    // Fetch real users from backend
    useEffect(() => {
        if (!user || user.role !== 'admin') return;
        setUsersLoading(true);
        setUsersError(null);
        fetchAdminUsersApi()
            .then((fetched) => setUsers(fetched))
            .catch((err: unknown) => {
                const msg = err instanceof Error ? err.message : 'Failed to load users';
                setUsersError(msg);
            })
            .finally(() => setUsersLoading(false));
    }, [user]);

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
            if (counts[order.status] !== undefined) {
                counts[order.status] += 1;
            }
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
        return products.map((product) => ({
            ...product,
            sold: countByName.get(product.name) ?? 0,
            revenue: product.price * (countByName.get(product.name) ?? 0),
        }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);
    }, [orders, products]);

    const handleStatusUpdate = async (
        orderId: string,
        nextStatus: OrderStatus,
    ) => {
        setUpdatingOrderId(orderId);
        try {
            await updateAdminOrderStatusApi(orderId, nextStatus);
            setOrders((current) =>
                current.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
            );
            toast.success(`Order ${orderId} updated to ${nextStatus}.`);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Could not update this order status.";
            toast.error(msg);
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
            <main className="max-w-7xl mx-auto px-5 pb-12 pt-24 space-y-6">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-8 shadow-[0_30px_80px_-40px_rgba(251,191,36,0.25)]">
                    <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>

                            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">
                                Drippy Banks Control Center
                            </h1>
                            <p className="mt-3 max-w-2xl text-slate-300 text-sm">
                                Oversee orders, track real-time streetwear drops, add new products, and monitor customer engagement.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-400/20">
                                <Link href="/admin/products">
                                    <Plus size={16} className="mr-1.5 stroke-[3]" /> Add / Manage Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-white/10 bg-slate-900/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <Wallet className="h-5 w-5 text-emerald-300" />
                                <ArrowUpRight className="h-4 w-4 text-emerald-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Total Revenue</p>
                            <p className="text-2xl font-semibold text-white">{currency(revenue)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-slate-900/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <ShoppingBag className="h-5 w-5 text-cyan-300" />
                                <ArrowUpRight className="h-4 w-4 text-cyan-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Total Orders</p>
                            <p className="text-2xl font-semibold text-white">{orders.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-slate-900/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <Package className="h-5 w-5 text-amber-300" />
                                <ArrowUpRight className="h-4 w-4 text-amber-200/70" />
                            </div>
                            <p className="text-slate-300 text-xs mt-3">Catalog Inventory</p>
                            <p className="text-2xl font-semibold text-white">{products.length} pieces</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-slate-900/60">
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

                <section>
                    <Tabs value={tab} onValueChange={setTab}>
                        <TabsList className="border border-white/10 bg-white/5 p-1 h-auto rounded-2xl">
                            <TabsTrigger className="text-white data-[state=active]:bg-amber-300 data-[state=active]:text-slate-950 rounded-xl font-semibold text-xs" value="overview">Overview</TabsTrigger>
                            <TabsTrigger className="text-white data-[state=active]:bg-amber-300 data-[state=active]:text-slate-950 rounded-xl font-semibold text-xs" value="orders">Orders ({orders.length})</TabsTrigger>
                            <TabsTrigger className="text-white data-[state=active]:bg-amber-300 data-[state=active]:text-slate-950 rounded-xl font-semibold text-xs" value="products">Products ({products.length})</TabsTrigger>
                            <TabsTrigger className="text-white data-[state=active]:bg-amber-300 data-[state=active]:text-slate-950 rounded-xl font-semibold text-xs" value="customers">Customers</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                            <Card className="bg-slate-900/75 border-white/10 rounded-3xl">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-white text-lg">Latest Orders</CardTitle>
                                    <span className="text-xs text-slate-400">Real-time sync</span>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {ordersLoading && (
                                        <div className="py-12 text-center text-slate-400 space-y-2">
                                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-500" />
                                            <p className="text-sm">Loading orders...</p>
                                        </div>
                                    )}
                                    {!ordersLoading && ordersError && (
                                        <div className="py-12 text-center text-red-400 space-y-2">
                                            <p className="text-sm">{ordersError}</p>
                                        </div>
                                    )}
                                    {!ordersLoading && !ordersError && orders.length === 0 && (
                                        <div className="py-12 text-center text-slate-400 space-y-2">
                                            <ShoppingBag className="mx-auto h-8 w-8 text-slate-600" />
                                            <p className="text-sm">No checkout orders placed yet.</p>
                                        </div>
                                    )}
                                    {!ordersLoading && !ordersError && orders.slice(0, 6).map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                        >
                                            <div>
                                                <p className="font-bold text-white text-sm">{order.id}</p>
                                                <p className="text-xs text-slate-400">
                                                    {order.customerName} ({order.customerEmail})
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-1">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="font-bold text-amber-300">{currency(order.total)}</p>
                                                <span
                                                    className={`text-xs px-2.5 py-0.5 rounded-full border ${statusClass(order.status)} font-semibold`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <Card className="bg-slate-900/75 border-white/10 rounded-3xl">
                                    <CardHeader>
                                        <CardTitle className="text-white text-lg">Performance Snapshot</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                            <p className="text-xs text-slate-400">Average Order Value</p>
                                            <p className="text-xl font-bold text-white mt-1">
                                                {currency(averageOrderValue)}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                            <p className="text-xs text-slate-400">Delivered Fulfillment</p>
                                            <p className="text-xl font-bold text-emerald-400 mt-1">
                                                {deliveredOrders} / {orders.length}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-900/75 border-white/10 rounded-3xl">
                                    <CardHeader>
                                        <CardTitle className="text-white text-lg">Order Status Mix</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {statusBreakdown.map((entry) => (
                                            <div key={entry.status} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs text-slate-300">
                                                    <span>{entry.status}</span>
                                                    <span className="font-bold">{entry.count}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-cyan-400"
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
                            <Card className="bg-slate-900/75 border-white/10 rounded-3xl">
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
                                                className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 rounded-xl"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value as "all" | OrderStatus)
                                            }
                                            className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white"
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
                                        <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
                                            <p className="text-sm text-slate-400">
                                                No orders match your filters.
                                            </p>
                                        </div>
                                    )}
                                    {filteredOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-white">{order.id}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {order.customerName} ({order.customerEmail})
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 mt-1">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-amber-300">{currency(order.total)}</p>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleStatusUpdate(
                                                                order.id,
                                                                e.target.value as OrderStatus,
                                                            )
                                                        }
                                                        className="h-9 text-white rounded-xl border border-slate-700 bg-slate-800 px-3 text-xs font-semibold"
                                                    >
                                                        {ORDER_STATUSES.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {updatingOrderId === order.id && (
                                                        <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="products" className="mt-4">
                            <Card className="bg-slate-900/75 border-white/10 rounded-3xl">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white">Catalog & Inventory Overview</CardTitle>
                                        <p className="text-xs text-slate-400 mt-1">Live active drops in the Drippy Banks store</p>
                                    </div>
                                    <Button asChild size="sm" className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs">
                                        <Link href="/admin/products">
                                            <Plus size={14} className="mr-1" /> Open DrippyBanks Studio
                                        </Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {topProducts.slice(0, 8).map((product) => (
                                        <div
                                            key={product.id}
                                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-white text-sm">{product.name}</p>
                                                    {product.badge && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                            {product.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {product.category} • Sizes: {(product.sizes || []).join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right text-white">
                                                <p className="font-bold text-amber-300">{currency(product.price)}</p>
                                                <p className="text-[11px] text-slate-400">
                                                    {product.stock ?? 50} in stock
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="customers" className="mt-4">
                            <Card className="bg-slate-900/75 border-white/10 rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="text-white">Customer Accounts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {usersLoading && (
                                        <div className="py-12 flex items-center justify-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin text-amber-300" />
                                            <span className="text-sm text-slate-400">Loading accounts...</span>
                                        </div>
                                    )}
                                    {!usersLoading && usersError && (
                                        <div className="py-10 text-center space-y-2">
                                            <p className="text-sm text-red-400">{usersError}</p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    if (!user) return;
                                                    setUsersLoading(true);
                                                    setUsersError(null);
                                                    fetchAdminUsersApi()
                                                        .then(setUsers)
                                                        .catch((e: unknown) => setUsersError(e instanceof Error ? e.message : 'Error'))
                                                        .finally(() => setUsersLoading(false));
                                                }}
                                            >Retry</Button>
                                        </div>
                                    )}
                                    {!usersLoading && !usersError && users.length === 0 ? (
                                        <div className="py-16 flex flex-col items-center gap-3 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">
                                                <BadgeCheck className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-300">No customer accounts yet</p>
                                            <p className="text-xs text-slate-500 max-w-xs">
                                                Customer accounts will appear here once users sign up and place orders.
                                            </p>
                                        </div>
                                    ) : (
                                        users.map((account) => (
                                            <div
                                                key={account.id}
                                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3"
                                            >
                                                <div>
                                                    <p className="font-bold text-white text-sm">{account.fullname}</p>
                                                    <p className="text-xs text-slate-400">{account.email}</p>
                                                </div>
                                                <div className="flex gap-1.5 flex-wrap justify-end">
                                                    {account.roles.map((role) => (
                                                        <span key={role} className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
            </main>
        </div>
    );
}
