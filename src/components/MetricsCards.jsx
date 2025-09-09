
import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MetricsCards = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$54,239',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: '8,426',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '-2.4%',
      trend: 'down',
      icon: ShoppingCart,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.4%',
      change: '+5.1%',
      trend: 'up',
      icon: Activity,
      gradient: 'from-orange-500 to-red-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`bg-gradient-to-r ${metric.gradient} rounded-lg p-2`}>
              <metric.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="flex items-center mt-2">
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
