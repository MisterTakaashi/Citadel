import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard/dashboard';
import Instance from './pages/instance/instance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/instances/:name' element={<Instance />} />
      </Routes>
    </Router>
  );
}

export default App;
