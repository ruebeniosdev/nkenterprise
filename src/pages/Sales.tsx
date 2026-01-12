import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Eye, Printer, ShoppingCart, RefreshCw } from "lucide-react";
import NewSaleDialog from "@/components/sales/NewSaleDialog";
import { toast } from "@/hooks/use-toast";

interface SaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

interface Sale {
  sale_id: number;
  total_amount: string;
  payment_method: "cash" | "card" | "mobile";
  customer_name: string;
  sale_date: string;
  cashier_name: string;
  cashier_username: string;
  items_count: number;
}

interface Stats {
  totalSales: number;
  totalTransactions: number;
  averageOrder: number;
}

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalTransactions: 0,
    averageOrder: 0,
  });

  // Filter sales by customer name or sale ID
  const filteredSales = sales.filter((sale) =>
    sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.sale_id.toString().includes(searchTerm)
  );

  // Payment method badge
  const getPaymentBadge = (method: Sale["payment_method"]) => {
    switch (method) {
      case "cash":
        return <Badge variant="outline">Cash</Badge>;
      case "card":
        return <Badge variant="outline">Card</Badge>;
      case "mobile":
        return <Badge variant="outline">Mobile Money</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  // Fetch sales from API
  const fetchSales = async () => {
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

      const response = await fetch("https://e0381ad6b58d.ngrok-free.app/api/sales/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSales(result.data || []);

        // Calculate stats from all sales
        const totalSales = (result.data || []).reduce(
          (sum: number, s: Sale) => sum + parseFloat(s.total_amount),
          0
        );
        const totalTransactions = result.data?.length || 0;
        
        setStats({
          totalSales,
          totalTransactions,
          averageOrder: totalTransactions ? totalSales / totalTransactions : 0,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch sales",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle new sale created
  const handleSaleCreated = async (newSaleData: {
    customer_name: string;
    payment_method: "cash" | "card" | "mobile";
    items: SaleItem[];
  }) => {
    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("proshop_user");
      
      if (!token || !userStr) {
        toast({
          title: "Authentication Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      const user = JSON.parse(userStr);

      const response = await fetch("https://e0381ad6b58d.ngrok-free.app/api/sales/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          user_id: parseInt(user.id),
          payment_method: newSaleData.payment_method,
          customer_name: newSaleData.customer_name,
          items: newSaleData.items,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: `Sale recorded successfully! Total: ₵${result.data.total_amount}`,
        });
        
        // Refresh sales list
        await fetchSales();
        setIsNewSaleOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to record sale",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <MainLayout title="Sales" subtitle="Track and manage all sales transactions">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading sales...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Sales" subtitle="Track and manage all sales transactions">
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchSales} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsNewSaleOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold text-primary">
              ₵{stats.totalSales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <div className="rounded-lg bg-success/5 p-4">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold text-success">{stats.totalTransactions}</p>
          </div>
          <div className="rounded-lg bg-accent/5 p-4">
            <p className="text-sm text-muted-foreground">Average Order</p>
            <p className="text-2xl font-bold text-accent">₵{stats.averageOrder.toFixed(2)}</p>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredSales.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-card-foreground">
              {searchTerm ? "No sales found" : "No sales yet"}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {searchTerm 
                ? "Try a different search term" 
                : "Create your first sale to get started"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsNewSaleOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Sale
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.sale_id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">#{sale.sale_id}</TableCell>
                    <TableCell>{sale.customer_name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(sale.sale_date)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{sale.items_count} items</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₵{parseFloat(sale.total_amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>{getPaymentBadge(sale.payment_method)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {sale.cashier_name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <NewSaleDialog
        open={isNewSaleOpen}
        onOpenChange={setIsNewSaleOpen}
        onSaleCreated={handleSaleCreated}
      />
    </MainLayout>
  );
};

export default Sales;