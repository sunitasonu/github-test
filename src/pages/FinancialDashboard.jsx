
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FinancialDashboard = () => {
  const kpis = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      period: 'This month'
    },
    {
      title: 'Outstanding Invoices',
      value: '$32,400',
      change: '-8.2%',
      trend: 'down',
      icon: FileText,
      period: 'Current'
    },
    {
      title: 'Paid Invoices',
      value: '45',
      change: '+15.3%',
      trend: 'up',
      icon: CreditCard,
      period: 'This month'
    },
    {
      title: 'Active Customers',
      value: '128',
      change: '+5.7%',
      trend: 'up',
      icon: Users,
      period: 'Total'
    }
  ];

  const recentPayments = [
    {
      id: 1,
      customer: 'Acme Corp',
      invoice: 'INV-001',
      amount: 1500.00,
      date: '2024-01-15',
      method: 'Bank Transfer'
    },
    {
      id: 2,
      customer: 'TechCorp LLC',
      invoice: 'INV-002',
      amount: 750.00,
      date: '2024-01-14',
      method: 'Credit Card'
    },
    {
      id: 3,
      customer: 'Design Studio',
      invoice: 'INV-003',
      amount: 2200.00,
      date: '2024-01-13',
      method: 'PayPal'
    }
  ];

  const overdueInvoices = [
    {
      id: 1,
      customer: 'Late Payer Inc',
      invoice: 'INV-098',
      amount: 3400.00,
      dueDate: '2024-01-01',
      daysOverdue: 14
    },
    {
      id: 2,
      customer: 'Slow Corp',
      invoice: 'INV-095',
      amount: 1200.00,
      dueDate: '2024-01-05',
      daysOverdue: 10
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className={`flex items-center ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {kpi.change}
                </div>
                <span>{kpi.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.invoice} • {payment.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invoice.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.invoice} • Due: {invoice.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                    <Badge variant="destructive" className="text-xs">
                      {invoice.daysOverdue} days overdue
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$45,200</div>
              <p className="text-sm text-muted-foreground">This Month's Sales</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$38,500</div>
              <p className="text-sm text-muted-foreground">Last Month's Sales</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">17.4%</div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Product/Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Website Development</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">15 sales</span>
                <span className="font-medium">$22,500</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Logo Design</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">8 sales</span>
                <span className="font-medium">$2,000</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>SEO Optimization</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">12 sales</span>
                <span className="font-medium">$6,000</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
