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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Printer, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { fetchData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";



const AavakList = () => {

  const [aavaks, setAavaks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});





  const fetchAavaks = async () => {
  try {
    const response = await fetchData("/avak", {
      params: {
        search: searchTerm,
        per_page: itemsPerPage,
        page: currentPage,
      },
    });

    if (response.success) {
      setAavaks(response.data.data); // Laravel pagination `data.data`
      setPagination({
        total: response.data.total,
        last_page: response.data.last_page,
      });
    } else {
      toast.error(response.message || "Failed to load Aavak records");
    }
  } catch (error) {
    console.error("Error fetching aavaks:", error);
    toast.error("Something went wrong while fetching Aavak data");
  }
};


useEffect(() => {
  fetchAavaks();
}, [currentPage, searchTerm]);


  const handleDelete = (id) => {
    console.log("Delete aavak:", id);
    // Implement delete functionality
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
          <h1 className="text-xl font-bold tracking-tight">Aavak Management</h1>
          <p className="text-muted-foreground">
            Manage your aavak records and transactions
          </p>
        </div>
        <Button asChild>
          <Link to="/aavak/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Aavak
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          {/* <CardTitle>Aavak Records</CardTitle> */}
          <div className="flex items-center space-x-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by farmer name or bill number..."
                value={searchTerm}
                onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page on search
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
                  <TableHead className="text-center"> Sl No</TableHead>
                  <TableHead className="text-center">Bill Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Farmer Name</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Vehicle Rent</TableHead>
                  <TableHead className="text-right">Advance</TableHead>
                  <TableHead className="text-right">Total Expence</TableHead>
                  <TableHead className="text-right">Net Amount</TableHead>
                  {/* <TableHead className="text-center">Status</TableHead> */}
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aavaks.map((aavak) => (
                  <TableRow key={aavak.am_id}>
                    <TableCell className="text-center">{aavak.am_id}</TableCell>
                    <TableCell className="font-medium text-center">
                      {aavak.am_bill_no}
                    </TableCell>
                    <TableCell>
                      {new Date(aavak.am_purchase_date).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>{aavak.am_farmer_name}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(aavak.am_subtotal_items	)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(aavak.am_vehicle_rent)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(aavak.am_advance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(aavak.am_total_expense)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(aavak.am_net_amount)}
                    </TableCell>
                    {/* <TableCell className="text-center">
                      <Badge className={getStatusColor(aavak.status)}>
                        {aavak.status.charAt(0).toUpperCase() +
                          aavak.status.slice(1)}
                      </Badge>
                    </TableCell> */}

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Edit */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/aavak/${aavak.am_id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Aavak</TooltipContent>
                        </Tooltip>

                        {/* Print */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/aavak/${aavak.am_id}/print`}>
                                <Printer className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Print Aavak</TooltipContent>
                        </Tooltip>

                        {/* Delete */}

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete Aavak</TooltipContent>
                          </Tooltip>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the aavak record for{" "}
                                {aavak.am_bill_no}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(aavak.am_id)}
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

          {/* {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.max(1, currentPage - 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
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
                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )} */}

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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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

export default AavakList;
