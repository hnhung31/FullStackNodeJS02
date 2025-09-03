import { Card, Button, Space, Typography, Spin, message, Table } from 'antd';
import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../utils/api';

const { Title } = Typography;

const UserPage = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);

    const fetchUsers = useCallback(async (showMessage = false) => {
        try {
            setLoading(true);
            const res = await getUsersApi();
            if (Array.isArray(res)) {
                setUserList(res);
                if (showMessage) message.success('Làm mới danh sách thành công');
            } else {
                // Handle cases where the token might be invalid
                message.error(res.message || 'Không thể tải danh sách người dùng.');
                if (res.EC === -1 || res.status === 401) { // Assuming backend returns specific error codes
                    setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
                    navigate('/login');
                }
            }
        } catch (e) {
            console.error('fetchUsers error', e);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [navigate, setAuth]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBackHome = () => {
        navigate('/');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    return (
        <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 16px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Danh sách người dùng</Title>
            <Card bordered hoverable>
                {loading && userList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Spin />
                    </div>
                ) : (
                    <>
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={() => fetchUsers(true)} loading={loading}>Làm mới</Button>
                            <Button type="primary" onClick={handleBackHome}>Về trang chủ</Button>
                        </Space>
                        <Table
                            dataSource={userList}
                            columns={columns}
                            rowKey="_id"
                            loading={loading}
                            bordered
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default UserPage;
