import { Routes, Route, Navigate } from "react-router";
import AdminLayout from '@/layouts/admin';
import Overview from '@/routes/admin/overview';
import StudentsLog from '@/routes/admin/students-log';
import Students from '@/routes/admin/students';
import VisitorsLog from '@/routes/admin/visitors-log';
import Visitors from '@/routes/admin/gatepass';
import ProtectedRoute from '@/routes/protected-route';
import Login from '@/routes/admin/login';
import NotFound from '@/routes/not-found';
import Settings from '@/routes/admin/settings';
import SettingsAdmins from '@/routes/admin/settings-admins';
import Offices from '@/routes/admin/offices';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminLayout />}>

            <Route index element={<Overview />} />

            <Route path="students" element={<Students />} />
            <Route path="students/logs" element={<StudentsLog />} />

            <Route path="gatepass" element={<Visitors />} />
            <Route path="gatepass/logs" element={<VisitorsLog />} />

            <Route path="offices" element={<Offices />} />

            <Route path="settings" element={<Settings />} />
            <Route path="settings/admins" element={<SettingsAdmins />} />

          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}
