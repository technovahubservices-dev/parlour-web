import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the main application', () => {
        render(<App />);
        // Check for unique text visible on the page
        expect(screen.getByText('Une Expérience Unique')).toBeInTheDocument();
        expect(screen.getByText('The Art of')).toBeInTheDocument();
    });

    it('true is true', () => {
        expect(true).toBe(true);
    });
});
