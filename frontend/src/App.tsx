import { Routes, Route, Navigate } from "react-router";
import AdminLayout from '@/layouts/admin';
import Overview from '@/routes/admin/overview';
import StudentsLog from '@/routes/admin/students-log';
import VisitorsLog from '@/routes/admin/visitors-log';
import ProtectedRoute from '@/routes/protected-route';
import Login from '@/routes/admin/login';

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route path="login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<AdminLayout />}>
        
          <Route index element={<Overview />} />
          
          <Route path="students">
            <Route path="logs" element={<StudentsLog />} />
          </Route>
          
          <Route path="visitors">
            <Route path="logs" element={<VisitorsLog />} />
          </Route>
          
        </Route>
      </Route>
    </Routes>
  );
}
