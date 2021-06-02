import { render, screen } from '@testing-library/react';
import Home from './Home';
import { HashRouter as Router } from 'react-router-dom';

test('renders "New Project" and "Load Project" buttons', () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const newButton = screen.getByText(/new project/i);
  const loadButton = screen.getByText(/load project/i);
  expect(newButton).toBeInTheDocument();
  expect(loadButton).toBeInTheDocument();
});
