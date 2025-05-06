'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { UserPreferences, UserProfile, updateUserPreferences } from '../../lib/services/userProfileService'

interface SecurityTabProps {
  profile: UserProfile
  onUpdate: (data: Partial<UserProfile>) => void
}

export function SecurityTab({ profile, onUpdate }: SecurityTabProps) {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: profile.preferences.security.twoFactorEnabled,
    loginNotifications: profile.preferences.security.loginNotifications
  })
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  
  const [passwordError, setPasswordError] = useState('')
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSecuritySettings(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user types
    if (passwordError) {
      setPasswordError('')
    }
  }
  
  const handleSecuritySave = () => {
    // Update preferences
    const updatedPreferences: Partial<UserPreferences> = {
      security: {
        ...profile.preferences.security,
        twoFactorEnabled: securitySettings.twoFactorEnabled,
        loginNotifications: securitySettings.loginNotifications
      }
    }
    
    const updated = updateUserPreferences(updatedPreferences)
    onUpdate({ preferences: updated.preferences })
  }
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    if (!passwords.current) {
      setPasswordError('Current password is required')
      return
    }
    
    if (passwords.new.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }
    
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match')
      return
    }
    
    // Mock password update success
    // In a real app, this would make an API call
    
    // Reset form
    setPasswords({
      current: '',
      new: '',
      confirm: ''
    })
    
    // Show success (in a real app would show a success message)
    alert('Password updated successfully')
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={securitySettings.twoFactorEnabled}
                onChange={handleSecurityChange}
              />
              <div>
                <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="loginNotifications"
                name="loginNotifications"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={securitySettings.loginNotifications}
                onChange={handleSecurityChange}
              />
              <div>
                <Label htmlFor="loginNotifications">Login Notifications</Label>
                <p className="text-sm text-gray-500">Receive an email when someone logs into your account</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSecuritySave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                name="new"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters and include a mix of letters, numbers, and symbols
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
            </div>
            
            {passwordError && (
              <div className="text-red-500 text-sm font-medium">{passwordError}</div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Devices</CardTitle>
          <CardDescription>Devices that have recently accessed your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.preferences.security.recentDevices.map((device, index) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className={`w-2 h-2 rounded-full ${device.isCurrent ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <div className="font-medium flex items-center">
                      {device.name}
                      {device.isCurrent && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Last active: {new Date(device.lastActive).toLocaleString()}</div>
                  </div>
                </div>
                {!device.isCurrent && (
                  <Button variant="outline" size="sm">
                    Sign Out
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 