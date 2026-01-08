import { TrendingUp, Package } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  trend: number;
}

const TopProducts = () => {
  // Empty data - no static data
  const topProducts: TopProduct[] = [];

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Top Products</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      {topProducts.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No top products yet</p>
          <p className="text-sm text-muted-foreground/70">Start selling to see rankings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-card-foreground">₵{product.revenue.toLocaleString()}</p>
                <p className="flex items-center justify-end gap-1 text-sm text-success">
                  <TrendingUp className="h-3 w-3" />
                  {product.trend}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProducts;
