'use client'

import { useState, useEffect } from 'react'
import { getUpcomingAppointments } from '../../lib/services/appointmentService'
import { getUserProfile } from '../../lib/services/userProfileService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import { Appointment } from '../../lib/services/appointmentService'
import { useRouter } from 'next/navigation'

export default function AppointmentsPage() {
  const router = useRouter()
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  
  useEffect(() => {
    const profile = getUserProfile()
    const upcoming = getUpcomingAppointments(profile.id)
    setUpcomingAppointments(upcoming)
  }, [])
  
  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person':
        return '🏢'
      case 'video':
        return '📹'
      case 'phone':
        return '📞'
      default:
        return '📅'
    }
  }
  
  const getAppointmentStatusClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString('en-SG', options)
  }
  
  // Redirect to schedule page
  const handleScheduleAppointment = () => {
    router.push('/appointments/schedule')
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Appointments</h1>
          <p className="text-gray-600">
            Manage your scheduled meetings with loan officers
          </p>
        </div>
        <Button onClick={handleScheduleAppointment}>
          Schedule New Appointment
        </Button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
      </div>
      
      {upcomingAppointments.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-medium mb-2">No Upcoming Appointments</h3>
          <p className="text-gray-500 mb-6">You don't have any appointments scheduled.</p>
          <Button onClick={handleScheduleAppointment}>
            Schedule Your First Appointment
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getAppointmentTypeIcon(appointment.type)}</span>
                    <div>
                      <CardTitle>{appointment.lenderName}</CardTitle>
                      <CardDescription>
                        {formatDate(appointment.date)} at {appointment.startTime} - {appointment.endTime}
                      </CardDescription>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusClass(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Meeting Type:</strong> {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                  {appointment.notes && (
                    <div className="mt-2">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/appointments/${appointment.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/appointments/${appointment.id}/reschedule`}>Reschedule</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" asChild>
                    <Link href={`/appointments/${appointment.id}/cancel`}>Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 