import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";

const SalesChart = () => {
  // Empty data - no static data
  const data: { name: string; sales: number }[] = [];

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Weekly Sales</h3>
          <p className="text-sm text-muted-foreground">Sales performance this week</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No sales data yet</p>
          <p className="text-sm text-muted-foreground/70">Start making sales to see your chart</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(226, 71%, 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(226, 71%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(220, 9%, 46%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(220, 9%, 46%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₵${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`₵${value.toLocaleString()}`, "Sales"]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="hsl(226, 71%, 40%)"
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
