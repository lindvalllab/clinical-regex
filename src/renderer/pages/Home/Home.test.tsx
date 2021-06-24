import { render, screen } from '@testing-library/react';
import Home from './Home';
import { HashRouter as Router } from 'react-router-dom';
import { ApiContext } from '../../api';
import ElectronApi from '../../../api/electron';
jest.mock('../../../api/electron');

test('renders "New Project" and "Load Project" buttons', () => {
  const api = new ElectronApi();
  render(
    <ApiContext.Provider value={api}>
      <Router>
        <Home />
      </Router>
    </ApiContext.Provider>
  );
  const newButton = screen.getByText(/new project/i);
  const loadButton = screen.getByText(/load project/i);
  expect(newButton).toBeInTheDocument();
  expect(loadButton).toBeInTheDocument();
});
