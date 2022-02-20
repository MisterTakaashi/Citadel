import React from 'react';
import './App.css';
import Layout from './components/layout';

function App() {
  return (
    <div className='h-screen bg-white dark:bg-slate-900'>
      <Layout />
      <h1 className='text-3xl font-bold underline'>Hello world!</h1>
    </div>
  );
}

export default App;
