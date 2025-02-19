import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssetList from './components/AssetList';
import AssetDetail from './components/AssetDetail';
import Wallet from './components/Wallet';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<AssetList />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </div>
  );
}

export default App;
