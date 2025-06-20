import type { RouteObject } from 'react-router';
import '../../index.css'
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from '../admin/layouts/auth';
import { DashboardLayout } from '../admin/layouts/dashboard';
import Home from '../Home';
// import {RegistrationPage} from "../client/register/RegistrationPage.tsx";
import {RegistrationPage} from "../client/register/RegistrationPage.tsx";
import {LoginPage} from "../client/login/LoginPage.tsx";

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('../admin/pages/dashboard'));
export const ShowTimeAdmin = lazy(() => import('../admin/pages/ShowTimeAdmin'));
export const UserPage = lazy(() => import('../admin/pages/user'));
export const SignInPage = lazy(() => import('../admin/pages/sign-in'));
export const ProductsPage = lazy(() => import('../admin/pages/products'));
export const Page404 = lazy(() => import('../admin/pages/page-not-found'));
export const RoomAdmin = lazy(() => import('../admin/pages/RoomAdmin'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
   {
    path: '/',
    element: (
      <Suspense fallback={renderFallback()}>
        <Home />
      </Suspense>
    ),
  },
  {
    path:'/admin/',
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'showtime', element: <ShowTimeAdmin /> },
      { path: 'room', element: <RoomAdmin /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
    {
        path: 'register',
        element: <RegistrationPage/>
    },
    {
      path: 'login',
      element: <LoginPage/>
    },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },

];
