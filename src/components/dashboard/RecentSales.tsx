import { Package } from "lucide-react";

/* =======================
   Types
======================= */

interface Sale {
  sale_id: number;
  total_amount: string;
  sale_date: string;
  customer_name?: string;
}

interface RecentSalesProps {
  sales: Sale[];
}

/* =======================
   Component
======================= */

const RecentSales = ({ sales }: RecentSalesProps) => {
  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Sales</h3>
        <span className="text-sm font-medium text-primary">Today</span>
      </div>

      {sales.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No recent sales</p>
          <p className="text-sm text-muted-foreground/70">
            Sales will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div
              key={sale.sale_id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium text-card-foreground">
                  Sale #{sale.sale_id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(sale.sale_date).toLocaleTimeString()}
                </p>
              </div>

              <p className="font-semibold text-card-foreground">
                ₵{parseFloat(sale.total_amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSales;
