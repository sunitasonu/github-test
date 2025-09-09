import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Save, Printer, XCircle, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { fetchData, postData } from "@/utils/api";
import { SelectItem } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";

const clamp = (value) => {
  const v = parseFloat(value);
  return isNaN(v) ? 0 : Math.min(Math.max(0, v), 99999);
};

const SaleCreate = () => {
  const navigate = useNavigate();

  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    mobile: "",
    address1: "",
    address2: "",
    invoiceNo: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [previousBalance, setPreviousBalance] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [printSize, setPrintSize] = useState("58mm");
  const [isCessEnabled, setIsCessEnabled] = useState(false);
  const [cessPercent, setCessPercent] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [vegetables, setVegetables] = useState([]);
  const [cessAmount1, setCessAmount1] = useState([]);
  const [query, setQuery] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  const [items, setItems] = useState([
    {
      id: Date.now().toString(),
      vegetable: "",
      quantity: 0,
      unit: "Kg",
      rate: 0,
      total: 0,
    },
  ]);



  const getInvoice = async () => {
    const response = await fetchData("/sales-generate-invoice");
    if (response.success) {
      const inv = response.invoice_no;
      setCustomer((prev) => ({
        ...prev,
        invoiceNo: inv,
      }));
      setInvoiceNo(inv);
    } else {
      console.error(response.msg);
    }
  };

  // 2. Call it inside useEffect for initial load
  useEffect(() => {
    getInvoice();
  }, []);

  useEffect(() => {
    fetchData("/customers-getcustlist")
      .then((res) => setCustomerList(res))
      .catch((err) => console.error("Dropdown fetch failed:", err));
  }, []);

  const handleChange = async (value) => {
    setSelectedCustomerId(value); // <-- Track selected ID

    const selectedCustomer = customerList.find(
      (c) => c.mc_id === parseInt(value)
    );
    if (selectedCustomer) {
      try {
        const data = await fetchData(
          `/customers-getdetails/${selectedCustomer.mc_id}`
        );
        setCustomer((prev) => ({
          ...prev,
          custid: data.customer.mc_id,
          name: data.customer.mc_name,
          mobile: data.customer.mc_mobile_no,
          address1: data.customer.mc_street_address1,
          address2: data.customer.mc_street_address2,
        }));
        // setPreviousBalance(data.previous_balance);
        // setPreviousBalance(data.customer.mc_pre_bal);
        setPreviousBalance(Number(data.customer.mc_pre_bal));
      } catch (err) {
        console.error("Details fetch. failed:", err);
      }
    }
  };

  useEffect(() => {
    const fetchVegetable = async () => {
      try {
        const res = await fetchData("/vegetables-getveglist");
        if (res.success) {
          setVegetables(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchVegetable();
  }, []);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              total:
                field === "quantity" || field === "rate"
                  ? (field === "quantity" ? value : item.quantity) *
                    (field === "rate" ? value : item.rate)
                  : item.total,
            }
          : item
      )
    );
  };

  const addItem = () =>
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        vegetable: "",
        quantity: 0,
        unit: "Kg",
        rate: 0,
        total: 0,
      },
    ]);

  const removeItem = (id) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const cessAmount = isCessEnabled ? (subtotal * cessPercent) / 100 : 0;
  // const totalBalance = subtotal + cessAmount + previousBalance - paidAmount;
  const totalBalance = subtotal + cessAmount + previousBalance - paidAmount;

  console.log("Items:", items);
  console.log("Subtotal:", subtotal);
  console.log("Previous Balance:", previousBalance);
  console.log("Total:", totalBalance);

  useEffect(() => {
    const getCess = async () => {
      try {
        if (isCessEnabled) {
          const res = await fetchData("/tax");
          // console.log("cess",res)
          const cess = res?.data[0].mt_cess || 0;
          setCessPercent(cess);
          const cessAmt = (subtotal * cess) / 100;
          setCessAmount1(cessAmt);
          setFinalAmount(subtotal + cessAmt);
        } else {
          setCessPercent(0);
          setCessAmount1(0);
          setFinalAmount(subtotal);
        }
      } catch (err) {
        console.error("Cess fetch error:", err);
      }
    };

    getCess();
  }, [isCessEnabled, subtotal]);

  const formatCurrency = (amt) =>
    `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const clearForm = () => {
    setCustomer({
      name: "",
      date: new Date().toISOString().split("T")[0],
      mobile: "",
      address1: "",
      address2: "",
    });
    setPreviousBalance(0);
    setPaidAmount(0);
    setItems([
      {
        id: Date.now().toString(),
        vegetable: "",
        quantity: 0,
        unit: "Kg",
        rate: 0,
        total: 0,
      },
    ]);
  };

  // const handleSave = () => {
  //   console.log({
  //     customer,
  //     items,
  //     previousBalance,
  //     paidAmount,
  //     totalBalance,
  //   });
  //   alert("Sale saved successfully!");
  // };

  const handlePrint = () => {
    console.log("Printing in", printSize);
    alert("Print triggered");
  };

  const handleSearchCustomer = () => {
    // Dummy fetch logic
    setCustomer({
      name: "Ravi Traders",
      invoiceNo: "",
      date: new Date().toISOString().split("T")[0],
      mobile: "9876543210",
      address1: "Main Road",
      address2: "Kolhapur",
    });
    setPreviousBalance(4500);
  };

  const handleSave = async () => {
    // Basic validation
    if (!invoiceNo) {
      toast.error("Invoice number is required.");
      return;
    }

    if (!customer.custid) {
      toast.error("Please select a customer.");
      return;
    }

    if (!customer.date) {
      toast.error("Sale date is required.");
      return;
    }

    if (!items.length === 0) {
      toast.error("At least one item must be added.");
      return;
    }

    const invalidItem = items.find(
      (item) => !item.vegetable || !item.quantity || !item.unit || !item.rate
    );
    if (invalidItem) {
      toast.error("All item fields are required.");
      return;
    }

    // Construct payload
    const payload = {
      invoice_no: customer.invoiceNo,
      date: customer.date,
      customer_id: customer.custid,
      customer_name: customer.name,
      mobile: customer.mobile,
      address1: customer.address1,
      address2: customer.address2,
      previous_balance: parseFloat(previousBalance || 0),
      paid_amount: parseFloat(paidAmount || 0),
      is_cess_enabled: isCessEnabled,
      cess_percent: parseFloat(cessPercent || 0),
      remarks: remarks,
      items: items.map((item) => ({
        vegetable_name: item.vegetable,
        quantity: parseFloat(item.quantity || 0),
        unit: item.unit,
        rate: parseFloat(item.rate || 0),
        amount: parseFloat(item.total || 0),
      })),
    };

    try {
      const res = await postData("/sales", payload);
      toast.success("Sale created successfully!");

      getInvoice();

      // Optional: Reset the form after success
      setInvoiceNo("");
      setSelectedCustomer(null);
      setPreviousBalance(0);
      setPaidAmount(0);
      setIsCessEnabled(false);
      setCessPercent(0);
      setRemarks("");
      setItems([]);

      getInvoice();
      navigate(`/sale`);
    } catch (err) {
      console.error("Sale creation failed:", err);
      toast.error("Failed to create sale.");
    }
  };

  const handlePaidAmountChange = (e) => {
    const value = parseFloat(e.target.value || 0);

    // Check if value is greater than totalBalance
    if (value > totalBalance) {
      toast.error("Paid amount cannot exceed Total Balance.");
      return;
    }

    setPaidAmount(value);
  };

  return (
    <div className="space-y-2">
      <Toaster position="top-right" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/sale")}>
            ← Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Create Sale</h1>
            <p className="text-muted-foreground">Record vegetable sales</p>
          </div>
        </div>

        {/* Right: Search */}
        <div className="flex items-end gap-2">
          <Input placeholder="Search Name / Mobile" className="w-[250px]" />
          <Button size="sm" onClick={handleSearchCustomer}>
            <Search className="h-4 w-4 mr-1" /> Search
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* <div className="flex-1 min-w-[200px]">
            <Label>Customer</Label>
            <Select value={selectedCustomerId} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Customer"
                children={
                  customerList.find(c => c.mc_id.toString() === selectedCustomerId)?.mc_name
                }
                 />
              </SelectTrigger> 
              <SelectContent>
                {customerList.map((c) => (
                  <SelectItem key={c.mc_id} value={c.mc_id.toString()}>
                    {c.mc_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

            <div className="flex-1 min-w-[200px]">
              <Label>Customer</Label>
              <div className="relative">
                <Input
                  list="customer-options"
                  value={customer.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCustomer((prev) => ({ ...prev, name }));

                    // Try to find a match
                    const selected = customerList.find(
                      (c) => c.mc_name.toLowerCase() === name.toLowerCase()
                    );
                    if (selected) {
                      handleChange(selected.mc_id.toString());
                    }
                  }}
                  placeholder="Type or select customer..."
                />
                <datalist id="customer-options">
                  {customerList.map((c) => (
                    <option key={c.mc_id} value={c.mc_name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="w-[120px]">
              <Label>Invoice No</Label>
              <Input
                value={customer.invoiceNo}
                readOnly
                // placeholder="INV0001"
              />
            </div>
            <div className="w-[140px]">
              <Label>Date</Label>
              <Input
                type="date"
                value={customer.date}
                onChange={(e) =>
                  setCustomer({ ...customer, date: e.target.value })
                }
              />
            </div>
            <div className="w-[140px]">
              <Label>Mobile</Label>
              <Input value={customer.mobile} disabled placeholder="10-digit" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label>Address 1</Label>
              <Input
                value={customer.address1}
                disabled
                onChange={(e) =>
                  setCustomer({ ...customer, address1: e.target.value })
                }
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label>Address 2</Label>
              <Input
                value={customer.address2}
                disabled
                onChange={(e) =>
                  setCustomer({ ...customer, address2: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items</CardTitle>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Vegetable</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Unit</TableHead>
                      <TableHead className="text-center">Rate</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={addItem}
                              title="Add Item"
                              className="text-green-600"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Input
                              value={item.vegetable}
                              onChange={(e) =>
                                updateItem(item.id, "vegetable", e.target.value)
                              }
                              placeholder="Type vegetable name..."
                              className="w-[300px]"
                              list={`veg-options-${item.id}`}
                            />
                            <datalist id={`veg-options-${item.id}`}>
                              {vegetables.map((veg) => (
                                <option
                                  key={veg.mv_id}
                                  value={veg.mv_vegetable_name}
                                />
                              ))}
                            </datalist>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            className="w-[100px]"
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                clamp(e.target.value)
                              )
                            }
                            placeholder="0"
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <select
                            className="border rounded p-2  text-sm w-[140px]"
                            value={item.unit}
                            onChange={(e) =>
                              updateItem(item.id, "unit", e.target.value)
                            }
                          >
                            <option value="Kg">Kg</option>
                            <option value="Nos">Nos</option>
                            <option value="Bags">Bags</option>
                          </select>
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            className="w-[120px]"
                            onChange={(e) =>
                              updateItem(item.id, "rate", clamp(e.target.value))
                            }
                            placeholder="0"
                          />
                        </TableCell>

                        <TableCell className="text-right w-[160px]">
                          {formatCurrency(item.total)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            className="text-red-600"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Cess</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm">Enable Cess</span>
                <Switch
                  checked={isCessEnabled}
                  onCheckedChange={setIsCessEnabled}
                />
              </div>
            </CardHeader>

            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {isCessEnabled && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Cess ({cessPercent}%):</span>
                  <span>{formatCurrency(cessAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Previous Balance:</span>
                <Input
                  type="number"
                  className="w-[120px]"
                  disabled
                  value={previousBalance}
                  onChange={(e) => setPreviousBalance(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Paid Amount:</span>
                <Input
                  type="number"
                  className="w-[120px]"
                  value={paidAmount}
                  // onChange={(e) => setPaidAmount(clamp(e.target.value))}
                  onChange={handlePaidAmountChange}
                />
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Balance:</span>
                <span
                  className={
                    totalBalance < 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  {formatCurrency(totalBalance)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="sticky bottom-0 z-10 bg-white shadow-md border-t">
            <CardFooter className="flex justify-center py-4 gap-4">
              <Button
                variant="outline"
                onClick={clearForm}
                className="text-red-600 border-red-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button className="bg-blue-600 text-white" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Sale
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Save & Print
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SaleCreate;
