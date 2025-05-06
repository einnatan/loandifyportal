'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { getAnalyticsData, getKpiMetrics, calculateGrowth, getPredictedLoanPerformance } from '../../../lib/services/analyticsService'
import { Button } from '../../components/ui/button'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly')
  const analyticsData = getAnalyticsData()
  const kpiMetrics = getKpiMetrics()
  const predictedPerformance = getPredictedLoanPerformance()
  
  const combinedPerformanceData = [...analyticsData.loanPerformance, ...predictedPerformance]
  
  // Previous period metrics for growth calculation
  const previousMetrics = {
    totalLoansValue: 3250000,
    totalLoansCount: 178,
    averageLoanAmount: 16280,
    averageInterestRate: 3.85,
    conversionRate: 19.2,
    averageProcessingTime: 2.9
  }
  
  // Color palette for charts
  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Detailed metrics on loan performance and application trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeframe === 'weekly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('weekly')}
            size="sm"
          >
            Weekly
          </Button>
          <Button
            variant={timeframe === 'monthly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('monthly')}
            size="sm"
          >
            Monthly
          </Button>
          <Button
            variant={timeframe === 'quarterly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('quarterly')}
            size="sm"
          >
            Quarterly
          </Button>
        </div>
      </div>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Loan Value</CardDescription>
            <CardTitle className="text-3xl">
              ${(kpiMetrics.totalLoansValue / 1000000).toFixed(2)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-sm mr-2 ${calculateGrowth(kpiMetrics.totalLoansValue, previousMetrics.totalLoansValue) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth(kpiMetrics.totalLoansValue, previousMetrics.totalLoansValue) > 0 ? '↑' : '↓'}
                {Math.abs(calculateGrowth(kpiMetrics.totalLoansValue, previousMetrics.totalLoansValue))}%
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Loans</CardDescription>
            <CardTitle className="text-3xl">
              {kpiMetrics.totalLoansCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-sm mr-2 ${calculateGrowth(kpiMetrics.totalLoansCount, previousMetrics.totalLoansCount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth(kpiMetrics.totalLoansCount, previousMetrics.totalLoansCount) > 0 ? '↑' : '↓'}
                {Math.abs(calculateGrowth(kpiMetrics.totalLoansCount, previousMetrics.totalLoansCount))}%
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Loan Amount</CardDescription>
            <CardTitle className="text-3xl">
              ${kpiMetrics.averageLoanAmount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-sm mr-2 ${calculateGrowth(kpiMetrics.averageLoanAmount, previousMetrics.averageLoanAmount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth(kpiMetrics.averageLoanAmount, previousMetrics.averageLoanAmount) > 0 ? '↑' : '↓'}
                {Math.abs(calculateGrowth(kpiMetrics.averageLoanAmount, previousMetrics.averageLoanAmount))}%
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Interest Rate</CardDescription>
            <CardTitle className="text-3xl">
              {kpiMetrics.averageInterestRate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-sm mr-2 ${calculateGrowth(previousMetrics.averageInterestRate, kpiMetrics.averageInterestRate) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth(previousMetrics.averageInterestRate, kpiMetrics.averageInterestRate) > 0 ? '↓' : '↑'}
                {Math.abs(calculateGrowth(kpiMetrics.averageInterestRate, previousMetrics.averageInterestRate))}%
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl">
              {kpiMetrics.conversionRate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-sm mr-2 ${calculateGrowth(kpiMetrics.conversionRate, previousMetrics.conversionRate) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth(kpiMetrics.conversionRate, previousMetrics.conversionRate) > 0 ? '↑' : '↓'}
                {Math.abs(calculateGrowth(kpiMetrics.conversionRate, previousMetrics.conversionRate))}%
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Processing Time</CardDescription>
            <CardTitle className="text-3xl">
              {kpiMetrics.averageProcessingTime} days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-sm mr-2 ${calculateGrowth(previousMetrics.averageProcessingTime, kpiMetrics.averageProcessingTime) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth(previousMetrics.averageProcessingTime, kpiMetrics.averageProcessingTime) > 0 ? '↓' : '↑'}
                {Math.abs(calculateGrowth(kpiMetrics.averageProcessingTime, previousMetrics.averageProcessingTime))}%
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Loan Performance</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Performance Over Time</CardTitle>
              <CardDescription>Disbursements vs Repayments (Last 6 Months)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.loanPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  />
                  <Legend />
                  <Bar dataKey="disbursed" name="Disbursed" fill="#0ea5e9" />
                  <Bar dataKey="repaid" name="Repaid" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Current application status distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.applicationStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {analyticsData.applicationStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Applications']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Conversion rates across stages</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.conversionRates}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="stage" type="category" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                    <Bar dataKey="rate" fill="#8884d8">
                      {analyticsData.conversionRates.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Application Volume</CardTitle>
              <CardDescription>Application count for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.dailyApplications}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#0ea5e9" activeDot={{ r: 8 }} name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest application and loan activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{activity.action}</span>
                        <span className="text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Distribution by Lender</CardTitle>
              <CardDescription>Percentage of loan value by lender</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.lenderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="lender"
                  >
                    {analyticsData.lenderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.lender]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.lenderDistribution.map((lender, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardDescription>{lender.lender}</CardDescription>
                  <CardTitle className="text-2xl">
                    ${(lender.amount / 1000000).toFixed(2)}M
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">
                      {lender.percentage}% of total lending
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Performance Forecast</CardTitle>
              <CardDescription>Projected disbursements and repayments (Next 3 Months)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={combinedPerformanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
                  <Legend />
                  <Line type="monotone" dataKey="disbursed" stroke="#0ea5e9" name="Disbursed" />
                  <Line type="monotone" dataKey="repaid" stroke="#10b981" name="Repaid" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Predictive analytics insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Expected Growth</h3>
                  <p className="text-blue-600 mt-1">Loan disbursements are projected to grow by 18% in the next quarter based on current trends and seasonality.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800">Repayment Projections</h3>
                  <p className="text-green-600 mt-1">Based on historical data, repayment rates are expected to improve by 5% due to enhanced collection processes.</p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="font-medium text-amber-800">Market Opportunities</h3>
                  <p className="text-amber-600 mt-1">Data suggests potential for growth in the small business loan segment, with projected demand increasing by 22%.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 