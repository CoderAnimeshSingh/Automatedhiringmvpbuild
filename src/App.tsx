import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ApplicationForm } from './components/ApplicationForm';
import { HRDashboard } from './components/HRDashboard';
import { LoginPage } from './components/LoginPage';
import { getSupabaseClient } from './utils/supabase/client';

const supabase = getSupabaseClient();

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/hr/login" element={<LoginPage />} />
        <Route
          path="/hr/dashboard"
          element={
            session ? (
              <HRDashboard session={session} onLogout={() => supabase.auth.signOut()} />
            ) : (
              <LoginPage />
            )
          }
        />
      </Routes>
    </Router>
  );
}