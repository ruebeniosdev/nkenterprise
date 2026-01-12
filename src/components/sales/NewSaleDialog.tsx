import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =======================
   Types
======================= */

export interface SaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface NewSaleData {
  customer_name: string;
  payment_method: "cash" | "card" | "mobile";
  items: SaleItem[];
}

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSaleCreated: (newSale: NewSaleData) => Promise<void>;
}

const NewSaleDialog = ({
  open,
  onOpenChange,
  onSaleCreated,
}: NewSaleDialogProps) => {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile"
  >("cash");

  // 🔴 Demo item (replace with real cart later)
  const items: SaleItem[] = [
    {
      product_id: 1,
      quantity: 1,
      unit_price: 100,
    },
  ];

  const handleCreateSale = async () => {
    await onSaleCreated({
      customer_name: customerName,
      payment_method: paymentMethod,
      items,
    });

    setCustomerName("");
    setPaymentMethod("cash");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <select
            className="w-full rounded-md border px-3 py-2"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as "cash" | "card" | "mobile")
            }
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile Money</option>
          </select>
        </div>

        <DialogFooter>
          <Button onClick={handleCreateSale}>Create Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSaleDialog;
