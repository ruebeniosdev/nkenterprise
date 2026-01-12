import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, AlertTriangle, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface LowStockItem {
  product_id: number;
  product_name: string;
  category_name: string;
  quantity_in_stock: number;
  reorder_level: number;
  shortage: number;
  supplier_name: string;
}

const LowStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("https://e0381ad6b58d.ngrok-free.app/api/products/low-stock", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLowStockItems(result.data || []);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch low stock products",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = lowStockItems.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReorder = (item: LowStockItem) => {
    toast({
      title: "Reorder Initiated",
      description: `Purchase order created for ${item.product_name} from ${item.supplier_name}`,
    });
  };

  const getStockLevel = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage === 0) return "critical";
    if (percentage < 50) return "low";
    return "warning";
  };

  if (loading) {
    return (
      <MainLayout title="Low Stock Alerts" subtitle="Products that need to be restocked">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading low stock products...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Low Stock Alerts" subtitle="Products that need to be restocked">
      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="animate-fade-in rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical (Out of Stock)</p>
              <p className="text-2xl font-bold text-destructive">
                {lowStockItems.filter((i) => i.quantity_in_stock === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in rounded-xl border border-border bg-card p-6" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-warning/10 p-3">
              <Package className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in rounded-xl border border-border bg-card p-6" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Shortage</p>
              <p className="text-2xl font-bold text-primary">
                {lowStockItems.reduce((sum, item) => sum + item.shortage, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:w-80"
            />
          </div>
          <Button disabled={lowStockItems.length === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Reorder All
          </Button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <CheckCircle className="mb-4 h-16 w-16 text-success/50" />
            <h3 className="text-lg font-semibold text-card-foreground">All stock levels are good!</h3>
            <p className="text-muted-foreground">No items need restocking at this time</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Shortage</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockLevel = getStockLevel(item.quantity_in_stock, item.reorder_level);
                  const stockPercentage = Math.min((item.quantity_in_stock / item.reorder_level) * 100, 100);

                  return (
                    <TableRow key={item.product_id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell>
                        <div className="w-32 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className={stockLevel === "critical" ? "text-destructive" : "text-warning"}>
                              {item.quantity_in_stock} / {item.reorder_level}
                            </span>
                            {stockLevel === "critical" && (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <Progress 
                            value={stockPercentage} 
                            className={`h-2 ${stockLevel === "critical" ? "[&>div]:bg-destructive" : "[&>div]:bg-warning"}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-destructive border-destructive/20">
                          -{item.shortage} units
                        </Badge>
                      </TableCell>
                      <TableCell>{item.supplier_name}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant={stockLevel === "critical" ? "destructive" : "outline"}
                          onClick={() => handleReorder(item)}
                        >
                          Reorder
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LowStock;