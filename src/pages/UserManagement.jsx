import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Edit, Trash2, Users, Shield, UserPlus } from "lucide-react";
// import { toast } from "sonner";
import { deleteData, fetchData, postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const AVAILABLE_PERMISSIONS = [
  "create_invoice",
  "edit_invoice",
  "delete_invoice",
  "view_invoice",
  "create_customer",
  "edit_customer",
  "delete_customer",
  "view_customer",
  "create_product",
  "edit_product",
  "delete_product",
  "view_product",
  "manage_tax",
  "manage_discounts",
  "view_reports",
  "manage_payments",
  "manage_users",
  "manage_roles",
  "system_settings",
  "view_dashboard",
];

const UserManagement = () => {

  const [roles, setRoles] = useState([
    // {
    //   id: "1",
    //   name: "Super Admin",
    //   description: "Full system access",
    //   permissions: AVAILABLE_PERMISSIONS,
    //   isSystem: true,
    // },
    {
      id: "1",
      name: "Admin",
      description: "Administrative access",
      permissions: [
        "create_invoice",
        "edit_invoice",
        "view_invoice",
        "create_customer",
        "edit_customer",
        "view_customer",
        "view_reports",
        "manage_payments",
      ],
      isSystem: false,
    },
    // {
    //   id: "3",
    //   name: "Accountant",
    //   description: "Financial management access",
    //   permissions: [
    //     "view_invoice",
    //     "view_customer",
    //     "manage_tax",
    //     "view_reports",
    //     "manage_payments",
    //   ],
    //   isSystem: false,
    // },
    // {
    //   id: "4",
    //   name: "Sales",
    //   description: "Sales operations access",
    //   permissions: [
    //     "create_invoice",
    //     "edit_invoice",
    //     "view_invoice",
    //     "create_customer",
    //     "edit_customer",
    //     "view_customer",
    //     "create_product",
    //     "view_product",
    //   ],
    //   isSystem: false,
    // },
    {
      id: "2",
      name: "User",
      description: "Limited client access",
      permissions: ["view_invoice"],
      isSystem: false,
    },
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
    password: "",
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });



    // ✅ Reusable API call function
  const fetchUsers = async () => {
    try {
      const res = await fetchData("/users");

      // console.log("resonsepe" , res);
      if (res.success) {
        setUsers(res.data);
      } else {
        console.error("Failed to load users:", res.message);
      }
    } catch (err) {
      console.error("API error while fetching users:", err);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, []);



  const handleToggleUserStatus = async (userId) => {
  try {
    const res = await updateData(`/users/${userId}/toggle-status`);
    if (res.success) {
      // Optionally show a toast or message
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: res.status } : user
        )
      );
    }
  } catch (error) {
    console.error("Error toggling user status:", error);
  }
};


// const handleCreateUser = async () => {
//   const formData = new FormData();

//   formData.append("fullName", newUser.name);
//   formData.append("emailId", newUser.email);
//   formData.append("password", newUser.password);
//   formData.append("position", newUser.role);
//   formData.append("status", newUser.status);

//   // Optional fields if you have
//   if (newUser.mobileNo) formData.append("mobileNo", newUser.mobileNo);
//   if (newUser.postalAddress) formData.append("postalAddress", newUser.postalAddress);
//   if (newUser.image) formData.append("image", newUser.image); // must be a File object

//   try {
//     const res = await postData("/signup", formData); // ← use your central api.js

//     console.log("response", res);
//     if (res.success) {
//       toast.success(res.result);
//       setNewUser({
//       name: "",
//       email: "",
//       role: "",
//       status: "",
//       password: "",
//       mobileNo: "",
//       postalAddress: "",
//       image: null,
//     });

//       setIsUserDialogOpen(false);
//       fetchUsers(); // Reload user list
//     } else {
//       toast.error(res.result);
//     }
//   } catch (error) {
//     console.error("Signup error:", error);
//     toast.error("Something went wrong.");
//   }
// };


