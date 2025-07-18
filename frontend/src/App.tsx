import React, { useEffect } from 'react';
import Fab from '@mui/material/Fab';
import { ToastContainer } from 'react-toastify';
import { usePathname } from './components/routes/hooks';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './components/admin/theme/theme-provider';
import { Iconify } from './components/admin/components/iconify';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// ----------------------------------------------------------------------

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h1>Đã xảy ra lỗi. Vui lòng tải lại trang.</h1>;
        }
        return this.props.children;
    }
}

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  const githubButton = () => (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        position: 'fixed',
        bgcolor: 'grey.800',
      }}
    >
      <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
    </Fab>
  );

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Header />
          <ToastContainer />
          <main style={{ minHeight: '80vh' }}>{children}</main>
          <Footer />
          {githubButton()}
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}