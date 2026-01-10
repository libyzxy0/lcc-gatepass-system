import { Routes, Route, Navigate } from "react-router";
import AdminLayout from '@/layouts/admin';
import Overview from '@/pages/overview';
import StudentsLog from '@/pages/students-log';
import Students from '@/pages/students';
import Logs from '@/pages/logs';
import Gatepass from '@/pages/gatepass';
import Visitors from '@/pages/visitors';
import ProtectedRoute from '@/pages/protected-route';
import Login from '@/pages/login';
import NotFound from '@/pages/not-found';
import Settings from '@/pages/settings';
import SettingsAdmins from '@/pages/settings-admins';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"

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

            <Route path="gatepass" element={<Gatepass />} />
            <Route path="visitors" element={<Visitors />} />
            <Route path="logs" element={<Logs />} />

            <Route path="settings" element={<Settings />} />
            <Route path="settings/admins" element={<SettingsAdmins />} />

          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}
