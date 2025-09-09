import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Save,
  Printer,
  ArrowLeft,
  XCircle,
  Pencil,
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

import { nanoid } from "nanoid";
import { fetchData, postData } from "@/utils/api";

import toast, { Toaster } from "react-hot-toast";


const clampToNonNegative = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return 0;
  return Math.min(num, 99999);
};
const AavakCreate = () => {
  const navigate = useNavigate();
  // const { toast } = useToast();

  const [farmerName, setFarmerName] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [vehicleRent, setVehicleRent] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [others, setOthers] = useState(0);
  const [printSize, setPrintSize] = useState("58mm");

  const [othersLabel, setOthersLabel] = useState("");
  const [isEditingOthersLabel, setIsEditingOthersLabel] = useState(false);
  const othersLabelRef = useRef(null);
  const [creditAmount, setCreditAmount] = useState(0); 
  const [farmers, setFarmers] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [farmerId, setFarmerId] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedAvakId, setSavedAvakId] = useState(null); // To store the new Avak ID

  
 

  const [items, setItems] = useState([
    {
      id: "1",
      vegetable: "",
      quantity: 0,
      unit: "Kg",
      rate: 0,
      hamaliPerBag: 0,
      hamaliAmount: 0,
      totalAmount: 0,
    },
  ]);




  useEffect(() => {
    if (isEditingOthersLabel && othersLabelRef.current) {
      const el = othersLabelRef.current;
      el.focus();

      // Move cursor to end
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditingOthersLabel]);

  const addItem = () => {
    const newItem = {
      id: nanoid(),
      vegetable: "",
      quantity: 0,
      unit: "Kg",
      rate: 0,
      hamaliPerBag: 0,
      hamaliAmount: 0,
      totalAmount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };


useEffect(() => {
  fetchNextBillNumber();
}, []);

const fetchNextBillNumber = async () => {
  try {
    const response = await fetchData("/avak-next-bill-number");

    if (response.success) {
      setBillNumber(response.bill_no);
    } else {
      toast.error(response.msg || "Failed to get bill number");
    }
  } catch (error) {
    console.error("Error fetching bill number:", error);
    toast.error("Something went wrong while getting bill number");
  }
};


const loadFarmers = async () => {
  try {
    const response = await fetchData("/farmers-getfarlist");

    if (response.success) {
      setFarmers(response.data); // array of { mf_id, mf_name }
    } else {
      toast.error(response.msg || "Failed to load farmers");
    }
  } catch (error) {
    console.error("Error fetching farmers:", error);
    toast.error("Something went wrong while fetching farmers");
  }
};

useEffect(() => {
  loadFarmers();
}, []);





useEffect(() => {
  const loadVegetables = async () => {
    try {
      const res = await fetchData("/vegetables-getveglist");
      if (res.success) {
        // Only names
        const vegNames = res.data.map((v) => v.mv_vegetable_name);
        setVegetables(vegNames);
      } else {
        toast.error("Failed to load vegetables");
      }
    } catch (err) {
      toast.error("Error loading vegetables");
    }
  };

  loadVegetables();
}, []);



const handleSave = async () => {
  // Validation for required farmer name
  if (!farmerName?.trim()) {
    toast.error("Farmer name is required");
    return;
  }

  // At least one item required
  if (items.length === 0) {
    toast.error("At least one item is required");
    return;
  }

  // Validate each item row
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const index = i + 1;

    if (!item.vegetable?.trim()) {
      toast.error(`Vegetable name missing in row ${index}`);
      return;
    }

    if (!item.quantity || item.quantity <= 0) {
      toast.error(`Enter valid quantity in row ${index}`);
      return;
    }

    if (!item.unit?.trim()) {
      toast.error(`Unit missing in row ${index}`);
      return;
    }

    if (!item.rate || item.rate <= 0) {
      toast.error(`Enter valid rate in row ${index}`);
      return;
    }

    // ✅ Fix: use === null or === undefined explicitly
    // if (item.hamaliPerBag || item.hamaliPerBag <= 0) {
    //   toast.error(`Add hamali  ${index}`);
    //   return;
    // }
  }

  // Validate other amount fields: advance, vehicleRent, creditAmount, others
  if (
    advance < 0 ||
    vehicleRent < 0 ||
    creditAmount < 0 ||
    others < 0
  ) {
    toast.error("Amount fields (Advance, Rent, Others, Credit) must be 0 or more");
    return;
  }

  // Prepare payload
  const payload = {
    am_farmer_id: farmerId,
    am_farmer_name: farmerName,
    am_bill_number: billNumber,
    am_purchase_date: date,
    am_vehicle_rent: vehicleRent,
    am_advance: advance,
    am_others: others,
    am_others_label: othersLabel,
    credit_amount: creditAmount,
    items: items.map((item) => ({
      ai_vegetable_name: item.vegetable,
      ai_quantity: item.quantity,
      ai_unit: item.unit,
      ai_rate: item.rate,
      ai_hamali_per_bag: item.hamaliPerBag,
    })),
  };

  // Submit data
  try {
     setIsSaving(true); // Disable Save
    const response = await postData("/avak", payload);
    console.log("Aavak Save Response:", response);

    if (response.success && response.am_id) {
      toast.success("Aavak created successfully");
      // navigate("/aavak");
      //  return response.id;
       setIsSaved(true);
       setSavedAvakId(response.am_id);
       navigate(`/aavak/${response.am_id}/print`);
    } else {
      if (
        response.status === 409 ||
        response.msg?.toLowerCase().includes("already exists")
      ) {
        toast.error("Aavak already exists (duplicate record)");
      } else {
        toast.error(response.msg || "Failed to create Aavak");
      }
    }
  } catch (error) {
    console.error("Create Aavak error:", error);
    toast.error("Unexpected error while creating Aavak");
  } finally {
    setIsSaving(false);
  }
};


// const handleSaveAndPrint = async () => {
//   const newId = await handleSave(); // Call the same function
//   if (newId) {
//     navigate(`/aavak/$${newId}/print`); // ✅ Redirect to print page
//   }
// };



  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };



  const updateItem = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        const quantity = parseFloat(updated.quantity) || 0;
        const rate = parseFloat(updated.rate) || 0;
        const hamaliPerBag = parseFloat(updated.hamaliPerBag) || 0;

        updated.hamaliAmount =
          updated.unit === "Bags" ? quantity * hamaliPerBag : hamaliPerBag;

        updated.totalAmount = quantity * rate + updated.hamaliAmount;

        return updated;
      })
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateTotalHamali = () => {
    return items.reduce((sum, item) => sum + item.hamaliAmount, 0);
  };

  // const calculateGrandTotal = () => {
  //   return calculateSubtotal() + calculateTotalHamali();
  // };
  const calculateExpenseTotal = () => {
    return vehicleRent + advance + others + calculateTotalHamali();
  };
  const calculateNetAmount = () => {
    return calculateSubtotal() - calculateExpenseTotal();
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };



  // const handlePrint = () => {
 
  //   console.log("savedAvakId:", savedAvakId);

  //   if(!savedAvakId) {
  //     toast.error("No saved Avak to print");
  //     return;
  //   }
  //   navigate(`/aavak/${savedAvakId}/print`); // 
  // };

  /**
   * Clears the value if it's "0" or "0.00" on focus.
   * @param {React.FocusEvent} e
   */
  const handleFocus = (e) => {
    if (e.target.value === "0" || e.target.value === "0.00") {
      e.target.value = "";
    }
  };

  const handleBlur = (e, setter) => {
    const value = e.target.value.trim();

    // If empty, set to 0
    if (value === "") {
      setter(0);
      e.target.value = "0";
      return;
    }

    let parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) parsed = 0;
    if (parsed > 99999) parsed = 99999;

    setter(parsed);
    e.target.value = parsed.toString(); // Ensure value updates on blur
  };

  const handleClearForm = () => {
    setFarmerName("");
    setDate(new Date().toISOString().split("T")[0]);
    setVehicleRent(0);
    setAdvance(0);
    setOthers(0);
    setOthersLabel("");
    setItems([
      {
        id: "1",
        vegetable: "",
        quantity: 0,
        unit: "Kg",
        rate: 0,
        hamaliPerBag: 0,
        hamaliAmount: 0,
        totalAmount: 0,
      },
    ]);
  };

  return (
    <div className="space-y-2">
      <Toaster position="top-right" />
  
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/aavak")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Aavak List
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Create Aavak</h1>
          <p className="text-muted-foreground">Create a new aavak record</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="farmerName">Farmer Name *</Label>
                

                 <Input
                    id="farmerName"
                    value={farmerName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFarmerName(name);

                      // Try to find the farmer object from the name
                      const matchedFarmer = farmers.find(f => f.mf_name === name);
                      if (matchedFarmer) {
                        setFarmerId(matchedFarmer.mf_id); // ✅ store the ID
                      } else {
                        setFarmerId(null); // reset if not matched
                      }
                    }}
                    placeholder="Type to search farmers..."
                    list="farmers"
                  />
                  <datalist id="farmers">
                    {farmers.map((farmer) => (
                      <option key={farmer.mf_id} value={farmer.mf_name} />
                    ))}
                  </datalist>

                </div>
                <div>
                <Label htmlFor="billNumber">Bill Number</Label>
                <Input
                  id="billNumber"
                  value={billNumber}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vegetable Items */}

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
                      <TableHead>Vegetable</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Hamali/Bag</TableHead>
                      <TableHead className="text-right">
                        Hamali Amount
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        {/* Vegetable with Add icon */}
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
                            className="w-[220px]"
                            value={item.vegetable}
                            onChange={(e) =>
                              updateItem(item.id, "vegetable", e.target.value)
                            }
                            placeholder="Type vegetable name..."
                            list="vegetables"
                          />
                          <datalist id="vegetables">
                            {vegetables.map((veg, index) => (
                              <option key={index} value={veg} />
                            ))}
                          </datalist>
                          </div>
                        </TableCell>

                        {/* Quantity */}
                        <TableCell>
                          <Input
                            type="number"
                            className="w-[80px]"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                clampToNonNegative(e.target.value)
                              )
                            }
                            onFocus={(e) => {
                              if (parseFloat(e.target.value) === 0)
                                e.target.value = "";
                            }}
                            onBlur={(e) => {
                              const val = clampToNonNegative(e.target.value);
                              updateItem(item.id, "quantity", val);
                              e.target.value = val.toString(); // ensures input shows `0` on blur if empty
                            }}
                            placeholder="0"
                          />
                        </TableCell>

                        {/* Unit */}
                        <TableCell>
                          <Select
                            value={item.unit}
                            onValueChange={(value) =>
                              updateItem(item.id, "unit", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kg">Kg</SelectItem>
                              <SelectItem value="Nos">Nos</SelectItem>
                              <SelectItem value="Bags">Bags</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Rate */}
                        <TableCell>
                          <Input
                            type="number"
                            className="w-[90px]"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "rate",
                                clampToNonNegative(e.target.value)
                              )
                            }
                            onFocus={(e) => {
                              if (parseFloat(e.target.value) === 0)
                                e.target.value = "";
                            }}
                            onBlur={(e) => {
                              const val = clampToNonNegative(e.target.value);
                              updateItem(item.id, "rate", val);
                              e.target.value = val.toString(); // Refill with 0 if left empty
                            }}
                            placeholder="0"
                          />
                        </TableCell>

                        {/* Hamali per bag */}
                        <TableCell>
                          <Input
                            type="number"
                            className="w-[80px]"
                            value={item.hamaliPerBag}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "hamaliPerBag",
                                clampToNonNegative(e.target.value)
                              )
                            }
                            onFocus={(e) => {
                              if (parseFloat(e.target.value) === 0)
                                e.target.value = "";
                            }}
                            onBlur={(e) => {
                              const val = clampToNonNegative(e.target.value);
                              updateItem(item.id, "hamaliPerBag", val);
                              e.target.value = val.toString(); // Refill with 0 if left empty
                            }}
                            placeholder="0"
                          />
                        </TableCell>

                        {/* Hamali Amount */}
                        <TableCell className="text-right w-[135px]">
                          {formatCurrency(item.hamaliAmount)}
                        </TableCell>

                        {/* Total Amount */}
                        <TableCell className="text-right w-[140px]">
                          {formatCurrency(item.totalAmount)}
                        </TableCell>

                        {/* Delete */}
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            title="Delete Item"
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

        {/* Summary Card */}
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Additional Charges</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                {/* Vehicle Rent */}
                <div className="flex flex-col w-full sm:w-28">
                  <Label htmlFor="vehicleRent">Vehicle Rent</Label>
                  <Input
                    id="vehicleRent"
                    type="number"
                    value={vehicleRent}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setVehicleRent(val < 0 ? 0 : Math.min(val, 99999));
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setVehicleRent)}
                    placeholder="0"
                  />
                </div>

                {/* Advance */}
                <div className="flex flex-col w-full sm:w-28">
                  <Label htmlFor="advance">Advance</Label>
                  <Input
                    id="advance"
                    type="number"
                    value={advance}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setAdvance(val < 0 ? 0 : Math.min(val, 99999));
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setAdvance)}
                    placeholder="0"
                  />
                </div>

                {/* Others */}
                <div
                  className="flex1 min-w-[200px]"
                  style={{ marginTop: "-8px" }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="others" className="flex items-center gap-2">
                      <span>Others</span>
                      <span
                        ref={othersLabelRef}
                        contentEditable
                        suppressContentEditableWarning
                        onClick={() => {
                          setIsEditingOthersLabel(true);
                          setOthersLabel("");
                          setTimeout(() => {
                            if (othersLabelRef.current) {
                              othersLabelRef.current.innerText = "";
                              othersLabelRef.current.focus();
                            }
                          }, 0);
                        }}
                        onBlur={(e) => {
                          const text =
                            e.currentTarget.textContent?.trim() ?? "";
                          setOthersLabel(text);
                          setIsEditingOthersLabel(false);
                        }}
                        className={`inline-block min-w-[100px] px-1 text-sm outline-none border-b transition-colors ${
                          isEditingOthersLabel
                            ? "border-primary text-primary"
                            : "border-dashed border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        {othersLabel || "Add Label"}
                      </span>
                    </Label>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        title="Edit Label"
                        onClick={() => {
                          setIsEditingOthersLabel(true);
                          setOthersLabel("");
                          setTimeout(() => {
                            if (othersLabelRef.current) {
                              othersLabelRef.current.innerText = "";
                              othersLabelRef.current.focus();
                            }
                          }, 0);
                        }}
                      >
                        <Pencil className="h-4 w-2" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        title="Clear Label"
                        onClick={() => {
                          setOthersLabel("");
                          if (othersLabelRef.current) {
                            othersLabelRef.current.innerText = "";
                          }
                        }}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <Input
                    id="others"
                    type="number"
                    value={others}
                    onChange={(e) => setOthers(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (Items):</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Vehicle Rent:</span>
                <span>-{formatCurrency(vehicleRent)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Advance:</span>
                <span>-{formatCurrency(advance)}</span>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {othersLabel ? `Others (${othersLabel})` : "Others"}:
                </span>
                <span>-{formatCurrency(others)}</span>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total Hamali:</span>
                <span>-{formatCurrency(calculateTotalHamali())}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Expense Total:</span>
                <span>-{formatCurrency(calculateExpenseTotal())}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Net Amount:</span>
                <span className="text-green-600">
                  {formatCurrency(calculateNetAmount())}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Print Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Print Size</Label>
                <Select
                  value={printSize}
                  onValueChange={(value) => setPrintSize(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm Receipt</SelectItem>
                    <SelectItem value="A5">A5 Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="sticky bottom-0 z-10 bg-white shadow-md border-t">
            <CardFooter className="flex justify-center py-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleClearForm}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear
                </Button>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                 onClick={handleSave}
                  disabled={isSaving || isSaved}
                >
                 
                  {/* <Save className="h-4 w-4 mr-2"  />
                  Save Aavak */}
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Aavak"}
                </Button>

                {/* <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={handlePrint}
                  disabled={!isSaved}
                 
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Save & Print
                </Button> */}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AavakCreate;
