import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { createGlobalStyle } from 'styled-components';
import JobSetup from './components/admin/JobSetup'
import AdminLogin from './components/auth/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminUsers from './components/admin/AdminUsers'
import AdminJob from './components/admin/AdminJob'
import AdminCompanies from './components/admin/AdminCompanies'
const GlobalStyle = createGlobalStyle`
  /* Import nhiều font từ Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  body {
    /* Định nghĩa thứ tự ưu tiên font chữ */
    font-family: 'Roboto', 'Be Vietnam Pro', 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Tùy chỉnh scrollbar */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />},
  {
    path: '/login',
    element: <Login /> // Không cần ProtectedRoute vì đây là trang đăng nhập
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute><AdminUsers /></ProtectedRoute>
  },
  {
    path: '/admin/company',
    element: <ProtectedRoute><AdminCompanies /></ProtectedRoute>
  },
  {
    path: '/admin/job',
    element: <ProtectedRoute><AdminJob /></ProtectedRoute>
  },
  {
    path: '/admin/job/details',
    element: <ProtectedRoute><AdminJob /></ProtectedRoute>
  },
  {
    path: '/admin/login',
    element: <AdminLogin /> // Không cần ProtectedRoute vì đây là trang đăng nhập admin
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  },
  {
    path: '/signup',
    element: <Signup /> // Không cần ProtectedRoute vì đây là trang đăng ký
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/job/:id",
    element: <ProtectedRoute><JobSetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
]);
function App() {

  return (
    <div>
            <GlobalStyle />

      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
