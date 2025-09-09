import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProductPage from './productPage';

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            {auth.isAuthenticated ? (
                <ProductPage />
            ) : (
                <Result
                    status="info" // Bạn có thể dùng 'info' hoặc bỏ trống
                    subTitle="Vui lòng đăng nhập để tiếp tục sử dụng các tính năng."
                    extra={[
                        <Button type="primary" key="login" onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>,
                        <Button key="register" onClick={() => navigate('/register')}>
                            Đăng ký
                        </Button>
                    ]}
                />
            )}
        </div>
    );
};

export default HomePage;