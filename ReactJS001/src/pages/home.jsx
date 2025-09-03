import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div style={{ padding: '50px' }}>
            {auth.isAuthenticated ? (
                <Result
                    status="success"
                    title={`Xin chào ${auth.user.name}!`}
                    subTitle="Bạn đã đăng nhập thành công."
                    extra={[
                        <Button type="primary" key="console" onClick={() => navigate('/')}>
                            Trang chủ
                        </Button>
                    ]}
                />
            ) : (
                <Result
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
