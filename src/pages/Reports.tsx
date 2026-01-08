import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  FileBarChart,
} from "lucide-react";

const Reports = () => {
  // Empty data - no static data
  const monthlySales: { name: string; sales: number }[] = [];
  const categoryData: { name: string; value: number; color: string }[] = [];
  const profitTrend: { name: string; profit: number }[] = [];

  const hasData = monthlySales.length > 0;

  return (
    <MainLayout title="Reports" subtitle="View analytics and business insights">
      {/* Quick Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₵0</p>
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          </div>
        </div>

        <div
          className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-success/10 p-3">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold">₵0</p>
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          </div>
        </div>

        <div
          className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent/10 p-3">
              <ShoppingCart className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          </div>
        </div>

        <div
          className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items Sold</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="animate-slide-up rounded-xl border border-border bg-card p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <FileBarChart className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-card-foreground">
              No reports yet
            </h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              Start making sales to see your analytics and business insights
              here
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Charts Row 1 */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            {/* Monthly Sales */}
            <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Monthly Sales</h3>
                  <p className="text-sm text-muted-foreground">
                    Revenue over the past 6 months
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(220, 13%, 91%)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(220, 9%, 46%)"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(220, 9%, 46%)"
                      fontSize={12}
                      tickFormatter={(value) => `₵${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 13%, 91%)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [
                        `₵${value.toLocaleString()}`,
                        "Sales",
                      ]}
                    />
                    <Bar
                      dataKey="sales"
                      fill="hsl(226, 71%, 40%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Sales by Category</h3>
                <p className="text-sm text-muted-foreground">
                  Distribution of sales across categories
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {categoryData.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="font-medium">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profit Trend */}
          <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Profit Trend</h3>
                <p className="text-sm text-muted-foreground">
                  Weekly profit analysis
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  This Month
                </Button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220, 13%, 91%)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(220, 9%, 46%)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(220, 9%, 46%)"
                    fontSize={12}
                    tickFormatter={(value) => `₵${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `₵${value.toLocaleString()}`,
                      "Profit",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Reports;
