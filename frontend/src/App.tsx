import { Routes, Route } from "react-router";
import Home from '@/routes/home';
import AdminLayout from '@/layouts/admin';
import Overview from '@/routes/admin/overview';
import StudentsLog from '@/routes/admin/students-log';
import VisitorsLog from '@/routes/admin/visitors-log';
import ProtectedRoute from '@/routes/protected-route';

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="students/logs" element={<StudentsLog />} />
          <Route path="visitors/logs" element={<VisitorsLog />} />
        </Route>
      </Route>
    </Routes>
  );
}
