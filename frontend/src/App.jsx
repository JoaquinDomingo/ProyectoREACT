import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AllGames from './pages/AllGames';
import MyGames from './pages/MyGames';
import GameDetails from './pages/GameDetails';
import CreateEditGame from './pages/CreateEditGame';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/games" element={<AllGames />} />
                <Route path="/my-games" element={<MyGames />} />
                <Route path="/create-game" element={<CreateEditGame />} />
                <Route path="/edit-game/:id" element={<CreateEditGame />} />
                <Route path="/games/:id" element={<GameDetails />} />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/games" replace />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;