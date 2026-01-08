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
import { Plus, Search, Calendar, Eye, Printer, ShoppingCart } from "lucide-react";
import NewSaleDialog from "@/components/sales/NewSaleDialog";

interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  items: number;
  total: number;
  paymentMethod: "cash" | "card" | "mobile";
  status: "completed" | "pending" | "refunded";
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
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalTransactions: 0,
    averageOrder: 0,
  });

  // Filter sales by invoice number
  const filteredSales = sales.filter((sale) =>
    sale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Badges
  const getStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Refunded</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (method: Sale["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return <Badge variant="outline">Cash</Badge>;
      case "card":
        return <Badge variant="outline">Card</Badge>;
      case "mobile":
        return <Badge variant="outline">Mobile Money</Badge>;
      default:
        return null;
    }
  };

  // Fetch sales from API
  const fetchSales = async () => {
    try {
      const res = await fetch("/api/sales"); // Replace with your API
      if (!res.ok) throw new Error("Failed to fetch sales");
      const data: Sale[] = await res.json();

      // Format sales
      const formattedSales = data.map((sale) => ({
        ...sale,
        date: new Date(sale.date).toLocaleString(),
      }));

      setSales(formattedSales);

      // Update stats
      const totalSales = formattedSales.reduce((sum, s) => sum + s.total, 0);
      setStats({
        totalSales,
        totalTransactions: formattedSales.length,
        averageOrder: formattedSales.length ? totalSales / formattedSales.length : 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle new sale added
  const handleSaleCreated = (newSale: Sale) => {
    setSales((prev) => [newSale, ...prev]);

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0) + newSale.total;
    setStats({
      totalSales,
      totalTransactions: sales.length + 1,
      averageOrder: totalSales / (sales.length + 1),
    });
  };

  return (
    <MainLayout title="Sales" subtitle="Track and manage all sales transactions">
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
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
            <p className="text-sm text-muted-foreground">Today's Sales</p>
            <p className="text-2xl font-bold text-primary">₵{stats.totalSales.toLocaleString()}</p>
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
            <h3 className="text-lg font-semibold text-card-foreground">No sales yet</h3>
            <p className="mb-4 text-muted-foreground">Create your first sale to get started</p>
            <Button onClick={() => setIsNewSaleOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                    <TableCell className="text-muted-foreground">{sale.date}</TableCell>
                    <TableCell className="text-center">{sale.items}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₵{sale.total.toLocaleString()}
                    </TableCell>
                    <TableCell>{getPaymentBadge(sale.paymentMethod)}</TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
