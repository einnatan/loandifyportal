'use client'

import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Input } from '../components/ui/input'

// Mock referral data
const mockReferralData = {
  referralCode: 'lauren123',
  pointsPerReferral: 1000,
  totalReferrals: 5,
  pendingReferrals: 2,
  completedReferrals: 3,
  earnedPoints: 3000,
  referrals: [
    { id: 1, name: 'John Lim', email: 'john.lim@example.com', status: 'completed', date: '2023-04-02', points: 1000 },
    { id: 2, name: 'Sarah Wong', email: 'sarah.w@example.com', status: 'completed', date: '2023-05-20', points: 1000 },
    { id: 3, name: 'Michael Tan', email: 'michael.t@example.com', status: 'completed', date: '2023-05-22', points: 1000 },
    { id: 4, name: 'Jenny Koh', email: 'jenny.k@example.com', status: 'pending', date: '2023-05-28', points: 0 },
    { id: 5, name: 'David Lee', email: 'david.l@example.com', status: 'pending', date: '2023-06-01', points: 0 }
  ]
}

export default function ReferPage() {
  const [emailInput, setEmailInput] = useState('')
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  
  const copyReferralLink = () => {
    const referralLink = `https://loandify.sg/ref/${mockReferralData.referralCode}`
    navigator.clipboard.writeText(referralLink)
    setShowCopiedMessage(true)
    setTimeout(() => setShowCopiedMessage(false), 2000)
  }
  
  const sendReferralEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to send the referral email
    alert(`Referral invitation sent to ${emailInput}`)
    setEmailInput('')
  }
  
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Refer & Earn</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Invite your friends to Loandify and earn rewards when they get a loan.
            You'll get {mockReferralData.pointsPerReferral} points for each successful referral.
          </p>
        </div>
        
        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Referrals</CardDescription>
              <CardTitle className="text-3xl">{mockReferralData.totalReferrals}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">People you've invited to Loandify</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Referrals</CardDescription>
              <CardTitle className="text-3xl">{mockReferralData.completedReferrals}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Friends who got loans through your referral</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Points Earned</CardDescription>
              <CardTitle className="text-3xl">{mockReferralData.earnedPoints}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Total points earned from referrals</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Referral Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Referral Link</CardTitle>
              <CardDescription>
                Copy your unique referral link and share it with friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Input
                  value={`https://loandify.sg/ref/${mockReferralData.referralCode}`}
                  readOnly
                  className="pr-20"
                />
                <Button 
                  size="sm" 
                  className="absolute right-1 top-1 h-8"
                  onClick={copyReferralLink}
                >
                  {showCopiedMessage ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <span className="mr-2">📱</span> WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <span className="mr-2">✉️</span> Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <span className="mr-2">📱</span> SMS
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Direct Referral */}
          <Card>
            <CardHeader>
              <CardTitle>Invite via Email</CardTitle>
              <CardDescription>
                Send a personalized invitation to your friend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendReferralEmail}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Friend's Name</label>
                      <Input placeholder="e.g. John Lim" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Friend's Email</label>
                      <Input 
                        type="email" 
                        placeholder="e.g. john@example.com" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Personal Message (Optional)</label>
                    <Input placeholder="Add a personal message" />
                  </div>
                  <Button type="submit" className="w-full">Send Invitation</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Referral History */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Referrals</h2>
          
          <Card>
            <CardContent className="px-0 py-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6 font-medium">Friend</th>
                      <th className="text-left py-4 px-6 font-medium">Email</th>
                      <th className="text-center py-4 px-6 font-medium">Status</th>
                      <th className="text-center py-4 px-6 font-medium">Points</th>
                      <th className="text-right py-4 px-6 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReferralData.referrals.map((referral) => (
                      <tr key={referral.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">{referral.name}</td>
                        <td className="py-4 px-6">{referral.email}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {referral.points > 0 ? (
                            <span className="text-green-600">+{referral.points}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right text-gray-500">{referral.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 