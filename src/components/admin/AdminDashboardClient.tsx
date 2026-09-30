"use client";
import Link from "next/link";
import {
    FiUsers, FiStar, FiShoppingCart, FiBarChart2,
    FiGrid, FiLayers, FiSettings, FiFileText,
    FiImage, FiShield, FiArrowRight, FiTrendingUp, FiCreditCard
} from "react-icons/fi";

interface AdminCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
    stats?: string | number;
}

function AdminCard({ title, description, href, icon, color, stats }: AdminCardProps) {
    return (
        <Link
            href={href}
            className="group bg-ink-800 border border-white/10 rounded-2xl p-6 hover:border-brand-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(124,92,255,0.3)] flex flex-col"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                {stats !== undefined && (
                    <span className="text-2xl font-bold text-white">{stats}</span>
                )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-gray-400 mb-4 flex-grow">{description}</p>
            <div className="flex items-center text-brand-400 text-sm font-medium">
                <span>Manage</span>
                <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
}

function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
    return (
        <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-1 flex items-center gap-1 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                            <FiTrendingUp className={`h-4 w-4 ${!trendUp && 'rotate-180'}`} />
                            {trend}
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
                    {icon}
                </div>
            </div>
        </div>
    );
}

interface AdminDashboardClientProps {
    enabled: Set<string>;
    isSuperAdmin?: boolean;
    stats?: {
        totalUsers?: number;
        totalOrders?: number;
        totalRevenue?: string;
        totalGames?: number;
        usersTrendText?: string;
        usersTrendUp?: boolean;
        ordersTrendText?: string;
        ordersTrendUp?: boolean;
        revenueTrendText?: string;
        revenueTrendUp?: boolean;
    };
}

export function AdminDashboardClient({ enabled, isSuperAdmin, stats }: AdminDashboardClientProps) {
    const menuItems = [
        { key: "users", title: "Users", description: "Manage user accounts and roles", href: "/admin/users", icon: <FiUsers className="h-6 w-6" />, color: "bg-brand-500/20 text-brand-400" },
        { key: "boosters", title: "Boosters", description: "Manage booster applications", href: "/admin/boosters", icon: <FiStar className="h-6 w-6" />, color: "bg-yellow-500/20 text-yellow-400" },
        { key: "orders", title: "Orders", description: "View and manage orders", href: "/admin/orders", icon: <FiShoppingCart className="h-6 w-6" />, color: "bg-emerald-500/20 text-emerald-400" },
        { key: "analytics", title: "Analytics", description: "Sales and performance stats", href: "/admin/analytics", icon: <FiBarChart2 className="h-6 w-6" />, color: "bg-purple-500/20 text-purple-400" },
        { key: "games", title: "Games", description: "Manage game catalog", href: "/admin/games", icon: <FiGrid className="h-6 w-6" />, color: "bg-accent-500/20 text-accent-400" },
        { key: "categories", title: "Categories", description: "Organize game categories", href: "/admin/categories", icon: <FiLayers className="h-6 w-6" />, color: "bg-pink-500/20 text-pink-400" },
        { key: "services", title: "Services", description: "Manage boosting services", href: "/admin/services", icon: <FiSettings className="h-6 w-6" />, color: "bg-orange-500/20 text-orange-400" },
        { key: "services-data", title: "Data Service", description: "View service data", href: "/admin/service-data", icon: <FiSettings className="h-6 w-6" />, color: "bg-orange-500/20 text-orange-400" },
        { key: "payment-method", title: "Payment Method", description: "Manage payment methods and fees", href: "/admin/payment-method", icon: <FiCreditCard className="h-6 w-6" />, color: "bg-brand-500/20 text-brand-400" },
        { key: "blog", title: "Blog", description: "Write and publish articles", href: "/admin/blog", icon: <FiFileText className="h-6 w-6" />, color: "bg-brand-500/20 text-brand-400" },
        { key: "benner", title: "Banners", description: "Manage promotional banners", href: "/admin/benner", icon: <FiImage className="h-6 w-6" />, color: "bg-rose-500/20 text-rose-400" },
        { key: "legal", title: "Legal Pages", description: "Edit terms, privacy and refund pages", href: "/admin/legal", icon: <FiFileText className="h-6 w-6" />, color: "bg-brand-500/20 text-brand-400" },
        { key: "settings", title: "Settings", description: "Configure website settings", href: "/admin/settings", icon: <FiSettings className="h-6 w-6" />, color: "bg-slate-500/20 text-slate-400" },
        { key: "permissions", title: "Permissions", description: "Manage admin access rights", href: "/admin/permissions", icon: <FiShield className="h-6 w-6" />, color: "bg-red-500/20 text-red-400" },
    ];

    const visibleItems = isSuperAdmin
        ? menuItems
        : menuItems.filter(item => enabled.has(item.key));

    return (
        <div className="min-h-screen bg-ink-900 text-white">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage users, boosters, orders, and analytics</p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatsCard
                            title="Total Users"
                            value={stats.totalUsers ?? 0}
                            icon={<FiUsers className="h-6 w-6" />}
                            trend={stats.usersTrendText}
                            trendUp={stats.usersTrendUp}
                        />
                        <StatsCard
                            title="Total Orders"
                            value={stats.totalOrders ?? 0}
                            icon={<FiShoppingCart className="h-6 w-6" />}
                            trend={stats.ordersTrendText}
                            trendUp={stats.ordersTrendUp}
                        />
                        <StatsCard
                            title="Revenue"
                            value={stats.totalRevenue ?? "$0"}
                            icon={<FiBarChart2 className="h-6 w-6" />}
                            trend={stats.revenueTrendText}
                            trendUp={stats.revenueTrendUp}
                        />
                        <StatsCard
                            title="Active Games"
                            value={stats.totalGames ?? 0}
                            icon={<FiGrid className="h-6 w-6" />}
                        />
                    </div>
                )}

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visibleItems.map((item) => (
                        <AdminCard
                            key={item.key}
                            title={item.title}
                            description={item.description}
                            href={item.href}
                            icon={item.icon}
                            color={item.color}
                        />
                    ))}
                </div>

                {visibleItems.length === 0 && (
                    <div className="text-center py-16 bg-ink-800 rounded-2xl border border-white/10">
                        <FiShield className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Access</h3>
                        <p className="text-gray-400">You don&apos;t have permission to access any admin panels.</p>
                    </div>
                )}

                {/* Footer note */}
                <p className="mt-8 text-sm text-gray-500 text-center">
                    Admin access is managed by Super Admin through permissions settings.
                </p>
            </div>
        </div>
    );
}
