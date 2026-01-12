import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentSales from "@/components/dashboard/RecentSales";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* =======================
   Types
======================= */

interface Sale {
  sale_id: number;
  total_amount: string;
  sale_date: string;
}

/* =======================
   Dashboard
======================= */

const Index = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     Fetch Sales
  ======================= */
  const fetchSales = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please login to continue",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch(
      "https://e0381ad6b58d.ngrok-free.app/api/sales/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Dashboard API error:", result);
      throw new Error("Failed to fetch sales");
    }

    // ✅ Handle BOTH response shapes
    const salesData = Array.isArray(result)
      ? result
      : result.data ?? [];

    setSales(salesData);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to load dashboard data",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSales();
  }, []);

  /* =======================
     Calculations
  ======================= */

  const today = new Date().toDateString();

  const todaySales = sales.filter(
    (s) => new Date(s.sale_date).toDateString() === today
  );

  const todayRevenue = todaySales.reduce(
    (sum, s) => sum + parseFloat(s.total_amount),
    0
  );

  const monthlySales = sales.filter((s) => {
    const d = new Date(s.sale_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyRevenue = monthlySales.reduce(
    (sum, s) => sum + parseFloat(s.total_amount),
    0
  );

  const monthlyGrowth =
    sales.length > 0 ? ((monthlyRevenue / 1000) * 100).toFixed(1) : "0";

  /* =======================
     UI
  ======================= */

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={`₵${todayRevenue.toFixed(2)}`}
          change={`${todaySales.length} sale(s) today`}
          changeType="positive"
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Total Sales"
          value={sales.length.toString()}
          change="All time"
          changeType="neutral"
          icon={ShoppingCart}
          iconColor="accent"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₵${monthlyRevenue.toFixed(2)}`}
          change="This month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="success"
        />
        <StatCard
          title="Products"
          value="—"
          change="Coming soon"
          changeType="neutral"
          icon={Package}
          iconColor="primary"
        />
      </div>

      {/* Charts + Alerts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart sales={monthlySales} />
        </div>
        <LowStockAlert />
      </div>

      {/* Bottom */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentSales sales={todaySales.slice(0, 5)} />
        <TopProducts />
      </div>
    </MainLayout>
  );
};

export default Index;
