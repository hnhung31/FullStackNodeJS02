import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import HomePage from './pages/home.jsx';
import UsersPage from './pages/users.jsx';
import ProfilePage from './pages/profile.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import { ConfigProvider } from 'antd';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'profile', element: <ProfilePage /> },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider>
            <AuthWrapper>
                <RouterProvider router={router} />
            </AuthWrapper>
        </ConfigProvider>
    </React.StrictMode>,
);
