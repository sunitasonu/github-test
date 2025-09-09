import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteData, fetchData, postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";


const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // (useState < Customer) | (null > null);
  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    pan: "",
    streetAddress1: "",
    streetAddress2: "",
    mobile: "",
    email: "",
    previousBalance: 0,
  });

  const itemsPerPage = 5;

const formatCurrency = (amount) => {
  const value = Number(amount);
  if (isNaN(value)) return "₹0.00";

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


  const resetForm = () => {
    setFormData({
      name: "",
      gstin: "",
      pan: "",
      streetAddress1: "",
      streetAddress2: "",
      mobile: "",
      email: "",
      previousBalance: 0,
    });
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetchData("/customers", {
        params: {
          search: searchTerm,
          per_page: itemsPerPage,
          page: currentPage,
        },
      });

      if (response.success) {
        setCustomers(response.data); // list of customers
        setPagination(response.pagination); // pagination details
      } else {
        toast.error(response.msg || "Failed to load customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Something went wrong while fetching customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, currentPage]);




  const handleCreate = async () => {

  
      if (!formData.name.trim()) {
        toast.error("Customer name is required.");
        return;
      }

      if (!formData.streetAddress1.trim()) {
        toast.error("Street address is required.");
        return;
      }

      if (!formData.mobile.trim()) {
        toast.error("Mobile number is required.");
        return;
      }

      const mobilePattern = /^[0-9]{10}$/;
      if (!mobilePattern.test(formData.mobile.trim())) {
        toast.error("Mobile number must be exactly 10 digits.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email.trim() && !emailPattern.test(formData.email.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }


      const payload = {
        mcName: formData.name.trim(),
        mcGstin: formData.gstin.trim(),
        mcPanNo: formData.pan.trim(),
        mcStreetAddress1: formData.streetAddress1.trim(),
        mcStreetAddress2: formData.streetAddress2.trim(),
        mcCity: formData.city?.trim() || "",      // if you add city/state/zipcode fields
        mcState: formData.state?.trim() || "",
        mcZipcode: formData.zipcode?.trim() || "",
        mcPhone: formData.phone?.trim() || "",
        mcFaxNo: formData.fax?.trim() || "",
        mcMobileNo: formData.mobile.trim(),
        mcEmailId: formData.email.trim(),
        mcPreBal: formData.previousBalance || 0,
      };

      try {
        const response = await postData("/customers",payload);
        if (response.success) {
          toast.success(response.msg || "Customer created successfully");

          // Option A: reload list from backend
          setCurrentPage(1);
          fetchCustomers(); // assuming this is defined to fetch paginated customers

          // Option B: or append to existing list if you want immediate UI without refetch:
          // setCustomers(prev => [response.data, ...prev]);

          resetForm();
          setIsCreateOpen(false);
          fetchCustomers(); // if you want to go to detail page
        } else {
          if (response.status === 409 || response.msg?.toLowerCase().includes("already exists")) {
            toast.error("Customer already exists (duplicate).");
          } else {
            toast.error(response.msg || "Failed to create customer.");
          }
        }
      } catch (err) {
        console.error("Create customer error:", err);
        toast.error("Unexpected error while creating customer.");
      }
};



const fetchCustomerById = async (id) => {
  const response = await fetchData(`/customers/${id}`);
  if (response.success) {
    setFormData({
      id: id,
      name: response.data.mc_name,
      gstin: response.data.mc_gstin,
      pan: response.data.mc_pan_no,
      streetAddress1: response.data.mc_street_address1,
      streetAddress2: response.data.mc_street_address2,
      city: response.data.mc_city,
      state: response.data.mc_state,
      zipcode: response.data.mc_zipcode,
      phone: response.data.mc_phone,
      fax: response.data.mc_fax_no,
      mobile: response.data.mc_mobile_no,
      email: response.data.mc_email_id,
      balance: response.data.mc_pre_bal,
    });

    setIsEditing(true);
    setIsEditOpen(true);
    // setDialogOpen(true); // if using dialog
    // setSelectedId(id);
  } else {
    toast.error(response.msg || "Failed to fetch customer data.");
  }
};



 const handleUpdate = async () => {
  const payload = {
    mcName: formData.name,
    mcGstin: formData.gstin,
    mcPanNo: formData.pan,
    mcStreetAddress1: formData.streetAddress1,
    mcStreetAddress2: formData.streetAddress2,
    mcCity: formData.city,
    mcState: formData.state,
    mcZipcode: formData.zipcode,
    mcPhone: formData.phone,
    mcFaxNo: formData.fax,
    mcMobileNo: formData.mobile,
    mcEmailId: formData.email,
    mcPreBal: formData.balance,
  };

  const response = await updateData(`/customers/update/${formData.id}`, payload);

  if (response.success) {
    toast.success("Customer updated successfully!");
    setIsEditOpen(false); // Close dialog/modal
    resetForm();          // Clear form
    fetchCustomers();     // Refresh customer list
  } else {
    toast.error(response.msg || "Failed to update customer.");
  }
};



const handleDelete = async (id) => {
 
  try {
    console.log("Attempting to delete customer ID:", id);
    const response = await deleteData(`/customers/${id}`);
    if (response.success) {
      toast.success(response.msg || "Customer deleted successfully!");
      fetchCustomers(); // Reload the list after delete
    } else {
      toast.error(response.msg || "Failed to delete customer.");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Unexpected error occurred while deleting customer.");
  }
};




  return (
    <div className="space-y-6">
       <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Master</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter customer details to add them to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="customerName">Client Name *</Label>
                <Input
                  id="customerName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="customerGstin">GSTIN</Label>
                <Input
                  id="customerGstin"
                  value={formData.gstin}
                  onChange={(e) =>
                    setFormData({ ...formData, gstin: e.target.value })
                  }
                  placeholder="Enter GSTIN (optional)"
                />
              </div>
              <div>
                <Label htmlFor="customerPan">PAN No</Label>
                <Input
                  id="customerPan"
                  value={formData.pan}
                  onChange={(e) =>
                    setFormData({ ...formData, pan: e.target.value })
                  }
                  placeholder="Enter PAN number (optional)"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="streetAddress1">Street Address 1 *</Label>
                <Input
                  id="streetAddress1"
                  value={formData.streetAddress1}
                  onChange={(e) =>
                    setFormData({ ...formData, streetAddress1: e.target.value })
                  }
                  placeholder="Enter street address 1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="streetAddress2">Street Address 2</Label>
                <Input
                  id="streetAddress2"
                  value={formData.streetAddress2}
                  onChange={(e) =>
                    setFormData({ ...formData, streetAddress2: e.target.value })
                  }
                  placeholder="Enter street address 2 (optional)"
                />
              </div>
             <div>
              <Label htmlFor="customerMobile">Mobile Number *</Label>
              <Input
                id="customerMobile"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and max 10 digits
                  if (/^\d{0,10}$/.test(value)) {
                    setFormData({ ...formData, mobile: value });
                  }
                }}
                placeholder="Enter mobile number"
                maxLength={10}
              />
            </div>

              <div>
                <Label htmlFor="customerEmail">Email ID</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email (optional)"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="previousBalance">Previous Balance Amount</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.previousBalance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousBalance: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Sl No</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>PAN No</TableHead>
                {/* <TableHead>Address</TableHead> */}
                <TableHead>Mobile No</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead>Previous Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer,index) => (
                <TableRow key={customer.mc_id}>
                     <TableCell className="text-center">
                          {pagination.total -
                          ((pagination.current_page - 1) * itemsPerPage +
                          index)}
                        </TableCell>
                  <TableCell>{customer.mc_customer_id}</TableCell>
                  <TableCell className="font-medium">{customer.mc_name.charAt(0).toUpperCase() + customer.mc_name.slice(1)}</TableCell>
                  <TableCell>{customer.mc_gstin || "-"}</TableCell>
                  <TableCell>{customer.mc_pan_no || "-"}</TableCell>
                  {/* <TableCell className="max-w-xs"> */}
                  {/* <div className="space-y-1 text-sm">
                    <div>
                      {customer.mc_street_address1 &&
                        customer.mc_street_address1.charAt(0).toUpperCase() +
                          customer.mc_street_address1.slice(1)}
                    </div>
                    {customer.mc_street_address2 && (
                      <div>
                        {customer.mc_street_address2.charAt(0).toUpperCase() +
                          customer.mc_street_address2.slice(1)}
                      </div>
                    )}
                  </div> */}
                {/* </TableCell> */}

                  <TableCell>{customer.mc_mobile_no}</TableCell>
                  <TableCell>{customer.mc_email_id || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(customer.mc_pre_bal)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/customers/${customer.mc_id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                       onClick={() => fetchCustomerById(customer.mc_id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete customer "
                              {customer.mc_name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(customer.mc_id)}
                              className="bg-red-600 hover:bg-red-700"
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer details.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="editCustomerName">Client Name *</Label>
              <Input
                id="editCustomerName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label htmlFor="editCustomerGstin">GSTIN</Label>
              <Input
                id="editCustomerGstin"
                value={formData.gstin}
                onChange={(e) =>
                  setFormData({ ...formData, gstin: e.target.value })
                }
                placeholder="Enter GSTIN (optional)"
              />
            </div>
            <div>
              <Label htmlFor="editCustomerPan">PAN No</Label>
              <Input
                id="editCustomerPan"
                value={formData.pan}
                onChange={(e) =>
                  setFormData({ ...formData, pan: e.target.value })
                }
                placeholder="Enter PAN number (optional)"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="editStreetAddress1">Street Address 1 *</Label>
              <Input
                id="editStreetAddress1"
                value={formData.streetAddress1}
                onChange={(e) =>
                  setFormData({ ...formData, streetAddress1: e.target.value })
                }
                placeholder="Enter street address 1"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="editStreetAddress2">Street Address 2</Label>
              <Input
                id="editStreetAddress2"
                value={formData.streetAddress2}
                onChange={(e) =>
                  setFormData({ ...formData, streetAddress2: e.target.value })
                }
                placeholder="Enter street address 2 (optional)"
              />
            </div>
            <div>
              <Label htmlFor="editCustomerMobile">Mobile Number *</Label>
              <Input
                id="editCustomerMobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                placeholder="Enter mobile number"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="editCustomerEmail">Email ID</Label>
              <Input
                id="editCustomerEmail"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email (optional)"
                disabled
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="editPreviousBalance">
                Previous Balance Amount
              </Label>
              <Input
                id="editPreviousBalance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    balance: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline"  onClick={() => {
                resetForm();           // Clear the form fields
                setIsEditOpen(false);  // Close the modal/dialog
              }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerList;
