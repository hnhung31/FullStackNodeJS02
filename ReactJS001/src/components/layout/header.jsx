import { Menu, message } from 'antd';
import { UserOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');

    const onClick = (e) => {
        setCurrent(e.key);
        if (e.key === 'home') {
            navigate('/');
        } else if (e.key === 'login') {
            navigate('/login');
        } else if (e.key === 'register') {
            navigate('/register');
        } else if (e.key === 'profile') {
            navigate('/profile');
        } else if (e.key === 'users') {
            navigate('/users');
        } else if (e.key === 'logout') {
            localStorage.removeItem('access_token');
            setAuth({
                isAuthenticated: false,
                user: { email: "", name: "" }
            });
            message.success("Đăng xuất thành công");
            navigate('/');
        }
    };

    const items = auth.isAuthenticated ? [
        {
            label: 'Home',
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: `Xin chào, ${auth.user.name}`,
            key: 'userMenu',
            icon: <UserOutlined />,
            children: [
                {
                    label: 'Trang cá nhân',
                    key: 'profile',
                    icon: <UserOutlined />,
                },
                {
                    label: 'Quản lý người dùng',
                    key: 'users',
                    icon: <UserOutlined />,
                },
                {
                    label: 'Đăng xuất',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                }
            ]
        }
    ] : [
        {
            label: 'Home',
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: 'Đăng nhập',
            key: 'login',
            icon: <LoginOutlined />,
        },
        {
            label: 'Đăng ký',
            key: 'register',
            icon: <UserAddOutlined />,
        }
    ];

    return (
        <Menu 
            onClick={onClick} 
            selectedKeys={[current]} 
            mode="horizontal" 
            items={items} 
            style={{ justifyContent: 'center' }}
        />
    );
};

export default Header;
