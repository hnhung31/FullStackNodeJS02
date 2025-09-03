import { Card, Button, Space, Typography, Spin, message, Table } from 'antd';
import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../utils/api';

const { Title } = Typography;

const UserPage = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
        pageSizeOptions: ['5', '10', '20', '50'],
    });

    const fetchUsers = useCallback(async (page = 1, pageSize = 10, showMessage = false) => {
        try {
            setLoading(true);
            const res = await getUsersApi(page, pageSize);
            if (res && res.users) {
                setUserList(res.users);
                setPagination(prev => ({
                    ...prev,
                    current: res.pagination.current,
                    pageSize: res.pagination.pageSize,
                    total: res.pagination.total,
                }));
                if (showMessage) message.success('Làm mới danh sách thành công');
            } else if (Array.isArray(res)) {
                // Fallback for old API response format
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
        fetchUsers(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange = (paginationParams) => {
        fetchUsers(paginationParams.current, paginationParams.pageSize);
    };

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
                            <Button onClick={() => fetchUsers(pagination.current, pagination.pageSize, true)} loading={loading}>Làm mới</Button>
                            <Button type="primary" onClick={handleBackHome}>Về trang chủ</Button>
                        </Space>
                        <Table
                            dataSource={userList}
                            columns={columns}
                            rowKey="_id"
                            loading={loading}
                            bordered
                            pagination={pagination}
                            onChange={handleTableChange}
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default UserPage;
