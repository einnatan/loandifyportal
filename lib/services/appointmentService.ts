import { addDays, addHours, format, getHours, isSameDay, startOfDay } from 'date-fns';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AppointmentDay {
  date: string;
  dateLabel: string;
  dayName: string;
  timeSlots: TimeSlot[];
}

export interface Lender {
  id: string;
  name: string;
  logoUrl: string;
  address: string;
  contactInfo: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  lenderId: string;
  lenderName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'in-person' | 'video' | 'phone';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Mock lenders for the appointments
const mockLenders: Lender[] = [
  {
    id: 'lender-001',
    name: 'DBS Bank',
    logoUrl: '/logos/dbs.png',
    address: '12 Marina Boulevard, DBS Asia Central, Marina Bay Financial Centre Tower 3, Singapore 018982',
    contactInfo: 'loans@dbs.com.sg | +65 6123 4567'
  },
  {
    id: 'lender-002',
    name: 'OCBC Bank',
    logoUrl: '/logos/ocbc.png',
    address: '63 Chulia Street, #10-00 OCBC Centre East, Singapore 049514',
    contactInfo: 'loans@ocbc.com.sg | +65 6123 4568'
  },
  {
    id: 'lender-003',
    name: 'Standard Chartered',
    logoUrl: '/logos/sc.png',
    address: '8 Marina Boulevard, #27-01 Marina Bay Financial Centre Tower 1, Singapore 018981',
    contactInfo: 'loans@sc.com.sg | +65 6123 4569'
  },
  {
    id: 'lender-004',
    name: 'UOB Bank',
    logoUrl: '/logos/uob.png',
    address: '80 Raffles Place, UOB Plaza 1, Singapore 048624',
    contactInfo: 'loans@uob.com.sg | +65 6123 4570'
  }
];

// Mock customer appointments
const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    customerId: 'USR10028',
    lenderId: 'lender-001',
    lenderName: 'DBS Bank',
    date: '2023-06-15',
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    type: 'in-person',
    notes: 'Bring NRIC and latest payslip',
    createdAt: '2023-06-01T10:30:00Z',
    updatedAt: '2023-06-01T10:30:00Z'
  },
  {
    id: 'apt-002',
    customerId: 'USR10028',
    lenderId: 'lender-003',
    lenderName: 'Standard Chartered',
    date: '2023-06-20',
    startTime: '14:30',
    endTime: '15:30',
    status: 'scheduled',
    type: 'video',
    notes: 'Discuss loan consolidation options',
    createdAt: '2023-06-02T14:45:00Z',
    updatedAt: '2023-06-02T14:45:00Z'
  },
  {
    id: 'apt-003',
    customerId: 'USR10028',
    lenderId: 'lender-002',
    lenderName: 'OCBC Bank',
    date: '2023-05-10',
    startTime: '11:00',
    endTime: '12:00',
    status: 'completed',
    type: 'in-person',
    notes: 'Initial consultation for home loan',
    createdAt: '2023-04-25T09:15:00Z',
    updatedAt: '2023-05-10T12:15:00Z'
  }
];

/**
 * Get all lenders available for appointments
 */
export function getLenders(): Lender[] {
  return mockLenders;
}

/**
 * Get appointments for a specific customer
 */
export function getAppointmentsByCustomer(customerId: string): Appointment[] {
  return mockAppointments.filter(appointment => appointment.customerId === customerId);
}

/**
 * Get a specific appointment by ID
 */
export function getAppointmentById(appointmentId: string): Appointment | undefined {
  return mockAppointments.find(appointment => appointment.id === appointmentId);
}

/**
 * Generate available days and time slots for a specific lender
 */
