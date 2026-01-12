import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package } from "lucide-react";

/* =======================
   Types
======================= */

interface Sale {
  sale_date: string;
  total_amount: string;
}

interface SalesChartProps {
  sales: Sale[];
}

/* =======================
   Helpers
======================= */

const formatChartData = (sales: Sale[]) => {
  const map: Record<string, number> = {};

  sales.forEach((sale) => {
    const day = new Date(sale.sale_date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    map[day] = (map[day] || 0) + parseFloat(sale.total_amount);
  });

  return Object.entries(map).map(([name, sales]) => ({
    name,
    sales,
  }));
};

/* =======================
   Component
======================= */

const SalesChart = ({ sales }: SalesChartProps) => {
  const data = formatChartData(sales);

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Weekly Sales
        </h3>
        <p className="text-sm text-muted-foreground">
          Sales performance this week
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No sales data yet</p>
          <p className="text-sm text-muted-foreground/70">
            Start making sales to see your chart
          </p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopOpacity={0.3} />
                  <stop offset="95%" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₵${v}`} />
              <Tooltip formatter={(v: number) => `₵${v.toFixed(2)}`} />

              <Area
                type="monotone"
                dataKey="sales"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
