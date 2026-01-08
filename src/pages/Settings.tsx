import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Bell, Shield, Database, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <MainLayout title="Settings" subtitle="Manage your shop preferences and configurations">
      <div className="animate-fade-in rounded-xl border border-border bg-card shadow-sm">
        <Tabs defaultValue="general" className="w-full">
          <div className="border-b border-border px-6">
            <TabsList className="h-auto gap-4 bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Store className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Database className="mr-2 h-4 w-4" />
                Database
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="general" className="m-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Shop Information</h3>
                <p className="text-sm text-muted-foreground">
                  Basic information about your provision shop
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" defaultValue="NKEnterprise" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+233 24 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="info@NKEnterprise.gh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Market Street, Accra" />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold">Business Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how your shop operates
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="GHS (₵)" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                  <Input id="lowStockThreshold" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptPrefix">Receipt Prefix</Label>
                  <Input id="receiptPrefix" defaultValue="INV-" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="m-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Choose what notifications you want to receive
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when products fall below minimum stock level
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">Daily Sales Summary</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of sales at end of day
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">New Order Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified for every new sale transaction
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">Supplier Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates when supplier orders are delivered
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="m-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account security and access
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div></div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="database" className="m-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Database Management</h3>
                <p className="text-sm text-muted-foreground">
                  Backup and manage your shop data
                </p>
              </div>

              <div className="rounded-lg border border-border p-6">
                <div className="mb-4">
                  <h4 className="font-medium">Data Backup</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a backup of all your shop data
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export Products</Button>
                  <Button variant="outline">Export Sales</Button>
                  <Button variant="outline">Export Suppliers</Button>
                  <Button>Full Backup</Button>
                </div>
              </div>

              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
                <div className="mb-4">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                </div>
                <Button variant="destructive">Reset All Data</Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
