import { Card, Descriptions, Button, Space, Typography, Tag, Spin, message } from 'antd';
import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getAccountApi } from '../utils/api';

const { Title } = Typography;

const ProfilePage = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const fetchAccount = useCallback(async (showMessage = false) => {
        try {
            setLoading(true);
            const res = await getAccountApi();
            if (res && res.email) {
                setAuth({
                    isAuthenticated: true,
                    user: { email: res.email, name: res.name }
                });
                if (showMessage) message.success('Làm mới thông tin thành công');
            } else {
                setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
                if (showMessage) message.warning('Phiên đăng nhập đã hết hạn');
                navigate('/login');
            }
        } catch (e) {
            console.error('fetchAccount error', e);
            message.error('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    }, [navigate, setAuth]);

    useEffect(() => {
        if (!auth.user?.email) {
            fetchAccount();
        }
    }, [auth.user, fetchAccount]);

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 16px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Trang cá nhân</Title>
            <Card bordered hoverable>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin /></div>
                ) : auth.isAuthenticated ? (
                    <>
                        <Descriptions column={1} size="middle" labelStyle={{ fontWeight: 500 }}>
                            <Descriptions.Item label="Họ tên">{auth.user?.name || <Tag color="red">Chưa có</Tag>}</Descriptions.Item>
                            <Descriptions.Item label="Email">{auth.user?.email}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái"><Tag color="green">Đã đăng nhập</Tag></Descriptions.Item>
                        </Descriptions>
                        <Space style={{ marginTop: 24 }}>
                            <Button onClick={() => fetchAccount(true)} loading={loading}>Làm mới</Button>
                            <Button type="primary" onClick={handleBackHome}>Về trang chủ</Button>
                        </Space>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <Tag color="orange" style={{ marginBottom: 24 }}>Bạn chưa đăng nhập</Tag>
                        <div><Button type="primary" onClick={() => navigate('/login')}>Đăng nhập</Button></div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProfilePage;
