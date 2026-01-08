import { Package } from "lucide-react";

interface Sale {
  id: string;
  product: string;
  quantity: number;
  total: number;
  time: string;
}

const RecentSales = () => {
  // Empty data - no static data
  const recentSales: Sale[] = [];

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Sales</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      {recentSales.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No recent sales</p>
          <p className="text-sm text-muted-foreground/70">Sales will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{sale.product}</p>
                  <p className="text-sm text-muted-foreground">Qty: {sale.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-card-foreground">₵{sale.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{sale.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSales;
