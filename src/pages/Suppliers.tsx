import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  X,
  AlertTriangle,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

/* =======================
   Types
======================= */

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

interface SuppliersApiResponse {
  success: boolean;
  count: number;
  data: Supplier[];
  message?: string;
}

/* =======================
   Component
======================= */

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Add dialog */
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Delete dialog */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [supplierToDelete, setSupplierToDelete] =
    useState<Supplier | null>(null);

  const [form, setForm] = useState({
    supplier_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  const baseUrl = "https://e0381ad6b58d.ngrok-free.app/api";
  const token = localStorage.getItem("authToken");

  /* =======================
     Fetch Suppliers
  ======================= */

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${baseUrl}/suppliers`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data: SuppliersApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load suppliers");
      }

      setSuppliers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* =======================
     Create Supplier
  ======================= */

  const handleCreateSupplier = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${baseUrl}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create supplier");
      }

      setOpen(false);
      setForm({
        supplier_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      });

      fetchSuppliers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating supplier");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     Delete Supplier
  ======================= */

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${baseUrl}/suppliers/${supplierToDelete.supplier_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete supplier");
      }

      setDeleteOpen(false);
      setSupplierToDelete(null);
      fetchSuppliers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* =======================
     Filter
  ======================= */

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =======================
     Render
  ======================= */

  return (
    <MainLayout title="Suppliers" subtitle="Manage your suppliers">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl bg-white rounded-xl border shadow-sm">

          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 p-6 border-b">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search suppliers..."
                className="w-full rounded-lg border px-9 py-2 text-sm"
              />
            </div>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </button>
          </div>

          {/* Table */}
          <div className="p-6">
            {!loading && filteredSuppliers.length > 0 && (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Supplier</th>
                      <th className="px-4 py-3 text-left">Contact</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Address</th>
                      <th className="px-4 py-3 text-left">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredSuppliers.map((s) => (
                      <tr key={s.supplier_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{s.supplier_name}</td>
                        <td className="px-4 py-3">{s.contact_person || "-"}</td>
                        <td className="px-4 py-3">{s.email}</td>
                        <td className="px-4 py-3">{s.phone || "-"}</td>
                        <td className="px-4 py-3">{s.address || "-"}</td>
                        <td className="px-4 py-3">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSupplierToDelete(s);
                              setDeleteOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* =======================
           Delete Confirmation
        ======================= */}
        {deleteOpen && supplierToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h2 className="text-lg font-semibold">Delete Supplier</h2>
              </div>

              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{supplierToDelete.supplier_name}</strong>?  
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={handleDeleteSupplier}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Suppliers;
