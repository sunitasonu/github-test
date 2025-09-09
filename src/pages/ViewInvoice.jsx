import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Edit,
  Mail,
  Printer,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoiceStatus, setInvoiceStatus] = useState("paid");

  // Mock invoice data with payment history
  const invoice = {
    id: id,
    number: "INV-001",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
    client: {
      name: "Acme Corp",
      email: "contact@acmecorp.com",
      address: "123 Business St\nSuite 100\nCity, State 12345",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        description: "Website Development",
        quantity: 1,
        rate: 1000,
        amount: 1000,
      },
      { description: "SEO Optimization", quantity: 1, rate: 250, amount: 250 },
    ],
    subtotal: 1250,
    tax: 125,
    total: 1375,
    notes: "Thank you for your business!",
    paymentHistory: [
      {
        id: 1,
        date: "2024-02-10",
        amount: 1375,
        method: "Bank Transfer",
        reference: "TXN-001234",
        status: "completed",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
    // Add PDF download logic here
  };

  const handleSendInvoice = () => {
    console.log("Send invoice");
    // Add send invoice logic here
  };

  const handleStatusUpdate = (newStatus) => {
    setInvoiceStatus(newStatus);
    console.log("Update status to:", newStatus);
    // Add status update logic here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Invoice {invoice.number}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(invoice.status)}>
                {getStatusIcon(invoice.status)}
                <span className="ml-1">{invoice.status}</span>
              </Badge>
              <span className="text-sm text-muted-foreground">
                Due: {invoice.dueDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleSendInvoice}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Link to={`/invoices/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice */}
        <div className="lg:col-span-2">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                      <div className="h-6 w-6 bg-white rounded"></div>
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      SabajiMandi
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    123 Company Street
                    <br />
                    Suite 456
                    <br />
                    Business City, BC 12345
                    <br />
                    Phone: +1 (555) 987-6543
                  </p>
                </div>

                <div className="text-right">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    INVOICE
                  </h2>
                  <p className="text-muted-foreground">#{invoice.number}</p>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Bill To:
                  </h3>
                  <div className="text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {invoice.client.name}
                    </p>
                    <p>{invoice.client.email}</p>
                    <p>{invoice.client.phone}</p>
                    <div className="whitespace-pre-line">
                      {invoice.client.address}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">
                        Invoice Date:{" "}
                      </span>
                      <span className="font-medium">{invoice.date}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date: </span>
                      <span className="font-medium">{invoice.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Payment Terms:{" "}
                      </span>
                      <span className="font-medium">Net 30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>

                  {invoice.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 p-4 border-t"
                    >
                      <div className="col-span-6">{item.description}</div>
                      <div className="col-span-2 text-center">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-center">
                        ${item.rate.toFixed(2)}
                      </div>
                      <div className="col-span-2 text-right">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Total */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="border-t pt-8">
                  <h3 className="font-semibold text-foreground mb-2">Notes:</h3>
                  <p className="text-muted-foreground">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Update Status
                  </label>
                  <Select
                    value={invoiceStatus}
                    onValueChange={handleStatusUpdate}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.paymentHistory.length > 0 ? (
                  invoice.paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.method}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ref: {payment.reference}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No payments recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Duplicate Invoice
                </Button>
                <Button className="w-full" variant="outline">
                  Convert to Quote
                </Button>
                <Button className="w-full" variant="destructive">
                  Delete Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