export function getAvailableDays(lenderId: string, startDate: Date = new Date()): AppointmentDay[] {
  // Generate available days for the next 7 working days (Mon-Sat)
  const days: AppointmentDay[] = [];
  const existingAppointments = mockAppointments.filter(apt => apt.lenderId === lenderId && apt.status === 'scheduled');
  
  let i = 0;
  let workDaysCount = 0;
  
  // Continue until we have 7 working days
  while (workDaysCount < 7) {
    const currentDate = addDays(startDate, i);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'EEEE'); // Monday, Tuesday, etc.
    const dateLabel = format(currentDate, 'd MMM'); // 1 Jun, 2 Jun, etc.
    
    // Skip Sundays (closed)
    if (dayName === 'Sunday') {
      i++;
      continue;
    }
    
    // Generate time slots for each day
    const timeSlots: TimeSlot[] = [];
    // New time slots: 30-minute intervals from 10:30 AM to 7:30 PM
    const dayStart = 10.5; // 10:30 AM (10 hours + 30 minutes = 10.5 hours)
    const dayEnd = 19.5;   // 7:30 PM (19 hours + 30 minutes = 19.5 hours)
    
    // Create slots in 30-minute increments
    for (let hour = dayStart; hour < dayEnd; hour += 0.5) {
      // Calculate the hours and minutes
      const startHour = Math.floor(hour);
      const startMinute = (hour - startHour) * 60;
      const endHour = Math.floor(hour + 0.5);
      const endMinute = ((hour + 0.5) - endHour) * 60;
      
      // Create date objects for start and end times
      const slotStart = new Date(currentDate);
      slotStart.setHours(startHour, startMinute, 0);
      
      const slotEnd = new Date(currentDate);
      slotEnd.setHours(endHour, endMinute, 0);
      
      const startTimeStr = format(slotStart, 'HH:mm');
      const endTimeStr = format(slotEnd, 'HH:mm');
      const slotId = `${formattedDate}-${startTimeStr}`;
      
      // Check if slot is already booked
      const isBooked = existingAppointments.some(apt => {
        return apt.date === formattedDate && apt.startTime === startTimeStr;
      });
      
      timeSlots.push({
        id: slotId,
        startTime: startTimeStr,
        endTime: endTimeStr,
        available: !isBooked
      });
    }
    
    days.push({
      date: formattedDate,
      dateLabel,
      dayName,
      timeSlots
    });
    
    workDaysCount++;
    i++;
  }
  
  return days;
}

/**
 * Schedule a new appointment
 */
export function scheduleAppointment(appointmentData: {
  customerId: string;
  lenderId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'video' | 'phone';
  notes?: string;
}): Appointment {
  const lender = mockLenders.find(l => l.id === appointmentData.lenderId);
  
  if (!lender) {
    throw new Error('Lender not found');
  }
  
  // Check if the time slot is available
  const availableDays = getAvailableDays(appointmentData.lenderId);
  const requestedDay = availableDays.find(day => day.date === appointmentData.date);
  
  if (!requestedDay) {
    throw new Error('Selected date is not available for appointments');
  }
  
  const requestedSlot = requestedDay.timeSlots.find(slot => 
    slot.startTime === appointmentData.startTime && slot.available
  );
  
  if (!requestedSlot) {
    throw new Error('Selected time slot is not available');
  }
  
  // Create new appointment
  const newAppointment: Appointment = {
    id: `apt-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    customerId: appointmentData.customerId,
    lenderId: appointmentData.lenderId,
    lenderName: lender.name,
    date: appointmentData.date,
    startTime: appointmentData.startTime,
    endTime: appointmentData.endTime,
    status: 'scheduled',
    type: appointmentData.type,
    notes: appointmentData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to mock appointments (in a real app, this would be persisted to a database)
  mockAppointments.push(newAppointment);
  
  return newAppointment;
}

/**
 * Update an existing appointment
 */
export function updateAppointment(
  appointmentId: string,
  updates: Partial<Omit<Appointment, 'id' | 'customerId' | 'lenderId' | 'lenderName' | 'createdAt'>>
): Appointment {
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  const appointment = mockAppointments[appointmentIndex];
  
  // Update appointment fields
  const updatedAppointment: Appointment = {
    ...appointment,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Replace in mock data
  mockAppointments[appointmentIndex] = updatedAppointment;
  
  return updatedAppointment;
}

/**
 * Cancel an appointment
 */
export function cancelAppointment(appointmentId: string): Appointment {
  return updateAppointment(appointmentId, { status: 'cancelled' });
}

/**
 * Get upcoming appointments for a customer
 */
export function getUpcomingAppointments(customerId: string): Appointment[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return mockAppointments.filter(appointment => 
    appointment.customerId === customerId &&
    (appointment.date > today || 
     (appointment.date === today && appointment.startTime > format(new Date(), 'HH:mm'))) &&
    appointment.status === 'scheduled'
  ).sort((a, b) => {
    // Sort by date and time
    if (a.date !== b.date) {
      return a.date < b.date ? -1 : 1;
    }
    return a.startTime < b.startTime ? -1 : 1;
  });
}

/**
 * Get past appointments for a customer
 */
export function getPastAppointments(customerId: string): Appointment[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  const now = format(new Date(), 'HH:mm');
  
  return mockAppointments.filter(appointment => 
    appointment.customerId === customerId &&
    (appointment.date < today || 
     (appointment.date === today && appointment.startTime < now)) ||
    ['completed', 'cancelled'].includes(appointment.status)
  ).sort((a, b) => {
    // Sort by date and time, most recent first
    if (a.date !== b.date) {
      return a.date > b.date ? -1 : 1;
    }
    return a.startTime > b.startTime ? -1 : 1;
  });
} 