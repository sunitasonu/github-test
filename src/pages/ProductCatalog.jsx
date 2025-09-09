
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, Wrench, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: 'product',
    price: '',
    taxRate: '',
    description: '',
    category: ''
  });
  const { toast } = useToast();

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Website Development',
      type: 'service',
      price: 1500.00,
      taxRate: 10,
      description: 'Custom website development services',
      active: true,
      category: 'Development'
    },
    {
      id: 2,
      name: 'Logo Design',
      type: 'service',
      price: 250.00,
      taxRate: 10,
      description: 'Professional logo design',
      active: true,
      category: 'Design'
    },
    {
      id: 3,
      name: 'Premium Software License',
      type: 'product',
      price: 99.00,
      taxRate: 18,
      description: 'Annual software license',
      active: false,
      category: 'Software'
    },
    {
      id: 4,
      name: 'SEO Optimization',
      type: 'service',
      price: 500.00,
      taxRate: 10,
      description: 'Search engine optimization services',
      active: true,
      category: 'Marketing'
    }
  ]);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      taxRate: parseInt(newProduct.taxRate) || 0,
      active: true
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      type: 'product',
      price: '',
      taxRate: '',
      description: '',
      category: ''
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Product added successfully"
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      type: product.type,
      price: product.price.toString(),
      taxRate: product.taxRate.toString(),
      description: product.description,
      category: product.category
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setProducts(products.map(product => 
      product.id === editingProduct.id 
        ? {
            ...product,
            ...newProduct,
            price: parseFloat(newProduct.price),
            taxRate: parseInt(newProduct.taxRate) || 0
          }
        : product
    ));
    
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      type: 'product',
      price: '',
      taxRate: '',
      description: '',
      category: ''
    });
    toast({
      title: "Success",
      description: "Product updated successfully"
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  const toggleActiveStatus = (id) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, active: !product.active } : product
    ));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product & Service Catalog</h1>
          <p className="text-muted-foreground">Manage your products and services</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product/Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Product/Service name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newProduct.type} onValueChange={(value) => setNewProduct({...newProduct, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={newProduct.taxRate}
                  onChange={(e) => setNewProduct({...newProduct, taxRate: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  placeholder="Product category"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Product description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products and services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="service">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredProducts.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {item.type === 'product' ? 
                      <Package className="h-5 w-5 text-primary" /> : 
                      <Wrench className="h-5 w-5 text-primary" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant={item.type === 'product' ? 'default' : 'secondary'}>
                        {item.type}
                      </Badge>
                      <Badge variant={item.active ? 'default' : 'outline'}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Tax: {item.taxRate}%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActiveStatus(item.id)}
                    >
                      {item.active ? 
                        <ToggleRight className="h-4 w-4 text-green-600" /> : 
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditProduct(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(item.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product/Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Name *</Label>
              <Input
                id="editName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Product/Service name"
              />
            </div>
            <div>
              <Label htmlFor="editType">Type</Label>
              <Select value={newProduct.type} onValueChange={(value) => setNewProduct({...newProduct, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editPrice">Price *</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="editTaxRate">Tax Rate (%)</Label>
              <Input
                id="editTaxRate"
                type="number"
                value={newProduct.taxRate}
                onChange={(e) => setNewProduct({...newProduct, taxRate: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="editCategory">Category</Label>
              <Input
                id="editCategory"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                placeholder="Product category"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>Update Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCatalog;
