import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Wallet, Eye, Search, XCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchData, postData } from "@/utils/api";
import toast from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";

const AavakPayment = () => {
  const navigate = useNavigate();



const formatCurrency = (amount) => {
  const value = Number(amount);
  if (isNaN(value)) return "₹0.00";

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [amountToPay, setAmountToPay] = useState(0);
  const [transactionType, setTransactionType] = useState("paid");
  const [allPayments, setAllPayments] = useState([]);
  const [pagination, setPagination] = useState({
      current_page: 1,
      last_page: 1,
      total: 0,
    });

  const itemsPerPage = 5;


const fetchPayments = async () => {
  try {
    const response = await fetchData("/aavak/payments", {
      params: {
        search: searchTerm,
        page: currentPage,
        per_page: itemsPerPage,
      },
    });

    // console.log("Payments response:", response);

    if (response.success) {
      const formatted = response.data.map((item, index) => ({
        ...item,
        slno: (currentPage - 1) * itemsPerPage + index + 1,
        debitAmount: item.total_debit,
        creditAmount: item.total_credit,
        balance: item.total_debit - item.total_credit,
   
        farmerName: item.farmer_name,
      }));
      setPayments(formatted);
      setPagination(response.pagination);
    } else {
      toast.error(response.message || "Failed to load payments");
    }
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    toast.error("Error loading payments");
  }
};

useEffect(() => {
  fetchPayments();
}, [searchTerm, currentPage]);




const handlePaymentSubmit = async () => {
  if (!selectedPayment || amountToPay <= 0) return;

  try {
    const payload = {
      farmer_id: selectedPayment.farmerId,
      amount: amountToPay,
      type: transactionType, // "paid" or "received"
    
    };

    const res = await postData("/avak/payment/submit",payload);

    if (res.success) {
      toast.success(res.data || "Payment successful");

      // Optionally refresh data
      fetchPayments(); // <- reload updated list
      setIsPayDialogOpen(false);
    } else {
      toast.error("Payment failed");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Server error");
  }
};




const handlePayOrReceive = (row, type) => {
  setTransactionType(type); // "paid" or "received"
  setSelectedPayment({
    farmerId: row.farmerId || row.ap_farmer_id || row.mf_farmer_id,
    farmerName: row.farmerName || row.mf_name,
    netAmount: parseFloat(row.debitAmount) || 0,
    paidAmount: parseFloat(row.creditAmount) || 0,
  });
  setAmountToPay(0); // reset
  setIsPayDialogOpen(true);
};


  const handleViewHistory = (id) => {
    navigate(`/aavak/payment-history/${id}`);
  };

  return (
    <div className="space-y-6">
       <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Aavak Payments</h1>
          <p className="text-muted-foreground">
            Manage payments for inward bills
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by farmer name..."
                value={searchTerm}
                 onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page
                }}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                <XCircle className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Sl No</TableHead>
                  <TableHead>Farmer Name</TableHead>
                  <TableHead className="text-right">Debit Amount</TableHead>
                  <TableHead className="text-right">Credit Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.map((row) => {
                  // const balance = row.netAmount - row.paidAmount;
                  const isFullyPaid = row.balance <= 0;

                  // console.log("balance",row.balance)

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="text-center">{row.slno}</TableCell>
                      <TableCell>{row.farmerName}</TableCell>
                     <TableCell className="text-right">
                      {formatCurrency(row.debitAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(row.creditAmount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {row.balance === 0 ? (
                        <Badge variant="default">Settled</Badge>
                      ) : (
                        formatCurrency(row.balance)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isFullyPaid}
                                onClick={() => handlePayOrReceive(row, "paid")}
                              >
                                <Wallet className="h-4 w-4 text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Pay</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handlePayOrReceive(row, "received")
                                }
                              >
                                <Wallet className="h-4 w-4 text-blue-600 rotate-180" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Receive</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewHistory(row.ap_farmer_id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Pay History</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
                      <div className="mt-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                            {Array.from({ length: pagination.last_page }, (_, i) => (
                              <PaginationItem key={i + 1}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(i + 1)}
                                  // isActive={currentPage === i + 1}
                                  // className="cursor-pointer"
                                  className={`cursor-pointer ${
                                    currentPage === i + 1
                                      ? "bg-blue-500 text-white rounded"
                                      : ""
                                  }`}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  setCurrentPage(
                                    Math.min(pagination.last_page, currentPage + 1)
                                  )
                                }
                                className={
                                  currentPage === pagination.last_page
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
        </CardContent>
      </Card>

      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transactionType === "paid"
              ? "Pay Farmer"
              : "Receive from Farmer"}
          </DialogTitle>
          <DialogDescription>
            Make payment for:{" "}
            <span className="font-medium">{selectedPayment?.farmerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Farmer Name</Label>
            <Input value={selectedPayment?.farmerName || ""} readOnly />
          </div>
          <div>
            <Label>Net Amount</Label>
            <Input
            value={`₹${parseFloat(selectedPayment?.netAmount || 0).toFixed(2)}`}
            readOnly
          />
          </div>
          <div>
            <Label>Paid Amount</Label>
            <Input
              value={`₹${parseFloat(selectedPayment?.paidAmount || 0).toFixed(2)}`}
              readOnly
            />
          </div>
          <div>
            <Label>Balance</Label>
            {/* <Input
              value={`₹${(
                selectedPayment?.netAmount - selectedPayment?.paidAmount || 0
              ).toFixed(2)}`}
              readOnly
            /> */}
            <Input
              value={`₹${(
                parseFloat(selectedPayment?.netAmount || 0) -
                parseFloat(selectedPayment?.paidAmount || 0)
              ).toFixed(2)}`}
              readOnly
            />
            {/* <Input
                value={`₹${parseFloat(selectedPayment?.balance || 0).toFixed(2)}`}
                readOnly
            /> */}
          </div>
          <div>
            <Label>Amount to Pay *</Label>
            <Input
              type="number"
              required
              min={1}
              max={
                selectedPayment
                  ? selectedPayment.netAmount - selectedPayment.paidAmount
                  : 0
              }
              value={amountToPay}
              onChange={(e) =>
                setAmountToPay(parseFloat(e.target.value) || 0)
              }
              placeholder="Enter amount to pay"
              className={amountToPay <= 0 ? "border-red-500" : ""}
            />
            {amountToPay <= 0 && (
              <p className="text-sm text-red-600 mt-1">Amount is required</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePaymentSubmit}
            disabled={amountToPay <= 0}
          >
            Submit Payment
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>

    </div>
  );
};

export default AavakPayment;
