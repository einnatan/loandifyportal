'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, BadgeCheck, Star, Shield, Briefcase, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

// UI Components
function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  href,
  className = '', 
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  [key: string]: any;
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  }
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

function Card({ 
  children, 
  className = '', 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <div 
      className={`rounded-lg border border-border bg-card p-6 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [loanAmount, setLoanAmount] = useState(10000)
  const [loanTerm, setLoanTerm] = useState(36)
  const [interestRate, setInterestRate] = useState(3.92) // Fixed interest rate

  // Calculate monthly payment using the proper formula
  const calculateMonthlyPayment = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const months = loanTerm
    
    // PMT formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    if (monthlyRate === 0) return principal / months
    
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1)
    
    return Math.round(payment)
  }

  const monthlyPayment = calculateMonthlyPayment()
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background pattern/texture */}
        <div className="absolute inset-0 hero-bg-gradient opacity-80 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 decorative-blob-1"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 decorative-blob-2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-gradient text-gradient-primary">Find and compare</span> the best personal loans
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                One application, multiple offers. Compare personalized rates from top lenders.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button href={`/apply?amount=${loanAmount}&term=${loanTerm}`} size="lg" className="flex gap-2 items-center bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl">
                  Get Started <ChevronRight size={20} />
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                <h2 className="text-2xl font-bold mb-6 font-display">Loan Calculator</h2>
                
                {/* Loan Amount Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Loan Amount</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="text" 
                        value={loanAmount.toLocaleString()}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '');
                          if (/^\d*$/.test(value)) {
                            setLoanAmount(value === '' ? 0 : parseInt(value));
                          }
                        }}
                        className="pl-6 pr-1 py-1 border border-gray-300 rounded text-right w-32 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$1,000</span>
                    <span>$100,000</span>
                  </div>
                </div>
                
                {/* Loan Term Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Loan Term</label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={loanTerm}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setLoanTerm(Math.min(Math.max(value === '' ? 0 : parseInt(value), 1), 60));
                          }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-right w-20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="ml-2 text-sm text-gray-500">months</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    step="1" 
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 month</span>
                    <span>60 months</span>
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="bg-blue-50/70 p-5 rounded-lg mb-6 border border-blue-100">
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-gray-600 text-base">Est. Monthly Payment:</span>
                    <span className="font-bold text-base">${monthlyPayment.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-gray-600 text-base">Interest Rate:</span>
                    <span className="font-bold text-base">{interestRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Total Repayment:</span>
                    <span className="font-bold text-base">${(monthlyPayment * loanTerm).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button href={`/apply?amount=${loanAmount}&term=${loanTerm}`} className="w-full flex gap-2 items-center justify-center bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl">
                  Get Your Loan Options <ArrowRight size={16} />
                </Button>
                
                {/* Small Print Text */}
                <p className="text-xs text-gray-500 mt-4 leading-tight">
                  Representative example: For a loan of ${loanAmount.toLocaleString()} over {loanTerm} months at {interestRate}% p.a. (fixed), 
                  monthly repayment of ${monthlyPayment.toLocaleString()}, total cost of credit ${((monthlyPayment * loanTerm) - loanAmount).toLocaleString()}, 
                  total amount repayable ${(monthlyPayment * loanTerm).toLocaleString()}.
                </p>
                <p className="text-xs text-gray-500 mt-2 leading-tight">
                  Rates from 4.5% - 14.9% APR. Loan amounts from $1,000 - $100,000. No origination fee or early repayment fee.
                  Actual rates and loan amounts will be determined based on your application and credit assessment.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="container">
          <motion.h2 
            className="text-3xl font-bold text-center mb-3 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Loandify?
          </motion.h2>
          <motion.p
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We're committed to finding you the best loan options with a seamless experience.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <Card className="flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  <BadgeCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 font-display">Compare Multiple Offers</h3>
                <p className="text-gray-600">See personalized loan offers from multiple lenders with just one application.</p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <Card className="flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 font-display">Highest Approval Rates</h3>
                <p className="text-gray-600">Our network of lenders offers options for all credit profiles.</p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group"
            >
              <Card className="flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 font-display">Safe & Secure</h3>
                <p className="text-gray-600">Your information is protected with bank-level security and encryption.</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="container relative z-10">
          <motion.h2 
            className="text-3xl font-bold text-center mb-3 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our simple 3-step process makes finding and applying for loans quick and easy.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-primary opacity-30"></div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-full relative z-10 hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-primary text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">1</div>
                <h3 className="text-xl font-medium mb-3 font-display">Complete One Application</h3>
                <p className="text-gray-600">Fill out a single application with your details and loan requirements.</p>
              </div>
              <div className="hidden md:block absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/4 z-20">
                <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
                  <ArrowRight className="text-primary" size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-full relative z-10 hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-secondary text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">2</div>
                <h3 className="text-xl font-medium mb-3 font-display">Compare Personalized Offers</h3>
                <p className="text-gray-600">Review and compare customized loan offers from multiple lenders.</p>
              </div>
              <div className="hidden md:block absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/4 z-20">
                <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
                  <ArrowRight className="text-primary" size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-full relative z-10 hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-accent text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">3</div>
                <h3 className="text-xl font-medium mb-3 font-display">Get Your Loan</h3>
                <p className="text-gray-600">Select the best offer and complete the process with your chosen lender.</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button href="/apply" className="flex gap-2 items-center mx-auto bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl">
              Apply Now <ChevronRight size={16} />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="container relative z-10">
          <motion.h2 
            className="text-3xl font-bold text-center mb-3 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Don't just take our word for it. Hear from customers who found their perfect loan.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full relative">
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <div className="bg-gradient-primary text-white p-1.5 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                  </div>
                </div>
                <div className="mb-4 text-gray-600 italic">
                  "I was amazed at how simple the process was. Within minutes, I had multiple loan offers to compare. Ended up saving over $2,000 compared to my bank's offer."
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-blue-600">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold">James D.</div>
                    <div className="text-sm text-gray-500">Personal Loan, $15,000</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full relative">
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <div className="bg-gradient-secondary text-white p-1.5 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                  </div>
                </div>
                <div className="mb-4 text-gray-600 italic">
                  "After getting turned down by my local bank, I wasn't sure where to turn. Loandify connected me with lenders who understood my situation. Now I'm debt-free."
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-blue-600">
                    SR
                  </div>
                  <div>
                    <div className="font-semibold">Sarah R.</div>
                    <div className="text-sm text-gray-500">Debt Consolidation, $24,000</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full relative">
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <div className="bg-gradient-accent text-white p-1.5 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                  </div>
                </div>
                <div className="mb-4 text-gray-600 italic">
                  "The entire process was fast and seamless. I filled out one application and had competitive offers the same day. Funded within 48 hours. Couldn't be happier with the service!"
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-blue-600">
                    MK
                  </div>
                  <div>
                    <div className="font-semibold">Michael K.</div>
                    <div className="text-sm text-gray-500">Home Improvement, $30,000</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Lenders */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="container">
          <motion.h2 
            className="text-3xl font-bold text-center mb-6 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Our Lending Partners
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We partner with trusted financial institutions to bring you the best loan options.
          </motion.p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              >
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center border border-gray-100 h-20 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="text-xl font-semibold text-blue-600 opacity-80">Bank {i + 1}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/2 blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 font-display"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Ready to find your perfect loan?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 text-white/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Apply now and get personalized loan offers from top lenders in minutes, not days.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                href="/apply" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white/10 font-bold shadow-md hover:shadow-lg"
              >
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
} 