const handleCreateUser = async () => {
  // Basic validations
  if (!newUser.name.trim()) {
    toast.error("Full name is required");
    return;
  }

  if (!newUser.email.trim()) {
    toast.error("Email is required");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newUser.email)) {
    toast.error("Invalid email format");
    return;
  }

  if (!editingUser && !newUser.password.trim()) {
    toast.error("Password is required");
    return;
  }

  if (!newUser.role) {
    toast.error("Role is required");
    return;
  }

  if (!newUser.status) {
    toast.error("Status is required");
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append("fullName", newUser.name);
  formData.append("emailId", newUser.email);
  formData.append("password", newUser.password);
  formData.append("position", newUser.role);
  formData.append("status", newUser.status);

  if (newUser.mobileNo) formData.append("mobileNo", newUser.mobileNo);
  if (newUser.postalAddress) formData.append("postalAddress", newUser.postalAddress);
  if (newUser.image) formData.append("image", newUser.image);

  try {
    const res = await postData("/signup", formData);
    console.log("res", res);

    if (res.success) {
      toast.success(res.result || "User created successfully");
      setNewUser({
        name: "",
        email: "",
        role: "",
        status: "",
        password: "",
        mobileNo: "",
        postalAddress: "",
        image: null,
      });

      setIsUserDialogOpen(false);
      fetchUsers();
    } else {
      toast.error(res.result || "User allready exist with same eamil id");
    }
  } catch (error) {
    console.error("Signup error:", error);
    const errMsg =
      error?.res?.result ||
      error?.res?.result ||
      "Something went wrong.";
    toast.error(errMsg);
  }
};



  // const handleEditUser = (user) => {
  //   setEditingUser(user);
  //   setNewUser({
  //     name: user.name,
  //     email: user.email,
  //     role: user.role,
  //     status: user.status,
  //     password: "",
  //   });
  //   setIsUserDialogOpen(true);
  // };

const handleEditUser = async (user) => {
  try {
    const res = await fetchData(`/user/${user.id}`); // 👈 Using your fetchUserById logic directly here
    if (res.success) {
      const u = res.user;
      setEditingUser(u);
      setNewUser({
        name: u.full_name || u.name || "",
        email: u.email_id || u.email || "",
        role: u.role || "",
        status: u.status || "",
        password: "", // Don't populate password in edit
        mobileNo: u.mobile_no || "",
        postalAddress: u.postal_address || "",
        image: null, // Assuming image is not needed in edit
      });
      setIsUserDialogOpen(true);
      
    } else {
      toast.error(res.msg || "Failed to fetch user");
    }
    } catch (err) {
      toast.error(err?.msg || "Something went wrong");
    }
};




  // const handleUpdateUser = () => {
  //   if (!editingUser) return;

  //   if (!newUser.name || !newUser.email || !newUser.role) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   const updatedUsers = users.map((user) =>
  //     user.id === editingUser.id
  //       ? {
  //           ...user,
  //           name: newUser.name,
  //           email: newUser.email,
  //           role: newUser.role,
  //           status: newUser.status,
  //         }
  //       : user
  //   );

  //   setUsers(updatedUsers);
  //   setEditingUser(null);
  //   setNewUser({
  //     name: "",
  //     email: "",
  //     role: "",
  //     status: "active",
  //     password: "",
  //   });
  //   setIsUserDialogOpen(false);
  //   toast.success("User updated successfully");
  // };

const handleUpdateUser = async () => {

  if (!newUser.name.trim()) {
    toast.error("Full name is required");
    return;
  }

  if (!newUser.email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!newUser.role) {
    toast.error("Role is required");
    return;
  }

  if (!newUser.status) {
    toast.error("Status is required");
    return;
  }

  const formData = new FormData();
  formData.append("id", editingUser.id); // required
  formData.append("fullName", newUser.name);
  formData.append("emailId", newUser.email);
  formData.append("position", newUser.role);
  formData.append("status", newUser.status);

  if (newUser.mobileNo) formData.append("mobileNo", newUser.mobileNo);
  if (newUser.postalAddress) formData.append("address", newUser.postalAddress);
  if (newUser.image) formData.append("image", newUser.image); // Optional

  try {
    const res = await updateData("/user/update", formData); // 🔗 your Laravel API
    if (res.success) {
      toast.success(res.msg || "User updated successfully");

      // Reset UI state
      setNewUser({
        name: "",
        email: "",
        role: "",
        status: "",
        password: "",
        mobileNo: "",
        postalAddress: "",
        image: null,
      });
      setEditingUser(null);
      setIsUserDialogOpen(false);
      fetchUsers(); // ⏪ Refresh list
    } else {
      toast.error(res.msg || "Failed to update user");
    }
  } catch (error) {
    toast.error(error?.msg || "Something went wrong while updating");
  }
};


  // const handleDeleteUser = (userId) => {
  //   setUsers(users.filter((user) => user.id !== userId));
  //   toast.success("User deleted successfully");
  // };


