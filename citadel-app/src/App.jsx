import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ProvideAuth } from './lib/useAuth';
import Dashboard from './pages/dashboard/dashboard';
import Instance from './pages/instance/instance';
import Login from './pages/login/login';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/instances/:name/*' element={<Instance />} />
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

export default App;
