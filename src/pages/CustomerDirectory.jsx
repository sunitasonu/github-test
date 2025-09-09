
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Building, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CustomerDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const customers = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      type: 'business',
      taxId: 'TAX123456',
      paymentTerms: 'Net 30',
      status: 'active',
      totalInvoices: 15,
      totalAmount: 45000
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 987-6543',
      type: 'individual',
      taxId: '',
      paymentTerms: 'Net 15',
      status: 'active',
      totalInvoices: 5,
      totalAmount: 12500
    },
    {
      id: 3,
      name: 'TechCorp LLC',
      email: 'billing@techcorp.com',
      phone: '+1 (555) 456-7890',
      type: 'business',
      taxId: 'TAX789012',
      paymentTerms: 'Due on Receipt',
      status: 'inactive',
      totalInvoices: 8,
      totalAmount: 28000
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Directory</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Link to="/customers/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {customer.type === 'business' ? 
                      <Building className="h-5 w-5 text-primary" /> : 
                      <User className="h-5 w-5 text-primary" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <div className="hidden md:block">
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {customer.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{customer.totalInvoices} invoices</p>
                    <p className="text-sm text-muted-foreground">${customer.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Link to={`/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDirectory;
