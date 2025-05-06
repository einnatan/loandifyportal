'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog'

// Mock customer data for dropdown
const mockCustomers = [
  { id: 1, name: 'Lauren Tan', mobile: '+65 9123 4567', creditAmount: 25000 },
  { id: 2, name: 'John Lim', mobile: '+65 9876 5432', creditAmount: 18000 },
  { id: 3, name: 'Sarah Wong', mobile: '+65 8765 4321', creditAmount: 32000 },
  { id: 4, name: 'Michael Tan', mobile: '+65 9876 1234', creditAmount: 22000 },
  { id: 5, name: 'Jenny Koh', mobile: '+65 8123 4567', creditAmount: 15000 }
]

// Template types
const messageTemplates = {
  creditReminder: (name: string, amount: number) => 
    `Hi ${name}, Make the most of your credit balance. You're eligible for a second loan of $${amount.toLocaleString()}. Tap here to view details.`,
  
  birthday: (name: string) => 
    `🎉 Happy Birthday, ${name}! Enjoy a spa treat from us! Tap here to claim your reward.`,
    
  festive: (name: string, festival: string) => 
    `${getFestiveEmoji(festival)} Happy ${festival}, ${name}! We're celebrating with special loan rates and a gift for you. Tap to see your offer.`
}

// Helper function for festive emoji
function getFestiveEmoji(festival: string): string {
  switch (festival.toLowerCase()) {
    case 'chinese new year':
      return '🧧'
    case 'deepavali':
      return '🪔'
    case 'christmas':
      return '🎄'
    case 'hari raya':
      return '☪️'
    default:
      return '🎉'
  }
}

export default function MessageComposer() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [creditAmount, setCreditAmount] = useState<number>(0)
  const [messageType, setMessageType] = useState<'credit' | 'birthday' | 'festive'>('credit')
  const [festival, setFestival] = useState<string>('Chinese New Year')
  const [previewMessage, setPreviewMessage] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  
  const generateMessage = () => {
    if (!selectedCustomer) return
    
    let message = ''
    
    switch (messageType) {
      case 'credit':
        message = messageTemplates.creditReminder(selectedCustomer.name, creditAmount || selectedCustomer.creditAmount)
        break
      case 'birthday':
        message = messageTemplates.birthday(selectedCustomer.name)
        break
      case 'festive':
        message = messageTemplates.festive(selectedCustomer.name, festival)
        break
    }
    
    setPreviewMessage(message)
    setShowPreview(true)
  }
  
  const handleSelectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = parseInt(e.target.value)
    const customer = mockCustomers.find(c => c.id === customerId)
    setSelectedCustomer(customer)
    setCreditAmount(customer ? customer.creditAmount : 0)
  }
  
  const handleSendMessage = () => {
    // In a real app, this would call an API to send the WhatsApp message
    setMessageSent(true)
    
    // Reset after 2 seconds
    setTimeout(() => {
      setShowPreview(false)
      setMessageSent(false)
    }, 2000)
  }
  
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">WhatsApp Message Composer</h1>
          <p className="text-gray-600">
            Create and send personalized WhatsApp messages to customers
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>
              Select a customer and message type, then generate a preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="text-sm font-medium mb-1 block">Select Customer</label>
                <select 
                  className="w-full p-2 border rounded"
                  onChange={handleSelectCustomer}
                  defaultValue=""
                >
                  <option value="" disabled>Choose a customer</option>
                  {mockCustomers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.mobile}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Message Type Selection */}
              <div>
                <label className="text-sm font-medium mb-1 block">Message Type</label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-lg text-center cursor-pointer ${messageType === 'credit' ? 'border-primary bg-primary-50' : ''}`}
                    onClick={() => setMessageType('credit')}
                  >
                    <div className="text-2xl mb-1">💰</div>
                    <div className="font-medium">Credit Offer</div>
                  </div>
                  <div 
                    className={`p-4 border rounded-lg text-center cursor-pointer ${messageType === 'birthday' ? 'border-primary bg-primary-50' : ''}`}
                    onClick={() => setMessageType('birthday')}
                  >
                    <div className="text-2xl mb-1">🎂</div>
                    <div className="font-medium">Birthday</div>
                  </div>
                  <div 
                    className={`p-4 border rounded-lg text-center cursor-pointer ${messageType === 'festive' ? 'border-primary bg-primary-50' : ''}`}
                    onClick={() => setMessageType('festive')}
                  >
                    <div className="text-2xl mb-1">🎉</div>
                    <div className="font-medium">Festive</div>
                  </div>
                </div>
              </div>
              
              {/* Credit Amount (for credit offer) */}
              {messageType === 'credit' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Credit Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input 
                      type="number" 
                      className="pl-8"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
              
              {/* Festival Selection (for festive message) */}
              {messageType === 'festive' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Select Festival</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={festival}
                    onChange={(e) => setFestival(e.target.value)}
                  >
                    <option value="Chinese New Year">Chinese New Year</option>
                    <option value="Deepavali">Deepavali</option>
                    <option value="Hari Raya">Hari Raya</option>
                    <option value="Christmas">Christmas</option>
                  </select>
                </div>
              )}
              
              <Button 
                onClick={generateMessage}
                disabled={!selectedCustomer}
                className="w-full"
              >
                Generate Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Message Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{messageSent ? 'Message Sent!' : 'Message Preview'}</DialogTitle>
            {!messageSent && <DialogDescription>
              Review the message before sending
            </DialogDescription>}
          </DialogHeader>
          
          {messageSent ? (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">WhatsApp Sent!</h3>
              <p className="text-gray-500">
                Message sent to {selectedCustomer?.name} ({selectedCustomer?.mobile})
              </p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                  <div className="flex">
                    <div className="mr-3 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-green-700">WhatsApp Preview</div>
                      <div className="text-sm text-green-600">
                        To: {selectedCustomer?.name} ({selectedCustomer?.mobile})
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg bg-gray-50">
                  <div className="text-gray-900">
                    {previewMessage}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  Send WhatsApp
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 