'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  User, 
  Mail, 
  FileText,
  ArrowLeft,
  CalendarPlus,
  X
} from 'lucide-react';
import { 
  getAppointmentById, 
  cancelAppointment, 
  updateAppointment,
  Appointment as AppointmentType
} from '@/lib/services/appointmentService';
import Link from 'next/link';

// Extend the Appointment type to include fields we need
interface ExtendedAppointment extends Omit<AppointmentType, 'id'> {
  id: string;
  lender: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  cancellationReason?: string;
}

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [appointment, setAppointment] = useState<ExtendedAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationConfirm, setShowCancellationConfirm] = useState(false);

  useEffect(() => {
    const appointmentId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const fetchAppointmentDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getAppointmentById(appointmentId);
        
        if (!data || !data.id) {
          console.error('Invalid appointment data returned');
          setIsLoading(false);
          return;
        }
        
        // Fetch lender details and combine with appointment
        const extendedData: ExtendedAppointment = {
          ...data,
          id: data.id, // Ensure id is a string
          lender: {
            name: "Example Bank", // This would come from a real API
            phone: "555-123-4567",
            email: "contact@examplebank.com",
            address: "123 Finance St, Business District"
          }
        };
        
        setAppointment(extendedData);
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [params.id]);

  const handleCancel = async () => {
    if (!appointment) return;
    
    setIsCancelling(true);
    try {
      await cancelAppointment(appointment.id);
      setAppointment(prev => prev ? {...prev, status: 'cancelled', cancellationReason} : null);
      setShowCancellationConfirm(false);
      // router.push('/appointments');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReschedule = () => {
    router.push(`/appointments/schedule?reschedule=${appointment?.id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      'scheduled': { color: 'bg-green-500 hover:bg-green-600', label: 'Scheduled' },
      'cancelled': { color: 'bg-red-500 hover:bg-red-600', label: 'Cancelled' },
      'completed': { color: 'bg-blue-500 hover:bg-blue-600', label: 'Completed' },
      'missed': { color: 'bg-yellow-500 hover:bg-yellow-600', label: 'Missed' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-500 hover:bg-gray-600', label: status };
    
    return (
      <Badge className={`${statusInfo.color} text-white`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="h-5 w-5 mr-2" />;
      case 'video':
        return <Video className="h-5 w-5 mr-2" />;
      case 'phone':
        return <Phone className="h-5 w-5 mr-2" />;
      default:
        return <User className="h-5 w-5 mr-2" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
              <p className="text-gray-500 mb-4">The appointment you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/appointments">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Appointments
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center">
        <Button variant="outline" className="mr-2" asChild>
          <Link href="/appointments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Appointment Details</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Appointment with {appointment.lender.name}</CardTitle>
                  <CardDescription>
                    {formatDate(appointment.date)} • Reference: #{appointment.id.slice(0, 8)}
                  </CardDescription>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Appointment Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{formatTime(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      {getAppointmentTypeIcon(appointment.type)}
                      <span className="capitalize">{appointment.type} Meeting</span>
                    </div>
                    {appointment.type === 'in-person' && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                        <span>{appointment.lender.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Lender Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{appointment.lender.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{appointment.lender.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{appointment.lender.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-medium mb-3">Appointment Notes</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {appointment.notes ? (
                    <p className="text-gray-700">{appointment.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes provided for this appointment.</p>
                  )}
                </div>
              </div>

              {appointment.status === 'cancelled' && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-medium mb-3">Cancellation Details</h3>
                    <div className="bg-red-50 p-4 rounded-md">
                      <p className="text-red-700">
                        This appointment has been cancelled.
                        {appointment.cancellationReason && (
                          <span> Reason: {appointment.cancellationReason}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {appointment.status === 'scheduled' && (
            <div className="mt-6 flex space-x-4">
              <Button onClick={handleReschedule} className="flex items-center" disabled={isRescheduling}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setShowCancellationConfirm(true)} 
                className="flex items-center"
                disabled={isCancelling}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            </div>
          )}

          {showCancellationConfirm && (
            <Card className="mt-4 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Confirm Cancellation</CardTitle>
                <CardDescription>
                  Are you sure you want to cancel this appointment? This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Reason for cancellation (optional)
                  </label>
                  <Textarea
                    placeholder="Please provide a reason for cancellation..."
                    value={cancellationReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCancellationReason(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="destructive" 
                    onClick={handleCancel} 
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCancellationConfirm(false)}
                    disabled={isCancelling}
                  >
                    Keep Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Prepare for Your Meeting</CardTitle>
              <CardDescription>
                Make the most of your appointment with these tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Bring Documentation</h4>
                    <p className="text-sm text-gray-500">
                      Have your ID, proof of income, and other financial documents ready.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Prepare Questions</h4>
                    <p className="text-sm text-gray-500">
                      List questions about loan terms, repayment options, and fees.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Be on Time</h4>
                    <p className="text-sm text-gray-500">
                      Arrive 5-10 minutes early for in-person or be ready to join video calls promptly.
                    </p>
                  </div>
                </div>
              </div>

              {appointment.type === 'video' && appointment.status === 'scheduled' && (
                <>
                  <Separator className="my-5" />
                  <div>
                    <h4 className="font-medium mb-3">Video Meeting Link</h4>
                    <Button className="w-full" asChild>
                      <a href="/example-meeting-link" target="_blank" rel="noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        Join Video Meeting
                      </a>
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      The meeting link will become active 5 minutes before your scheduled time.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 