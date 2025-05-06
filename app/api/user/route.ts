import { NextResponse } from 'next/server';

// Mock user data
const userData = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin',
  joinDate: '2023-01-01',
  settings: {
    notifications: true,
    privacy: {
      showEmail: false,
      showActivity: true
    },
    theme: 'light'
  }
};

export async function GET() {
  // In a real application, you would fetch data from a database
  // and handle authentication/authorization
  
  return NextResponse.json(userData);
}

export async function PUT(request: Request) {
  try {
    // In a real application, you would validate the input
    // and update the database
    const data = await request.json();
    
    // Merge the updated data with existing data
    const updatedUser = {
      ...userData,
      ...data,
      // Preserve nested objects by merging them separately
      settings: {
        ...userData.settings,
        ...(data.settings || {})
      }
    };
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 400 }
    );
  }
} 