/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvoiceTemplates from "@/components/InvoiceTemplates";

const CreateInvoice = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0, taxRate: 0 },
  ]);

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id)) + 1;
    setItems([
      ...items,
      {
        id: newId,
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        taxRate: 0,
      },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = items.reduce(
    (sum, item) => sum + item.amount * (item.taxRate / 100),
    0
  );
  const total = subtotal + totalTax;

  const handlePreview = () => {
    console.log("Preview invoice with template:", selectedTemplate);
    // Add preview logic here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="template">Choose Template</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Invoice Details</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input id="invoiceNumber" placeholder="INV-001" />
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate">Invoice Date</Label>
                      <Input id="invoiceDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net15">Net 15</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net45">Net 45</SelectItem>
                          <SelectItem value="net60">Net 60</SelectItem>
                          <SelectItem value="due-on-receipt">
                            Due on Receipt
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input id="clientName" placeholder="Enter client name" />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input id="clientPhone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Address</Label>
                      <Textarea
                        id="clientAddress"
                        placeholder="Enter client address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Invoice Items</h3>
                  <Button onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
                    <div className="col-span-1 flex justify-center">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-1">Tax %</div>
                    <div className="col-span-1">Amount</div>
                    <div className="col-span-1"></div>
                  </div>

                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 p-4 border-t"
                    >
                      <div className="col-span-1 flex justify-center items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addItem}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="col-span-4">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.taxRate}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "taxRate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center h-10 px-3 text-sm">
                          ${item.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or terms..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardContent className="p-6">
              <InvoiceTemplates
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Preview</CardTitle>
                <Button onClick={handlePreview} variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Invoice Preview</p>
                  <p className="text-sm">Template: {selectedTemplate}</p>
                  <p className="text-sm">
                    Preview will show here with selected template and data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Link to="/invoices">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button>Save as Draft</Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Create Invoice
        </Button>
      </div>
    </div>
  );
};

export default CreateInvoice;
