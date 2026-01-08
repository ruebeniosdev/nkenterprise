import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentSales from "@/components/dashboard/RecentSales";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value="₵0"
          change="No sales yet"
          changeType="neutral"
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Total Products"
          value="0"
          change="Add products to start"
          changeType="neutral"
          icon={Package}
          iconColor="primary"
        />
        <StatCard
          title="Today's Orders"
          value="0"
          change="No orders yet"
          changeType="neutral"
          icon={ShoppingCart}
          iconColor="accent"
        />
        <StatCard
          title="Monthly Growth"
          value="0%"
          change="Start selling to see growth"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="success"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <LowStockAlert />
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentSales />
        <TopProducts />
      </div>
    </MainLayout>
  );
};

export default Index;
