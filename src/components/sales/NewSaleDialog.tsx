import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  items: number;
  total: number;
  paymentMethod: "cash" | "card" | "mobile";
  status: "completed" | "pending" | "refunded";
}

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSaleCreated?: (newSale: Sale) => void; 
}

const NewSaleDialog = ({ open, onOpenChange, onSaleCreated }: NewSaleDialogProps) => {
  const handleCreateSale = () => {
    const newSale: Sale = {
      id: Date.now().toString(),
      invoiceNo: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      items: 1,
      total: 100,
      paymentMethod: "cash",
      status: "completed",
    };

    // Call parent callback
    onSaleCreated?.(newSale);

    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Invoice Number" value={`INV-${Date.now()}`} readOnly />
          <Input placeholder="Items" type="number" defaultValue={1} />
          <Input placeholder="Total" type="number" defaultValue={100} />
        </div>
        <DialogFooter>
          <Button onClick={handleCreateSale}>Create Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSaleDialog;
