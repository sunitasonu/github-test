
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const TaxRates = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [newTax, setNewTax] = useState({
    name: '',
    rate: '',
    type: 'inclusive',
    description: '',
    country: 'US'
  });
  const { toast } = useToast();

  const [taxRates, setTaxRates] = useState([
    {
      id: 1,
      name: 'Standard VAT',
      rate: 20.0,
      type: 'inclusive',
      description: 'Standard VAT rate for most goods and services',
      active: true,
      country: 'UK'
    },
    {
      id: 2,
      name: 'Reduced VAT',
      rate: 5.0,
      type: 'inclusive',
      description: 'Reduced VAT rate for specific items',
      active: true,
      country: 'UK'
    },
    {
      id: 3,
      name: 'Sales Tax',
      rate: 8.25,
      type: 'exclusive',
      description: 'State sales tax',
      active: true,
      country: 'US'
    },
    {
      id: 4,
      name: 'GST',
      rate: 18.0,
      type: 'inclusive',
      description: 'Goods and Services Tax',
      active: false,
      country: 'IN'
    }
  ]);

  const handleAddTax = () => {
    if (!newTax.name || !newTax.rate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const tax = {
      id: Math.max(...taxRates.map(t => t.id)) + 1,
      ...newTax,
      rate: parseFloat(newTax.rate),
      active: true
    };

    setTaxRates([...taxRates, tax]);
    setNewTax({
      name: '',
      rate: '',
      type: 'inclusive',
      description: '',
      country: 'US'
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Tax rate added successfully"
    });
  };

  const handleEditTax = (tax) => {
    setEditingTax(tax);
    setNewTax({
      name: tax.name,
      rate: tax.rate.toString(),
      type: tax.type,
      description: tax.description,
      country: tax.country
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTax = () => {
    if (!newTax.name || !newTax.rate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setTaxRates(taxRates.map(tax => 
      tax.id === editingTax.id 
        ? {
            ...tax,
            ...newTax,
            rate: parseFloat(newTax.rate)
          }
        : tax
    ));
    
    setIsEditDialogOpen(false);
    setEditingTax(null);
    setNewTax({
      name: '',
      rate: '',
      type: 'inclusive',
      description: '',
      country: 'US'
    });
    toast({
      title: "Success",
      description: "Tax rate updated successfully"
    });
  };

  const handleDeleteTax = (id) => {
    setTaxRates(taxRates.filter(tax => tax.id !== id));
    toast({
      title: "Success",
      description: "Tax rate deleted successfully"
    });
  };

  const toggleActiveStatus = (id) => {
    setTaxRates(taxRates.map(tax => 
      tax.id === id ? { ...tax, active: !tax.active } : tax
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Rates</h1>
          <p className="text-muted-foreground">Manage tax rates for your invoices</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tax Rate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="taxName">Tax Name *</Label>
                <Input 
                  id="taxName" 
                  value={newTax.name}
                  onChange={(e) => setNewTax({...newTax, name: e.target.value})}
                  placeholder="e.g., Standard VAT" 
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                <Input 
                  id="taxRate" 
                  type="number" 
                  step="0.01" 
                  value={newTax.rate}
                  onChange={(e) => setNewTax({...newTax, rate: e.target.value})}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label htmlFor="taxType">Tax Type</Label>
                <Select value={newTax.type} onValueChange={(value) => setNewTax({...newTax, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                    <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={newTax.description}
                  onChange={(e) => setNewTax({...newTax, description: e.target.value})}
                  placeholder="Brief description of this tax rate" 
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={newTax.country} onValueChange={(value) => setNewTax({...newTax, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddTax}>Save Tax Rate</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {taxRates.map((tax) => (
          <Card key={tax.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{tax.name}</h3>
                      <Badge variant={tax.active ? 'default' : 'secondary'}>
                        {tax.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{tax.country}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tax.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Rate: <span className="font-medium">{tax.rate}%</span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Type: <span className="font-medium">{tax.type}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleActiveStatus(tax.id)}>
                    {tax.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditTax(tax)}>
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
                        <AlertDialogTitle>Delete Tax Rate</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{tax.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTax(tax.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tax Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTaxName">Tax Name *</Label>
              <Input 
                id="editTaxName" 
                value={newTax.name}
                onChange={(e) => setNewTax({...newTax, name: e.target.value})}
                placeholder="e.g., Standard VAT" 
              />
            </div>
            <div>
              <Label htmlFor="editTaxRate">Tax Rate (%) *</Label>
              <Input 
                id="editTaxRate" 
                type="number" 
                step="0.01" 
                value={newTax.rate}
                onChange={(e) => setNewTax({...newTax, rate: e.target.value})}
                placeholder="0.00" 
              />
            </div>
            <div>
              <Label htmlFor="editTaxType">Tax Type</Label>
              <Select value={newTax.type} onValueChange={(value) => setNewTax({...newTax, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                  <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Input 
                id="editDescription" 
                value={newTax.description}
                onChange={(e) => setNewTax({...newTax, description: e.target.value})}
                placeholder="Brief description of this tax rate" 
              />
            </div>
            <div>
              <Label htmlFor="editCountry">Country</Label>
              <Select value={newTax.country} onValueChange={(value) => setNewTax({...newTax, country: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateTax}>Update Tax Rate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxRates;
