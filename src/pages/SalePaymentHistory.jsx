/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { fetchData } from "@/utils/api";

const formatCurrency = (amount) => {
  const value = Number(amount);
  if (isNaN(value)) return "₹0.00";

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const SalePaymentHistory = () => {
  const { id } = useParams();

  const [data, setData] = useState({
    customerName: "",
    payments: [],
    netAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredPayments = useMemo(() => {
    if (!data) return [];
    return data.payments.filter((p) => {
      const date = new Date(p.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      return (!from || date >= from) && (!to || date <= to);
    });
  }, [data, fromDate, toDate]);

  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const balance = data ? data.netAmount - totalPaid : 0;
  const [pageSize, setPageSize] = useState("A4");

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = `
        @media print {
          @page { size: ${pageSize} portrait; margin: 20mm; }
        }
      `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000); // clean up
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetchData(`/sales/payment-history/${id}`);
        console.log("Fetched Sale Payment Data:", res);
        setData(res);
      } catch (err) {
        console.error("Error fetching sale payment history:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading payment history...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-red-600">
          Error loading payment history.
        </h2>
      </div>
    );
  }

  if (!data || !data.payments || data.payments.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold">No payment history found.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:p-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sale Payment History</h1>
          <p className="text-muted-foreground">
            Customer: <span className="font-semibold">{data.customerName}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="border px-2 py-1 rounded-md text-sm 
             bg-white text-gray-900 
             dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            onChange={(e) => setPageSize(e.target.value)}
            value={pageSize}
          >
            <option value="A4">A4</option>
            <option value="A5">A5</option>
          </select>

          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div
        id="printable-section"
        className="border border-gray-400 p-4 rounded-md"
      >
        <Card className="print:border-none print:shadow-none">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <div className="mb-4 border border-gray-300 p-2 rounded">
              <h2 className="text-lg font-semibold">
                Customer Name: {data.customerName}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Sl No</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Invoice No</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                  <TableHead className="text-center">Transaction Type</TableHead>
                  <TableHead className="text-center">Pay Details</TableHead>
                  <TableHead className="text-center">Payment Type</TableHead>
                  <TableHead className="text-center">Sub Total</TableHead>
                  {/* <TableHead className="text-center">Cess </TableHead> */}
                  <TableHead className="text-center">Net Amount</TableHead>
                  <TableHead className="text-center">Receive Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.payments.map((p, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell className="text-center">
                      {new Date(p.date).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center">{p.invoiceNo || "NA"}</TableCell>
                    <TableCell className="text-center">{p.remarks || ""}</TableCell>
                    <TableCell className="text-center">{p.transactionType || "NA"}</TableCell>
                    <TableCell className="text-center">{p.payDetails || "NA"}</TableCell>
                    <TableCell className="text-center">{p.paymentType}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.subTotal || 0)}</TableCell>
                    {/* <TableCell className="text-right">{formatCurrency(p.taxTotal || 0)}</TableCell> */}
                    <TableCell className="text-right">{formatCurrency(p.netAmount || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.receiveAmount || 0)}</TableCell>
                  </TableRow>
                ))}

                {/* Summary rows */}
                <TableRow className="font-semibold bg-muted">
                  <TableCell colSpan={9}></TableCell>
                  <TableCell className="text-right">Total</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.totalNet || 0)}</TableCell>
                </TableRow>
                <TableRow className="font-semibold bg-muted">
                  <TableCell colSpan={9}></TableCell>
                  <TableCell className="text-right">Paid Amount</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.totalReceive || 0)}</TableCell>
                </TableRow>
                <TableRow className="font-semibold bg-muted">
                  <TableCell colSpan={9}></TableCell>
                  <TableCell className="text-right">Balance</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.balance || 0)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <style>
        {`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-section {
            width: 100%;
            border: 1px solid #000;
            padding: 16px;
            margin: 0 auto;
            border-radius: 8px;
            page-break-inside: avoid;
          }

          table, th, td {
            border: 1px solid #000 !important;
            border-collapse: collapse;
          }

          th, td {
            padding: 8px;
            text-align: center;
          }

          body * {
            visibility: hidden;
          }

          #printable-section, #printable-section * {
            visibility: visible;
          }

          #printable-section {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        `}
      </style>
    </div>
  );
};

export default SalePaymentHistory;
