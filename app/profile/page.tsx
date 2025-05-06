'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { getUserProfile, updateUserProfile } from '../../lib/services/userProfileService'
import { PersonalInfoTab } from './PersonalInfoTab'
import { AddressesTab } from './AddressesTab'
import { PreferencesTab } from './PreferencesTab'
import { SecurityTab } from './SecurityTab'
import { FinancialInfoTab } from './FinancialInfoTab'

export default function ProfilePage() {
  const [profile, setProfile] = useState(getUserProfile())
  
  const handleProfileUpdate = (updatedData: any) => {
    const updated = updateUserProfile(updatedData)
    setProfile(updated)
  }
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and account preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Profile Completeness:
            <span className="ml-1 font-medium">{profile.profileCompleteness}%</span>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${profile.profileCompleteness}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="financial">Financial Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <PersonalInfoTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>
        
        <TabsContent value="addresses">
          <AddressesTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialInfoTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>
        
        <TabsContent value="preferences">
          <PreferencesTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 