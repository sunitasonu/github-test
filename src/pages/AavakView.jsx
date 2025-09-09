
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Printer } from 'lucide-react';

const ViewAavak = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const aavakData = {
    id: id,
    billNumber: 'AAV0001',
    date: '2024-01-15',
    farmerName: 'Ramesh Kumar',
    items: [
      {
        id: '1',
        vegetable: 'Tomato',
        quantity: 100,
        unit: 'Kg',
        rate: 25,
        hamaliPerBag: 10,
        hamaliAmount: 50,
        totalAmount: 2550
      },
      {
        id: '2',
        vegetable: 'Onion',
        quantity: 50,
        unit: 'Bags',
        rate: 40,
        hamaliPerBag: 15,
        hamaliAmount: 750,
        totalAmount: 2750
      }
    ],
    vehicleRent: 2000,
    advance: 1000,
    discount: 300,
    subtotal: 4500,
    totalHamali: 800,
    grandTotal: 5300,
    netAmount: 2000,
    status: 'paid'
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/aavak')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Aavak List
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aavak Details</h1>
            <p className="text-muted-foreground">View aavak record #{aavakData.billNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/aavak/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/aavak/${id}/print`}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bill Number</label>
                  <p className="text-lg font-semibold">{aavakData.billNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-lg">{new Date(aavakData.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Farmer Name</label>
                  <p className="text-lg">{aavakData.farmerName}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-2">
                  <Badge className={getStatusColor(aavakData.status)}>
                    {aavakData.status.charAt(0).toUpperCase() + aavakData.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Vegetable Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aavakData.items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline">Item {index + 1}</Badge>
                      <div className="text-lg font-semibold">{formatCurrency(item.totalAmount)}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">Vegetable</label>
                        <p>{item.vegetable}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Quantity</label>
                        <p>{item.quantity}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Unit</label>
                        <p>{item.unit}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Rate</label>
                        <p>{formatCurrency(item.rate)}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Hamali/Bag</label>
                        <p>{formatCurrency(item.hamaliPerBag)}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Hamali Amount</label>
                        <p>{formatCurrency(item.hamaliAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle Rent:</span>
                <span>{formatCurrency(aavakData.vehicleRent)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Advance:</span>
                <span>{formatCurrency(aavakData.advance)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span>{formatCurrency(aavakData.discount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(aavakData.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Total Hamali:</span>
                <span>{formatCurrency(aavakData.totalHamali)}</span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Grand Total:</span>
                <span>{formatCurrency(aavakData.grandTotal)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Vehicle Rent:</span>
                <span>-{formatCurrency(aavakData.vehicleRent)}</span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Advance:</span>
                <span>-{formatCurrency(aavakData.advance)}</span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Discount:</span>
                <span>-{formatCurrency(aavakData.discount)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Net Amount:</span>
                <span className="text-green-600">{formatCurrency(aavakData.netAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewAavak;
