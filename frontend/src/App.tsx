// // import { Button, Container, Heading } from '@chakra-ui/react'

// // export default function App() {
// //   return (
// //     <Container centerContent p={8}>
// //       <Heading as="h1" size="xl" mb={4}>
// //         Welcome to CodeArena!
// //       </Heading>
// //       <Button colorScheme="teal" size="lg">
// //         Get Started
// //       </Button>
// //     </Container>
// //   )
// // }


// // // src/App.tsx (Updated Version)
// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import Layout from './components/Layout';
// // import Home from './pages/Home';
// // import Problems from './pages/Problems';
// // import Login from './pages/Login';
// // import ProblemDetail from './pages/ProblemDetail'; // 1. Import the new page

// // export default function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<Layout />}>
// //           <Route index element={<Home />} />
// //           <Route path="problems" element={<Problems />} />
// //           <Route path="problems/:problemId" element={<ProblemDetail />} /> {/* 2. Add the new route */}
// //           <Route path="login" element={<Login />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }





// // import { Routes, Route } from 'react-router-dom';
// // import { ChakraProvider, Box } from '@chakra-ui/react';
// // import NavBar from './components/NavBar';

// // import Home from './pages/Home';
// // import Login from './pages/Login';
// // import Register from './pages/Register';
// // import Problems from './pages/Problems';              // you already have
// // import ProblemDetail from './pages/ProblemDetail';    // you already have
// // import Contests from './pages/Contests';
// // import Leaderboard from './pages/Leaderboard';
// // import Submissions from './pages/Submissions';
// // import Profile from './pages/Profile';
// // import Dashboard from './pages/Dashboard';
// // import RequireAuth from './components/RequireAuth';



// // export default function App() {
// //   return (
// //     <ChakraProvider>
// //       <Box minH="100vh" bg="#0d1016">
// //         <NavBar />
// //         <Routes>
// //           <Route path="/" element={<Home />} />
// //           <Route path="/dashboard" element={<Dashboard />} />
// //           <Route path="/problems" element={<Problems />} />
// //           <Route path="/problems/:problemId" element={<ProblemDetail />} />
// //           <Route path="/contests" element={<Contests />} />
// //           <Route path="/leaderboard" element={<Leaderboard />} />
// //           <Route path="/submissions" element={<Submissions />} />
// //           <Route path="/profile" element={<Profile />} />
// //           <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //         </Routes>
// //       </Box>
// //     </ChakraProvider>
// //   );
// // }



// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import Shell from './Shell';

// // import Home from './pages/Home';
// // import Login from './pages/Login';
// // import Register from './pages/Register';
// // import Problems from './pages/Problems';
// // import ProblemDetail from './pages/ProblemDetail';
// // import Contests from './pages/Contests';
// // import Leaderboard from './pages/Leaderboard';
// // import Submissions from './pages/Submissions';
// // import Profile from './pages/Profile';
// // import Dashboard from './pages/Dashboard';
// // import RequireAuth from './components/RequireAuth';

// // import { Box } from "@chakra-ui/react";

// // export default function App() {
// //   return (
// //     <Box w="100%" minH="100vh" bg="#0d1016">
// //       <Routes>
// //         {/* Layout route renders NavBar + an <Outlet/> */}
// //         <Route element={<Shell />}>
// //           <Route index element={<Home />} />
// //           <Route path="problems" element={<Problems />} />
// //           <Route path="problems/:problemId" element={<ProblemDetail />} />
// //           <Route path="contests" element={<Contests />} />
// //           <Route path="leaderboard" element={<Leaderboard />} />

// //           {/* gated routes */}
// //           <Route
// //             path="submissions"
// //             element={<RequireAuth><Submissions /></RequireAuth>}
// //           />
// //           <Route
// //             path="profile"
// //             element={<RequireAuth><Profile /></RequireAuth>}
// //           />
// //           <Route
// //             path="dashboard"
// //             element={<RequireAuth><Dashboard /></RequireAuth>}
// //           />

// //           {/* auth */}
// //           <Route path="login" element={<Login />} />
// //           <Route path="register" element={<Register />} />

// //           {/* fallback */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Route>
// //       </Routes>
// //     </Box>
// //   );
// // }






// // src/App.tsx
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { Box } from '@chakra-ui/react';
// import Shell from './Shell';

// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Problems from './pages/Problems';
// import ProblemDetail from './pages/ProblemDetail';
// import Contests from './pages/Contests';
// import Leaderboard from './pages/Leaderboard';
// import Submissions from './pages/Submissions';
// import Profile from './pages/Profile';
// import Dashboard from './pages/Dashboard';
// import RequireAuth from './components/RequireAuth';

// // NEW: admin page
// import AdminProblemNew from './pages/admin/AdminProblemNew';
// import useAuth from './hooks/useAuth';

// function RequireAdmin({ children }: { children: JSX.Element }) {
//   const { authed, isAdmin } = useAuth();
//   if (!authed) return <Navigate to="/login" replace />;
//   if (!isAdmin) return <Navigate to="/" replace />;
//   return children;
// }

// export default function App() {
//   return (
//     <Box w="100%" minH="100vh" bg="#0d1016">
//       <Routes>
//         {/* Layout with NavBar + <Outlet/> */}
//         <Route element={<Shell />}>
//           {/* public */}
//           <Route index element={<Home />} />
//           <Route path="problems" element={<Problems />} />
//           <Route path="problems/:problemId" element={<ProblemDetail />} />
//           <Route path="contests" element={<Contests />} />
//           <Route path="leaderboard" element={<Leaderboard />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />

//           {/* user-gated */}
//           <Route path="submissions" element={<RequireAuth><Submissions /></RequireAuth>} />
//           <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
//           <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

//           {/* admin-gated */}
//           <Route
//             path="admin/problems/new"
//             element={
//               <RequireAdmin>
//                 <AdminProblemNew />
//               </RequireAdmin>
//             }
//           />

//           {/* fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </Box>
//   );
// }





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
