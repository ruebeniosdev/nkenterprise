import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface LowStockItem {
  product_id: number;
  product_name: string;
  quantity_in_stock: number;
  reorder_level: number;
}

const LowStockAlert = () => {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = "https://e0381ad6b58d.ngrok-free.app/api";

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("Dashboard: No auth token found");
      setLoading(false);
      return;
    }

    const fetchLowStock = async () => {
      try {
        const response = await fetch(`${baseUrl}/products/low-stock`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        const result = await response.json();

        console.log("Low stock dashboard response:", result);

        if (!response.ok) {
          throw new Error(result.message || "Request failed");
        }

        // 🔥 SUPPORT BOTH RESPONSE SHAPES
        const data =
          result.data ||
          result.products ||
          [];

        setItems(data);
      } catch (error) {
        console.error("Dashboard low stock error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold">Low Stock Alert</h3>
        <span className="ml-auto text-sm text-muted-foreground">
          {items.length} items
        </span>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Checking stock levels…
        </p>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500/60" />
          All stock levels are good
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.product_id}
              className="rounded-lg bg-red-50 p-3"
            >
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity_in_stock} left (Min: {item.reorder_level})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;
