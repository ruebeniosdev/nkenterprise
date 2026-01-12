import { useEffect, useState } from "react";
import { TrendingUp, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TopProduct {
  product_id: number;
  product_name: string;
  category_name: string;
  total_quantity_sold: number;
  total_revenue: string;
  number_of_sales: number;
}

const TopProducts = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = "https://e0381ad6b58d.ngrok-free.app/api";
  const token = localStorage.getItem("authToken");

  const fetchTopProducts = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/sales/top-products?limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load top products");
      }

      setProducts(result.data || []);
    } catch (error) {
      console.error("Top products error:", error);
      toast({
        title: "Error",
        description: "Failed to load top products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Top Products
        </h3>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading top products…
        </div>
      )}

      {/* Empty */}
      {!loading && products.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No top products yet</p>
          <p className="text-sm text-muted-foreground/70">
            Start selling to see rankings
          </p>
        </div>
      )}

      {/* Data */}
      {!loading && products.length > 0 && (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.product_id}
              className="flex items-center gap-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </span>

              <div className="flex-1">
                <p className="font-medium text-card-foreground">
                  {product.product_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.total_quantity_sold} units sold
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-card-foreground">
                  ₵{parseFloat(product.total_revenue).toLocaleString()}
                </p>
                <p className="flex items-center justify-end gap-1 text-sm text-success">
                  <TrendingUp className="h-3 w-3" />
                  {product.number_of_sales} sales
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
