// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Shell from './Shell';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Contests from './pages/Contests';
import Leaderboard from './pages/Leaderboard';
import Submissions from './pages/Submissions';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import AddProblem from './pages/AddProblem'; // admin page

export default function App() {
  return (
    <Box w="100%" minH="100vh" bg="#0d1016">
      <Routes>
        {/* Layout route renders NavBar + an <Outlet/> */}
        <Route element={<Shell />}>
          {/* public */}
          <Route index element={<Home />} />
          <Route path="problems" element={<Problems />} />
          <Route path="problems/:problemId" element={<ProblemDetail />} />
          <Route path="contests" element={<Contests />} />
          <Route path="leaderboard" element={<Leaderboard />} />

          {/* auth-only */}
          <Route
            path="submissions"
            element={
              <RequireAuth>
                <Submissions />
              </RequireAuth>
            }
          />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          {/* admin-only */}
          <Route
            path="admin/problems/new"
            element={
              <RequireAdmin>
                <AddProblem />
              </RequireAdmin>
            }
          />

          {/* auth screens */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}
