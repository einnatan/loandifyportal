'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { UserAddress, UserProfile, addUserAddress, setPrimaryAddress } from '../../lib/services/userProfileService'

interface AddressesTabProps {
  profile: UserProfile
  onUpdate: (data: Partial<UserProfile>) => void
}

export function AddressesTab({ profile, onUpdate }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>(profile.addresses)
  const [newAddress, setNewAddress] = useState<Omit<UserAddress, 'isPrimary'>>({
    street: '',
    unitNumber: '',
    city: '',
    postalCode: '',
    country: 'Singapore'
  })
  const [addingNew, setAddingNew] = useState(false)
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target
    const updatedAddresses = [...addresses]
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value }
    setAddresses(updatedAddresses)
  }
  
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAddress(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSetPrimary = (index: number) => {
    const updated = setPrimaryAddress(index)
    setAddresses(updated.addresses)
    onUpdate({ addresses: updated.addresses })
  }
  
  const handleAddNewAddress = () => {
    const updated = addUserAddress(newAddress)
    setAddresses(updated.addresses)
    setNewAddress({
      street: '',
      unitNumber: '',
      city: '',
      postalCode: '',
      country: 'Singapore'
    })
    setAddingNew(false)
    onUpdate({ addresses: updated.addresses })
  }
  
  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = [...addresses]
    updatedAddresses.splice(index, 1)
    setAddresses(updatedAddresses)
    onUpdate({ addresses: updatedAddresses })
  }
  
  const handleUpdateAddresses = () => {
    onUpdate({ addresses })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Addresses</h2>
        {!addingNew && (
          <Button onClick={() => setAddingNew(true)}>Add New Address</Button>
        )}
      </div>
      
      {addresses.map((address, index) => (
        <Card key={index} className={address.isPrimary ? 'border-2 border-primary' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {address.isPrimary && (
                  <span className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded-full mr-2">
                    Primary
                  </span>
                )}
                Address {index + 1}
              </CardTitle>
              <div className="flex gap-2">
                {!address.isPrimary && (
                  <Button variant="outline" size="sm" onClick={() => handleSetPrimary(index)}>
                    Set as Primary
                  </Button>
                )}
                {addresses.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleRemoveAddress(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`street-${index}`}>Street Address</Label>
                <Input
                  id={`street-${index}`}
                  name="street"
                  value={address.street}
                  onChange={(e) => handleAddressChange(e, index)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`unitNumber-${index}`}>Unit Number</Label>
                <Input
                  id={`unitNumber-${index}`}
                  name="unitNumber"
                  value={address.unitNumber}
                  onChange={(e) => handleAddressChange(e, index)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`city-${index}`}>City</Label>
                <Input
                  id={`city-${index}`}
                  name="city"
                  value={address.city}
                  onChange={(e) => handleAddressChange(e, index)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`postalCode-${index}`}>Postal Code</Label>
                <Input
                  id={`postalCode-${index}`}
                  name="postalCode"
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange(e, index)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`country-${index}`}>Country</Label>
                <Input
                  id={`country-${index}`}
                  name="country"
                  value={address.country}
                  onChange={(e) => handleAddressChange(e, index)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {addingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
            <CardDescription>Add a new address to your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-street">Street Address</Label>
                <Input
                  id="new-street"
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-unitNumber">Unit Number</Label>
                <Input
                  id="new-unitNumber"
                  name="unitNumber"
                  value={newAddress.unitNumber}
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-city">City</Label>
                <Input
                  id="new-city"
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-postalCode">Postal Code</Label>
                <Input
                  id="new-postalCode"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleNewAddressChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-country">Country</Label>
                <Input
                  id="new-country"
                  name="country"
                  value={newAddress.country}
                  onChange={handleNewAddressChange}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddingNew(false)}>Cancel</Button>
              <Button onClick={handleAddNewAddress}>Add Address</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {addresses.length > 0 && !addingNew && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleUpdateAddresses}>Save Changes</Button>
        </div>
      )}
    </div>
  )
} 