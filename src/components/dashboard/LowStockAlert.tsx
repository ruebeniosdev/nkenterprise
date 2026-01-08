import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
}

const LowStockAlert = () => {
  // Empty data - no static data
  const lowStockItems: LowStockItem[] = [];

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground">Low Stock Alert</h3>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {lowStockItems.length} items
        </span>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center text-center">
          <CheckCircle className="mb-3 h-10 w-10 text-success/50" />
          <p className="text-muted-foreground">All stock levels are good</p>
          <p className="text-sm text-muted-foreground/70">Add products to track inventory</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-destructive/5 p-3"
              >
                <div>
                  <p className="font-medium text-card-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.currentStock} left (Min: {item.minStock})
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                  Restock
                </Button>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" variant="outline">
            View All Low Stock Items
          </Button>
        </>
      )}
    </div>
  );
};

export default LowStockAlert;
