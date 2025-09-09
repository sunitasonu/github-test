
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Search, Edit, Printer, Trash2 } from "lucide-react";
import { fetchData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
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

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pagination, setPagination] = useState({});

  const fetchSales = async () => {
    try {
      const response = await fetchData("/sales", {
        params: {
          search: searchTerm,
          per_page: itemsPerPage,
          page: currentPage,
        },
      });

    // console.log("Sales response:", response);

      if (response.success) {
        setSales(response.data);
         setPagination(response.pagination);
      } else {
        toast.error(response.message || "Failed to load sales records");
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Something went wrong while fetching sales data");
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage, searchTerm]);

  const handleDelete = (id) => {
    console.log("Delete sale:", id);
    // Implement delete logic here
  };

  const formatCurrency = (amount) => {
    const value = Number(amount);
    if (isNaN(value)) return "₹0.00";
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-3">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sale Management</h1>
          <p className="text-muted-foreground">
            Manage your sale records and transactions
          </p>
        </div>
        <Button asChild>
          <Link to="/sale/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Sale
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or invoice number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Sl No</TableHead>
                  <TableHead className="text-center">Invoice No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  {/* <TableHead className="text-right">CESS</TableHead> */}
                  <TableHead className="text-right">Prev. Balance</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Total Balance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.sale.sm_id}>
                    <TableCell className="text-center">{sale.sale.sm_id}</TableCell>
                    <TableCell className="text-center">{sale.sale.sm_invoice_no}</TableCell>
                    <TableCell>{new Date(sale.sale.sm_date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>{sale.sale.sm_customer_name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.sale.sm_subtotal)}</TableCell>
                    {/* <TableCell className="text-right">{formatCurrency(sale.sale.sm_cess_amount)}</TableCell> */}
                    <TableCell className="text-right">{formatCurrency(sale.sale.sm_previous_balance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.sale.sm_paid_amount)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(sale.sale.sm_total_balance)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/sales/${sale.sale.sm_id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Sale</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/sales/${sale.sale.sm_id}/print`}>
                                <Printer className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Print Sale</TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete Sale</TooltipContent>
                          </Tooltip>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the sale invoice {sale.sm_invoice_no}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sale.sale.sm_id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination.last_page > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {[...Array(pagination.last_page)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < pagination.last_page)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === pagination.last_page
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleList;
