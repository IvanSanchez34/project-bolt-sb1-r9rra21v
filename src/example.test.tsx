import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Example test', () => {
  it('renders a message', () => {
    render(<div>Hello DevOps!</div>);
    expect(screen.getByText('Hello DevOps!')).toBeInTheDocument();
  });
});
