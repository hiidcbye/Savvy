import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Insights from './pages/Insights';
import Navbar from './components/Navbar';

export default function App() {
  const [userId, setUserId] = useState(null);

  return (
    <BrowserRouter>
      {!userId ? (
        <SignIn onLogin={(id) => setUserId(id)} />
      ) : (
        <>
          <Navbar onSignOut={() => setUserId(null)} />
          <div style={{ paddingTop: 72 }}>
            <Routes>
              <Route path="/" element={<Home userId={userId} />} />
              <Route path="/transactions" element={<Transactions userId={userId} />} />
              <Route path="/budget" element={<Budget userId={userId} />} />
              <Route path="/insights" element={<Insights userId={userId} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      )}
    </BrowserRouter>
  );
}