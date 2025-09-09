import React, { useState } from "react";
import { Plus, Edit, Trash2, Percent, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// interface Discount {
//   id;
//   name;
//   type: 'percentage' | 'flat';
//   value;
//   description?;
//   isActive;
//   applicationType: 'global' | 'per_item';
//   minAmount?;
//   maxAmount?;
//   validFrom?;
//   validTo?;
// }

const DiscountSettings = () => {
  const [discounts, setDiscounts] = useState([
    {
      id: "1",
      name: "Early Bird Discount",
      type: "percentage",
      value: 10,
      description: "Early payment discount for invoices paid within 10 days",
      isActive: true,
      applicationType: "global",
      minAmount: 100,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
    },
    {
      id: "2",
      name: "Bulk Order Discount",
      type: "flat",
      value: 50,
      description: "Fixed discount for orders over $500",
      isActive: true,
      applicationType: "per_item",
      minAmount: 500,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  // (useState < Discount) | (null > null);
  // const [discount, setDiscount] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    value: 0,
    description: "",
    isActive: true,
    applicationType: "global",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingDiscount) {
      setDiscounts(
        discounts.map((discount) =>
          discount.id === editingDiscount.id
            ? { ...discount, ...formData }
            : discount
        )
      );
    } else {
      const newDiscount = {
        id: Date.now().toString(),
        name: formData.name || "",
        type: formData.type || "percentage",
        value: formData.value || 0,
        description: formData.description,
        isActive: formData.isActive ?? true,
        applicationType: formData.applicationType || "global",
        minAmount: formData.minAmount,
        maxAmount: formData.maxAmount,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
      };
      setDiscounts([...discounts, newDiscount]);
    }

    handleCloseDialog();
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData(discount);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDiscount(null);
    setFormData({
      name: "",
      type: "percentage",
      value: 0,
      description: "",
      isActive: true,
      applicationType: "global",
    });
  };

  const toggleDiscountStatus = (id) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === id
          ? { ...discount, isActive: !discount.isActive }
          : discount
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Discount Settings
          </h1>
          <p className="text-muted-foreground">
            Manage discount rules and settings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? "Edit Discount" : "Add New Discount"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Discount Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">
                    Discount Value{" "}
                    {formData.type === "percentage" ? "(%)" : "($)"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicationType">Application Type</Label>
                  <Select
                    value={formData.applicationType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, applicationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global Discount</SelectItem>
                      <SelectItem value="per_item">
                        Per Item Discount
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount">Minimum Amount ($)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minAmount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minAmount: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount">Maximum Amount ($)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maxAmount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAmount: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, validTo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDiscount ? "Update Discount" : "Add Discount"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {discounts.map((discount) => (
          <Card key={discount.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {discount.type === "percentage" ? (
                      <Percent className="h-5 w-5 text-primary" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{discount.name}</CardTitle>
                  </div>
                  <Badge variant={discount.isActive ? "default" : "secondary"}>
                    {discount.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {discount.applicationType === "global"
                      ? "Global"
                      : "Per Item"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={discount.isActive}
                    onCheckedChange={() => toggleDiscountStatus(discount.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(discount)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Discount</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this discount? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(discount.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Discount Value
                  </p>
                  <p className="font-medium">
                    {discount.type === "percentage"
                      ? `${discount.value}%`
                      : `$${discount.value}`}
                  </p>
                </div>
                {discount.minAmount && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Minimum Amount
                    </p>
                    <p className="font-medium">${discount.minAmount}</p>
                  </div>
                )}
                {discount.validFrom && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Valid Period
                    </p>
                    <p className="font-medium">
                      {discount.validFrom} - {discount.validTo || "No end date"}
                    </p>
                  </div>
                )}
              </div>
              {discount.description && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{discount.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscountSettings;
