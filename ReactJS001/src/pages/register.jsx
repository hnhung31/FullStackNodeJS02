import { Form, Input, Button, notification, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { createUserApi } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
    const { name, email, password } = values;
    try {
        // Giả sử createUserApi trả về trực tiếp `res.data` từ axios
        const res = await createUserApi(name, email, password); 
        
        // Bây giờ chỉ cần kiểm tra mã lỗi (EC)
        if (res && res.EC === 0) {
            // Thành công
            notification.success({
                message: 'Đăng ký thành công',
                description: 'Bạn đã đăng ký tài khoản thành công. Vui lòng đăng nhập.',
            });
            navigate('/login');
        } else {
            // Thất bại, hiển thị thông báo lỗi (EM) từ chính backend
            notification.error({
                message: 'Đăng ký thất bại',
                description: res.EM || 'Có lỗi xảy ra, vui lòng thử lại sau',
            });
        }
    } catch (error) {
        // Xử lý lỗi mạng hoặc lỗi server nghiêm trọng (status 500)
        console.error('Register error:', error);
        notification.error({
            message: 'Đăng ký thất bại',
            description: error.response?.data?.EM || 'Có lỗi kết nối đến máy chủ.',
        });
    }
};

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                <Card title="Đăng ký tài khoản" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <Form
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;
