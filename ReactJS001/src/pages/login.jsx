import { Form, Input, Button, message, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginApi } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        try {
            const res = await loginApi(email, password);
            if (res && res.access_token) {
                localStorage.setItem('access_token', res.access_token);
                setAuth({
                    isAuthenticated: true,
                    user: res.user
                });
                message.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                message.error(res.EM || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Có lỗi xảy ra khi đăng nhập');
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                <Card title="Đăng nhập" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <Form
                        name="login"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;
