/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PaymentRecording = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payments, setPayments] = useState([
    {
      id: 1,
      invoiceNumber: "INV-001",
      customerName: "Acme Corp",
      amount: 1500.0,
      method: "Bank Transfer",
      reference: "TXN-123456",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      customerName: "TechCorp LLC",
      amount: 750.0,
      method: "Credit Card",
      reference: "CC-789012",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      customerName: "John Smith",
      amount: 250.0,
      method: "PayPal",
      reference: "PP-345678",
      date: "2024-01-13",
      status: "completed",
    },
  ]);

  const paymentMethods = [
    { value: "bank_transfer", label: "Bank Transfer", icon: Building },
    { value: "credit_card", label: "Credit Card", icon: CreditCard },
    { value: "debit_card", label: "Debit Card", icon: CreditCard },
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "paypal", label: "PayPal", icon: Smartphone },
    { value: "stripe", label: "Stripe", icon: CreditCard },
    { value: "check", label: "Check", icon: Banknote },
    { value: "other", label: "Other", icon: CreditCard },
  ];

  const getPaymentMethodIcon = (method) => {
    const methodData = paymentMethods.find(
      (m) =>
        m.label.toLowerCase().includes(method.toLowerCase()) ||
        method.toLowerCase().includes(m.label.toLowerCase())
    );
    const IconComponent = methodData?.icon || CreditCard;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Recording</h1>
          <p className="text-muted-foreground">
            Record and track payments for invoices
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoice">Invoice</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inv-001">
                      INV-001 - Acme Corp ($1,500.00)
                    </SelectItem>
                    <SelectItem value="inv-004">
                      INV-004 - Tech Solutions ($2,200.00)
                    </SelectItem>
                    <SelectItem value="inv-005">
                      INV-005 - Design Co ($850.00)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center space-x-2">
                          <method.icon className="h-4 w-4" />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input id="reference" placeholder="Transaction reference" />
              </div>

              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input id="paymentDate" type="date" />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Additional notes" />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Record Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payments..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {getPaymentMethodIcon(payment.method)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{payment.invoiceNumber}</h3>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • Ref: {payment.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRecording;
