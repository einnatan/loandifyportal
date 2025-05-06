'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Slider } from './ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// Interface for loan option
interface LoanOption {
  id: string
  name: string
  loanAmount: number
  interestRate: number
  loanTerm: number
  downPayment: number
  processingFee: number
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
}

export function AdvancedLoanCalculator() {
  // Basic loan parameters
  const [loanAmount, setLoanAmount] = useState(10000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [loanTerm, setLoanTerm] = useState(24)
  const [downPayment, setDownPayment] = useState(0)
  const [processingFee, setProcessingFee] = useState(1)
  
  // Calculation results
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  
  // Comparison loans
  const [savedOptions, setSavedOptions] = useState<LoanOption[]>([])
  const [comparisonChartData, setComparisonChartData] = useState<any[]>([])
  
  // Calculate loan details
  useEffect(() => {
    calculateLoan()
  }, [loanAmount, interestRate, loanTerm, downPayment, processingFee])
  
  // Create chart data when saved options change
  useEffect(() => {
    if (savedOptions.length > 0) {
      const chartData = [
        {
          name: 'Monthly Payment',
          ...savedOptions.reduce((acc, option) => {
            acc[option.name] = option.monthlyPayment
            return acc
          }, {} as Record<string, number>)
        },
        {
          name: 'Total Interest',
          ...savedOptions.reduce((acc, option) => {
            acc[option.name] = option.totalInterest
            return acc
          }, {} as Record<string, number>)
        },
        {
          name: 'Total Payment',
          ...savedOptions.reduce((acc, option) => {
            acc[option.name] = option.totalPayment
            return acc
          }, {} as Record<string, number>)
        }
      ]
      
      setComparisonChartData(chartData)
    }
  }, [savedOptions])
  
  // Calculate loan details
  const calculateLoan = () => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const months = loanTerm
    
    // Calculate monthly payment (PMT formula)
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1)
    
    // Calculate total interest
    const totalInterestAmount = (payment * months) - principal
    
    // Calculate total payment including processing fee
    const processingFeeAmount = (principal * processingFee) / 100
    const totalPaymentAmount = principal + totalInterestAmount + processingFeeAmount
    
    setMonthlyPayment(payment)
    setTotalInterest(totalInterestAmount)
    setTotalPayment(totalPaymentAmount)
  }
  
  // Save current loan option for comparison
  const saveOption = () => {
    const newOption: LoanOption = {
      id: Date.now().toString(),
      name: `Option ${savedOptions.length + 1}`,
      loanAmount,
      interestRate,
      loanTerm,
      downPayment,
      processingFee,
      monthlyPayment,
      totalInterest,
      totalPayment
    }
    
    setSavedOptions([...savedOptions, newOption])
  }
  
  // Remove a saved option
  const removeOption = (id: string) => {
    setSavedOptions(savedOptions.filter(option => option.id !== id))
  }
  
  // Find best option based on criteria
  const getBestOption = (criteria: 'monthlyPayment' | 'totalInterest' | 'totalPayment') => {
    if (savedOptions.length === 0) return null
    
    return savedOptions.reduce((best, current) => 
      current[criteria] < best[criteria] ? current : best
    , savedOptions[0])
  }
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="amortization">Amortization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Loan Amount</Label>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <Slider
                  min={1000}
                  max={100000}
                  step={1000}
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Interest Rate (%)</Label>
                  <span className="font-medium">{interestRate.toFixed(2)}%</span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Loan Term (months)</Label>
                  <span className="font-medium">{loanTerm}</span>
                </div>
                <Slider
                  min={6}
                  max={60}
                  step={6}
                  value={[loanTerm]}
                  onValueChange={(value) => setLoanTerm(value[0])}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downPayment">Down Payment</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    value={processingFee}
                    step="0.1"
                    onChange={(e) => setProcessingFee(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Monthly Payment</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Total Interest</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Total Payment</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalPayment)}</div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoanAmount(10000)
                    setInterestRate(3.5)
                    setLoanTerm(24)
                    setDownPayment(0)
                    setProcessingFee(1)
                  }}
                >
                  Reset
                </Button>
                <Button onClick={saveOption}>
                  Save for Comparison
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          {savedOptions.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">No loan options saved for comparison yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Use the Calculator tab to configure and save loan options.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Saved Loan Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Option</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Term</TableHead>
                          <TableHead>Monthly</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedOptions.map((option) => (
                          <TableRow key={option.id}>
                            <TableCell className="font-medium">{option.name}</TableCell>
                            <TableCell>{formatCurrency(option.loanAmount)}</TableCell>
                            <TableCell>{option.interestRate.toFixed(2)}%</TableCell>
                            <TableCell>{option.loanTerm} mo</TableCell>
                            <TableCell>{formatCurrency(option.monthlyPayment)}</TableCell>
                            <TableCell>{formatCurrency(option.totalPayment)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(option.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Best Monthly Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getBestOption('monthlyPayment') && (
                      <>
                        <Badge className="mb-2">{getBestOption('monthlyPayment')?.name}</Badge>
                        <div className="text-2xl font-bold">
                          {formatCurrency(getBestOption('monthlyPayment')?.monthlyPayment || 0)}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Lowest Total Interest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getBestOption('totalInterest') && (
                      <>
                        <Badge className="mb-2">{getBestOption('totalInterest')?.name}</Badge>
                        <div className="text-2xl font-bold">
                          {formatCurrency(getBestOption('totalInterest')?.totalInterest || 0)}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Lowest Total Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getBestOption('totalPayment') && (
                      <>
                        <Badge className="mb-2">{getBestOption('totalPayment')?.name}</Badge>
                        <div className="text-2xl font-bold">
                          {formatCurrency(getBestOption('totalPayment')?.totalPayment || 0)}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {savedOptions.length >= 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          {savedOptions.map((option) => (
                            <Bar key={option.id} dataKey={option.name} fill="#0051CC" opacity={0.8} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="amortization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                This table shows the payment breakdown over the loan term.
              </p>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: Math.min(12, loanTerm) }).map((_, index) => {
                      const principal = loanAmount - downPayment;
                      const monthlyRate = interestRate / 100 / 12;
                      let balance = principal;
                      let totalInterest = 0;
                      
                      // Calculate the balance and interest for the current period
                      for (let i = 0; i <= index; i++) {
                        const interest = balance * monthlyRate;
                        const principalPaid = monthlyPayment - interest;
                        balance -= principalPaid;
                        if (i === index) {
                          totalInterest = interest;
                        }
                      }
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{formatCurrency(monthlyPayment)}</TableCell>
                          <TableCell>{formatCurrency(monthlyPayment - totalInterest)}</TableCell>
                          <TableCell>{formatCurrency(totalInterest)}</TableCell>
                          <TableCell>{formatCurrency(Math.max(0, balance))}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {loanTerm > 12 && (
                <p className="text-sm text-gray-500 mt-4">
                  Showing first 12 months of {loanTerm} months.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 