const handleDeleteUser = async (userId) => {
  try {
    const res = await deleteData(`/delete-user/${userId}`);
    if (res.success) {
      toast.success(res.msg || "User deleted successfully");
      fetchUsers(); // 🔁 Refresh list
    } else {
      toast.error(res.msg || "Failed to delete user");
    }
  } catch (err) {
    toast.error(err?.msg || "Something went wrong");
  }
};




  // Role Management Functions
  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      isSystem: false,
    };

    setRoles([...roles, role]);
    setNewRole({ name: "", description: "", permissions: [] });
    setIsRoleDialogOpen(false);
    toast.success("Role created successfully");
  };

  const handleEditRole = (role) => {
    if (role.isSystem) {
      toast.error("System roles cannot be edited");
      return;
    }
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    if (!newRole.name || !newRole.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedRoles = roles.map((role) =>
      role.id === editingRole.id
        ? {
            ...role,
            name: newRole.name,
            description: newRole.description,
            permissions: newRole.permissions,
          }
        : role
    );

    setRoles(updatedRoles);
    setEditingRole(null);
    setNewRole({ name: "", description: "", permissions: [] });
    setIsRoleDialogOpen(false);
    toast.success("Role updated successfully");
  };

  const handleDeleteRole = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (role?.isSystem) {
      toast.error("System roles cannot be deleted");
      return;
    }

    // Check if any users have this role
    const usersWithRole = users.filter((user) => user.role === role?.name);
    if (usersWithRole.length > 0) {
      toast.error(
        `Cannot delete role. ${usersWithRole.length} user(s) currently have this role.`
      );
      return;
    }

    setRoles(roles.filter((role) => role.id !== roleId));
    toast.success("Role deleted successfully");
  };

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permission],
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter((p) => p !== permission),
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
       <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        {/* <TabsList> */}
          {/* <TabsTrigger value="users">Users</TabsTrigger> */}
          {/* <TabsTrigger value="roles">Roles & Permissions</TabsTrigger> */}
        {/* </TabsList> */}

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Users
                  </CardTitle>
                  <CardDescription>
                    Manage system users and their access
                  </CardDescription>
                </div>
                <Dialog
                  open={isUserDialogOpen}
                  onOpenChange={setIsUserDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? "Edit User" : "Create New User"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingUser
                          ? "Update user information"
                          : "Add a new user to the system"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newUser.status}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Deactivate</SelectItem>
                            {/* <SelectItem value="suspended">Suspended</SelectItem> */}
                          </SelectContent>
                        </Select>
                      </div>
                      {!editingUser && (
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                            placeholder="Enter password"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsUserDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          editingUser ? handleUpdateUser : handleCreateUser
                        }
                      >
                        {editingUser ? "Update User" : "Create User"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.updated_at?.slice(0, 10)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Roles & Permissions
                  </CardTitle>
                  <CardDescription>
                    Manage user roles and their permissions
                  </CardDescription>
                </div>
                <Dialog
                  open={isRoleDialogOpen}
                  onOpenChange={setIsRoleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingRole(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingRole ? "Edit Role" : "Create New Role"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingRole
                          ? "Update role information and permissions"
                          : "Create a new role with specific permissions"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                          placeholder="Enter role name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Input
                          id="roleDescription"
                          value={newRole.description}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter role description"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                          {AVAILABLE_PERMISSIONS.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={permission}
                                checked={newRole.permissions.includes(
                                  permission
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(permission, checked)
                                }
                              />
                              <Label htmlFor={permission} className="text-sm">
                                {permission
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsRoleDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          editingRole ? handleUpdateRole : handleCreateRole
                        }
                      >
                        {editingRole ? "Update Role" : "Create Role"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {role.name}
                            {role.isSystem && (
                              <Badge variant="secondary">System</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            disabled={role.isSystem}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={role.isSystem}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this role?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Permissions:</h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="text-xs"
                            >
                              {permission
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;

// ... (Keep the rest of the code unchanged, only TS types removed)
