'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { UserProfile } from '../../lib/services/userProfileService'

interface FinancialInfoTabProps {
  profile: UserProfile
  onUpdate: (data: Partial<UserProfile>) => void
}

export function FinancialInfoTab({ profile, onUpdate }: FinancialInfoTabProps) {
  const [incomeData, setIncomeData] = useState({
    monthly: profile.income.monthly,
    annual: profile.income.annual,
    additionalIncome: profile.income.additionalIncome,
    source: profile.income.source
  })
  
  const [employmentData, setEmploymentData] = useState({
    employer: profile.employmentDetails.employer,
    jobTitle: profile.employmentDetails.jobTitle,
    employmentType: profile.employmentDetails.employmentType,
    yearsEmployed: profile.employmentDetails.yearsEmployed,
    industryCategory: profile.employmentDetails.industryCategory
  })
  
  const [financialProfileData, setFinancialProfileData] = useState({
    totalAssets: profile.financialProfile.totalAssets,
    totalLiabilities: profile.financialProfile.totalLiabilities,
    monthlyExpenses: profile.financialProfile.monthlyExpenses,
    existingLoanCommitments: profile.financialProfile.existingLoanCommitments
  })
  
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIncomeData(prev => ({ 
      ...prev, 
      [name]: name === 'source' ? value : Number(value) 
    }))
  }
  
  const handleEmploymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmploymentData(prev => ({ 
      ...prev, 
      [name]: name === 'yearsEmployed' ? Number(value) : value 
    }))
  }
  
  const handleFinancialProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFinancialProfileData(prev => ({ 
      ...prev, 
      [name]: Number(value) 
    }))
  }
  
  const handleSubmit = () => {
    const updatedProfile: Partial<UserProfile> = {
      income: incomeData,
      employmentDetails: employmentData,
      financialProfile: {
        ...profile.financialProfile, // Keep credit score
        ...financialProfileData
      }
    }
    
    onUpdate(updatedProfile)
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income Information</CardTitle>
            <CardDescription>Your income details help us find better loan offers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Income (S$)</Label>
              <Input
                id="monthly"
                name="monthly"
                type="number"
                value={incomeData.monthly}
                onChange={handleIncomeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annual">Annual Income (S$)</Label>
              <Input
                id="annual"
                name="annual"
                type="number"
                value={incomeData.annual}
                onChange={handleIncomeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalIncome">Additional Monthly Income (S$)</Label>
              <Input
                id="additionalIncome"
                name="additionalIncome"
                type="number"
                value={incomeData.additionalIncome}
                onChange={handleIncomeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Additional Income Source</Label>
              <Input
                id="source"
                name="source"
                value={incomeData.source}
                onChange={handleIncomeChange}
                placeholder="e.g., Freelancing, Investments, Rental"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Information about your current employment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employer">Employer Name</Label>
              <Input
                id="employer"
                name="employer"
                value={employmentData.employer}
                onChange={handleEmploymentChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={employmentData.jobTitle}
                onChange={handleEmploymentChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <select
                id="employmentType"
                name="employmentType"
                value={employmentData.employmentType}
                onChange={handleEmploymentChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearsEmployed">Years at Current Employer</Label>
              <Input
                id="yearsEmployed"
                name="yearsEmployed"
                type="number"
                value={employmentData.yearsEmployed}
                onChange={handleEmploymentChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industryCategory">Industry</Label>
              <Input
                id="industryCategory"
                name="industryCategory"
                value={employmentData.industryCategory}
                onChange={handleEmploymentChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Profile</CardTitle>
          <CardDescription>Additional financial information to help us assess your loan eligibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAssets">Total Assets (S$)</Label>
              <Input
                id="totalAssets"
                name="totalAssets"
                type="number"
                value={financialProfileData.totalAssets}
                onChange={handleFinancialProfileChange}
              />
              <p className="text-xs text-gray-500">Include savings, investments, property value, etc.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalLiabilities">Total Liabilities (S$)</Label>
              <Input
                id="totalLiabilities"
                name="totalLiabilities"
                type="number"
                value={financialProfileData.totalLiabilities}
                onChange={handleFinancialProfileChange}
              />
              <p className="text-xs text-gray-500">Include existing loans, mortgages, credit card debt, etc.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses">Monthly Expenses (S$)</Label>
              <Input
                id="monthlyExpenses"
                name="monthlyExpenses"
                type="number"
                value={financialProfileData.monthlyExpenses}
                onChange={handleFinancialProfileChange}
              />
              <p className="text-xs text-gray-500">Your average monthly expenses excluding loan repayments</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="existingLoanCommitments">Monthly Loan Commitments (S$)</Label>
              <Input
                id="existingLoanCommitments"
                name="existingLoanCommitments"
                type="number"
                value={financialProfileData.existingLoanCommitments}
                onChange={handleFinancialProfileChange}
              />
              <p className="text-xs text-gray-500">Total of all monthly loan repayments</p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Current Credit Score</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{profile.financialProfile.creditScore}</div>
                <div className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  profile.financialProfile.creditScore >= 750 ? 'bg-green-100 text-green-800' :
                  profile.financialProfile.creditScore >= 650 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {profile.financialProfile.creditScore >= 750 ? 'Excellent' :
                   profile.financialProfile.creditScore >= 650 ? 'Good' :
                   'Needs Improvement'}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Last updated on {profile.lastUpdated.split('T')[0]}</div>
            </div>
            
            <Button variant="outline">Check Credit Score</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>Save Financial Information</Button>
      </div>
    </div>
  )
} 