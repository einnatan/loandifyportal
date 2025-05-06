'use client'

import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { StarIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FeedbackFormProps {
  onSubmit?: (data: FeedbackData) => void
  onCancel?: () => void
  className?: string
  standalone?: boolean
}

interface FeedbackData {
  type: 'general' | 'application' | 'technical' | 'suggestion'
  rating: number
  comment: string
  contact?: string
  loanId?: string
}

export function FeedbackForm({ 
  onSubmit, 
  onCancel, 
  className = '',
  standalone = false
}: FeedbackFormProps) {
  // Form state
  const [feedbackType, setFeedbackType] = useState<'general' | 'application' | 'technical' | 'suggestion'>('general')
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [contact, setContact] = useState('')
  const [loanId, setLoanId] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  
  // Form validation
  const [errors, setErrors] = useState<{
    comment?: string;
    contact?: string;
    rating?: string;
  }>({})
  
  // Animation state
  const [showThanks, setShowThanks] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: {
      comment?: string;
      contact?: string;
      rating?: string;
    } = {}
    
    if (!comment.trim()) {
      newErrors.comment = 'Please provide feedback'
    }
    
    if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      newErrors.contact = 'Please enter a valid email address'
    }
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    
    setErrors(newErrors)
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return
    }
    
    // Submit feedback
    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating,
      comment,
      ...(contact ? { contact } : {}),
      ...(loanId ? { loanId } : {})
    }
    
    if (onSubmit) {
      onSubmit(feedbackData)
    } else {
      // If no onSubmit handler, show thanks message
      setShowThanks(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowThanks(false)
        resetForm()
      }, 3000)
    }
  }
  
  // Reset form
  const resetForm = () => {
    setFeedbackType('general')
    setRating(0)
    setComment('')
    setContact('')
    setLoanId('')
    setHoverRating(0)
    setErrors({})
  }
  
  // Handle cancel
  const handleCancel = () => {
    resetForm()
    if (onCancel) {
      onCancel()
    }
  }
  
  // Render the form inside a card if standalone
  const content = (
    <AnimatePresence mode="wait">
      {showThanks ? (
        <motion.div
          key="thanks"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center py-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Thank You for Your Feedback!</h3>
          <p className="text-gray-600">
            Your input helps us improve our services and your experience.
          </p>
        </motion.div>
      ) : (
        <motion.form
          ref={formRef}
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="feedbackType">Feedback Type</Label>
            <Select
              value={feedbackType}
              onValueChange={(value: 'general' | 'application' | 'technical' | 'suggestion') => setFeedbackType(value)}
            >
              <SelectTrigger id="feedbackType">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="application">Loan Application</SelectItem>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="suggestion">Feature Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {feedbackType === 'application' && (
            <div className="space-y-2">
              <Label htmlFor="loanId">Loan ID (Optional)</Label>
              <Input 
                id="loanId" 
                placeholder="e.g. L1001"
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                If your feedback is about a specific application, please provide the loan ID.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="rating">
              Your Rating
              {errors.rating && <span className="text-destructive text-sm ml-2">{errors.rating}</span>}
            </Label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <StarIcon 
                    className={`h-8 w-8 ${
                      (hoverRating ? i < hoverRating : i < rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">
              Your Feedback 
              {errors.comment && <span className="text-destructive text-sm ml-2">{errors.comment}</span>}
            </Label>
            <Textarea
              id="comment"
              placeholder="Please share your thoughts, suggestions, or issues..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className={errors.comment ? 'border-destructive' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact">
              Contact Email (Optional)
              {errors.contact && <span className="text-destructive text-sm ml-2">{errors.contact}</span>}
            </Label>
            <Input
              id="contact"
              type="email"
              placeholder="your.email@example.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={errors.contact ? 'border-destructive' : ''}
            />
            <p className="text-xs text-gray-500">
              Provide your email if you'd like us to follow up on your feedback.
            </p>
          </div>
          
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-500">
              We value your privacy. Your feedback helps us improve our services.
            </p>
            
            <div className="flex justify-end space-x-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                Submit Feedback
              </Button>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
  
  // If standalone, wrap in card
  if (standalone) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>We Value Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    )
  }
  
  // Otherwise, just return the form
  return content
} 