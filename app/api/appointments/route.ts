import { NextRequest, NextResponse } from 'next/server';

// In a real application, this would use a database to store appointments
// and possibly integrate with the bank's calendar/scheduling system
const appointments: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json();
    
    // Validate required fields
    const requiredFields = ['offerId', 'appointmentDate', 'appointmentTime', 'userData'];
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate unique appointment ID
    const appointmentId = `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create appointment record
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    // Store appointment (in a real app, this would save to a database)
    appointments.push(appointment);
    
    // In a real app, this would likely:
    // 1. Create a calendar event
    // 2. Send notification to the lender
    // 3. Send confirmation to the user
    // 4. Update the loan application status
    
    // Simulate sending WhatsApp notification
    console.log(`[WhatsApp Notification] Appointment ${appointmentId} confirmed for ${appointmentData.userData.name} on ${new Date(appointmentData.appointmentDate).toDateString()} at ${appointmentData.appointmentTime}`);
    
    return NextResponse.json({
      success: true,
      appointment: {
        id: appointmentId,
        offerId: appointmentData.offerId,
        isBundle: appointmentData.isBundle,
        date: appointmentData.appointmentDate,
        time: appointmentData.appointmentTime,
        status: 'confirmed'
      }
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to schedule appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This would typically include authentication/authorization checks
  // and filter based on user ID or other parameters
  
  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId parameter' },
      { status: 400 }
    );
  }
  
  // Filter appointments for the specific user
  // In a real app, this would query the database
  const userAppointments = appointments.filter(
    apt => apt.userData && apt.userData.id === userId
  );
  
  return NextResponse.json({ appointments: userAppointments });
} 