import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction
} from './card';

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('rounded-xl');
  });

  it('applies additional className correctly', () => {
    render(<Card className="custom-class">Card with custom class</Card>);
    const card = screen.getByText('Card with custom class');
    
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-card'); // Default class still applied
  });

  it('forwards additional props to the div element', () => {
    render(<Card data-testid="test-card">Card with data attribute</Card>);
    const card = screen.getByTestId('test-card');
    
    expect(card).toBeInTheDocument();
  });
});

describe('CardHeader Component', () => {
  it('renders with default props', () => {
    render(<CardHeader>Header content</CardHeader>);
    const header = screen.getByText('Header content');
    
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute('data-slot', 'card-header');
  });

  it('applies additional className correctly', () => {
    render(<CardHeader className="custom-header">Custom header</CardHeader>);
    const header = screen.getByText('Custom header');
    
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle Component', () => {
  it('renders with default props', () => {
    render(<CardTitle>Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveAttribute('data-slot', 'card-title');
  });
});

describe('CardDescription Component', () => {
  it('renders with default props', () => {
    render(<CardDescription>Card description text</CardDescription>);
    const description = screen.getByText('Card description text');
    
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveAttribute('data-slot', 'card-description');
  });
});

describe('CardAction Component', () => {
  it('renders with default props', () => {
    render(<CardAction>Action content</CardAction>);
    const action = screen.getByText('Action content');
    
    expect(action).toBeInTheDocument();
    expect(action).toHaveAttribute('data-slot', 'card-action');
  });
});

describe('CardContent Component', () => {
  it('renders with default props', () => {
    render(<CardContent>Content area</CardContent>);
    const content = screen.getByText('Content area');
    
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('px-6');
    expect(content).toHaveAttribute('data-slot', 'card-content');
  });
});

describe('CardFooter Component', () => {
  it('renders with default props', () => {
    render(<CardFooter>Footer content</CardFooter>);
    const footer = screen.getByText('Footer content');
    
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('data-slot', 'card-footer');
  });
});

describe('Complete Card', () => {
  it('renders a complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Example Card</CardTitle>
          <CardDescription>This is a sample card description</CardDescription>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Cancel</button>
          <button>Submit</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Example Card')).toBeInTheDocument();
    expect(screen.getByText('This is a sample card description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
}); 