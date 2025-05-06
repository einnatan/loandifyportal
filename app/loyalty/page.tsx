'use client'

import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { Progress } from '../components/ui/progress'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Award, Gift, Star } from 'lucide-react'

// Mock loyalty data
const mockLoyaltyData = {
  points: 2350,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 650,
  history: [
    { id: 1, activity: 'Loan Application', points: 500, date: '2023-03-15' },
    { id: 2, activity: 'Successful Referral: John Lim', points: 1000, date: '2023-04-02' },
    { id: 3, activity: 'Feedback Submission', points: 150, date: '2023-04-28' },
    { id: 4, activity: 'Monthly Repayment Bonus', points: 200, date: '2023-05-10' },
    { id: 5, activity: 'Successful Referral: Sarah Wong', points: 500, date: '2023-05-20' }
  ],
  rewards: [
    { id: 101, name: 'FoodPanda Voucher', points: 1000, image: '🛵', description: '$10 FoodPanda voucher' },
    { id: 102, name: 'Cashback Rebate', points: 2500, image: '💵', description: '$25 cashback on your next loan installment' },
    { id: 103, name: 'Processing Fee Waiver', points: 3000, image: '🎫', description: 'Processing fee waived on your next loan' },
    { id: 104, name: 'Grab Voucher', points: 1500, image: '🚕', description: '$15 Grab voucher' },
    { id: 105, name: 'Interest Rate Discount', points: 5000, image: '📉', description: '0.5% interest rate discount on next loan' }
  ]
}

export default function LoyaltyPage() {
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)
  const [redeemSuccess, setRedeemSuccess] = useState(false)
  
  const handleRedeemClick = (reward: any) => {
    setSelectedReward(reward)
    setShowRedeemDialog(true)
    setRedeemSuccess(false)
  }
  
  const handleConfirmRedeem = () => {
    // In a real app, this would call an API to redeem the reward
    setRedeemSuccess(true)
    
    // After 2 seconds, close the dialog
    setTimeout(() => {
      setShowRedeemDialog(false)
      setRedeemSuccess(false)
    }, 2000)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with gradient background */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Background pattern/texture */}
        <div className="absolute inset-0 hero-bg-gradient opacity-80 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 decorative-blob-1"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 decorative-blob-2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl font-bold mb-2 leading-tight font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-gradient text-gradient-primary">Loyalty Program</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Earn points with every loan, referral, and interaction. Redeem them for exclusive rewards and benefits.
            </motion.p>
          </div>
          
          {/* Points Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
              <CardContent className="pt-6">
                <div className="md:flex items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <div className="text-4xl font-bold text-gradient text-gradient-primary">{mockLoyaltyData.points}</div>
                    <div className="text-gray-500">Available Points</div>
                  </div>
                  
                  <div className="flex-1 max-w-sm mx-auto md:mx-0 md:px-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{mockLoyaltyData.tier}</span>
                      <span>{mockLoyaltyData.nextTier}</span>
                    </div>
                    <Progress value={78} className="h-2.5 mb-1" />
                    <div className="text-xs text-gray-500 text-right">
                      {mockLoyaltyData.pointsToNextTier} points to next tier
                    </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0 text-center md:text-right">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-full mb-2">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-bold">{mockLoyaltyData.tier} Member</div>
                    <div className="text-sm text-gray-500">Member since Jan 2023</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Rewards */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Gift className="mr-2 h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Available Rewards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockLoyaltyData.rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    hover: { duration: 0.2 }
                  }}
                >
                  <Card className="overflow-hidden h-full shadow-lg border border-gray-100 relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                    <CardHeader className="pb-2">
                      <div className="text-3xl mb-2">{reward.image}</div>
                      <CardTitle>{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-primary">{reward.points} points</div>
                        <Button 
                          size="sm" 
                          disabled={mockLoyaltyData.points < reward.points}
                          onClick={() => handleRedeemClick(reward)}
                          className={mockLoyaltyData.points >= reward.points ? "bg-gradient-primary shadow-md" : ""}
                        >
                          Redeem
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Activity History */}
          <div>
            <div className="flex items-center mb-6">
              <Award className="mr-2 h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Points History</h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                <CardContent className="px-0 py-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-4 px-6 font-medium">Activity</th>
                          <th className="text-center py-4 px-6 font-medium">Points</th>
                          <th className="text-right py-4 px-6 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockLoyaltyData.history.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-6">{item.activity}</td>
                            <td className="py-4 px-6 text-center text-green-600">+{item.points}</td>
                            <td className="py-4 px-6 text-right text-gray-500">{item.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Redeem Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{redeemSuccess ? 'Success!' : 'Confirm Redemption'}</DialogTitle>
            {!redeemSuccess && <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>}
          </DialogHeader>
          
          {redeemSuccess ? (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Reward Redeemed!</h3>
              <p className="text-gray-500">
                Your {selectedReward?.name} has been added to your account.
              </p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{selectedReward?.image}</div>
                  <div>
                    <div className="font-bold text-lg">{selectedReward?.name}</div>
                    <div className="text-gray-500">{selectedReward?.description}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Reward Cost:</span>
                    <span className="font-bold">{selectedReward?.points} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Balance After:</span>
                    <span className="font-bold">{mockLoyaltyData.points - (selectedReward?.points || 0)} points</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmRedeem} className="bg-gradient-primary">
                  Confirm Redemption
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 