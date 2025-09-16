import { useState, useEffect } from 'react';
import { List, Card, Spin, Pagination, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { getFavoriteProductsApi } from '../utils/api';

const { Title } = Typography;

const FavoriteProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const res = await getFavoriteProductsApi(pagination.currentPage, pagination.pageSize);
                if (res && res.EC === 0) {
                    setProducts(res.data.products);
                    setPagination(prev => ({ ...prev, total: res.data.pagination.total }));
                }
            } catch (error) {
                console.error("Failed to fetch favorite products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [pagination.currentPage, pagination.pageSize]);

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({ ...prev, currentPage: page, pageSize: pageSize }));
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Sản phẩm yêu thích của bạn</Title>
            {loading ? (
                <div style={{ textAlign: 'center', margin: '20px 0' }}><Spin size="large" /></div>
            ) : (
                <>
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                        dataSource={products}
                        renderItem={(item) => (
                            <List.Item key={item._id}>
                                <Link to={`/product/${item._id}`}>
                                    <Card
                                        hoverable
                                        cover={<img alt={item.name} src={item.imageUrl || 'https://via.placeholder.com/250'} style={{ height: 250, objectFit: 'cover' }} />}
                                    >
                                        <Card.Meta title={item.name} description={`${item.price ? item.price.toLocaleString() : 'N/A'} VNĐ`} />
                                    </Card>
                                </Link>
                            </List.Item>
                        )}
                        locale={{ emptyText: 'Bạn chưa có sản phẩm yêu thích nào.' }}
                    />
                    {pagination.total > 0 && (
                        <Row justify="center" style={{ marginTop: 24 }}>
                            <Col>
                                <Pagination current={pagination.currentPage} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} showSizeChanger responsive />
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </div>
    );
};

export default FavoriteProductsPage;