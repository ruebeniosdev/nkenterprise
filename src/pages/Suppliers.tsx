import { useEffect, useState } from "react";
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
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import AddSupplierDialog from "@/components/suppliers/AddSupplierDialog";

/* =======================
   Types
======================= */

interface Supplier {
  category_id: number;
  category_name: string;
  description: string;
  product_count: number;
  created_at: string;
}

interface SuppliersApiResponse {
  success: boolean;
  count: number;
  data: Supplier[];
}

/* =======================
   Component
======================= */

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =======================
     Fetch Suppliers
  ======================= */

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/suppliers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        );

        const json: SuppliersApiResponse = await response.json();

        if (!response.ok) {
          throw new Error("Failed to load suppliers");
        }

        setSuppliers(json.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  /* =======================
     Derived Data
  ======================= */

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = suppliers.reduce(
    (sum, supplier) => sum + supplier.product_count,
    0
  );

  /* =======================
     Render
  ======================= */

  return (
    <MainLayout title="Suppliers" subtitle="Manage your suppliers">
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:w-80"
            />
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Total Suppliers</p>
            <p className="text-2xl font-bold text-primary">
              {suppliers.length}
            </p>
          </div>

          <div className="rounded-lg bg-success/5 p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold text-success">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-lg bg-accent/5 p-4">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold text-accent">
              {suppliers.length}
            </p>
          </div>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading suppliers...
          </p>
        )}

        {error && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {!loading && !error && filteredSuppliers.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <Users className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No suppliers found</h3>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Supplier</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.category_id}>
                    <TableCell className="font-medium">
                      {supplier.category_name}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {supplier.description}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {supplier.product_count} items
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(
                        supplier.created_at
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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

      <AddSupplierDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </MainLayout>
  );
};

export default Suppliers;
