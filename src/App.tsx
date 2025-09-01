
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodboardEditor from './pages/MoodboardEditor';
import Room3DEditorPage from './pages/Room3DEditor';
import InspirationWall from './pages/InspirationWall';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Index route should redirect to home */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
              </Route>
              <Route path="/home" element={<Layout />}>
                <Route index element={<Home />} />
              </Route>
              <Route path="/login" element={<Layout />}>
                <Route index element={<Login />} />
              </Route>
              <Route path="/register" element={<Layout />}>
                <Route index element={<Register />} />
              </Route>
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/editor/:id" element={<MoodboardEditor />} />
              <Route path="/3d-editor/:id" element={<Room3DEditorPage />} />
              <Route path="/inspiration" element={<Layout />}>
                <Route index element={<InspirationWall />} />
              </Route>
              <Route path="*" element={<Layout />}>
                <Route index element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
