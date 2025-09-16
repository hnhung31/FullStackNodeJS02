// /components/ViewedProducts.js
import { useState, useEffect, useContext } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getViewedProductsApi } from '../utils/api';
import { AuthContext } from '../components/context/auth.context';

const { Title } = Typography;

const ViewedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        // Chỉ fetch khi người dùng đã đăng nhập
        if (auth.isAuthenticated) {
            const fetchViewedProducts = async () => {
                setLoading(true);
                try {
                    const res = await getViewedProductsApi(1, 5); // Lấy 5 sản phẩm gần nhất
                    if (res && res.EC === 0) {
                        setProducts(res.data.products);
                    }
                } catch (error) {
                    console.error("Failed to fetch viewed products:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchViewedProducts();
        }
    }, [auth.isAuthenticated]); // Chạy lại khi trạng thái đăng nhập thay đổi

    if (!auth.isAuthenticated || products.length === 0) {
        return null; // Không hiển thị gì nếu chưa đăng nhập hoặc chưa xem sản phẩm nào
    }

    if (loading) {
        return <div style={{ textAlign: 'center', margin: '20px 0' }}><Spin /></div>;
    }

    return (
        <div style={{ marginBottom: 32 }}>
            <Title level={3}>Sản phẩm đã xem gần đây</Title>
            <List
                grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5, xl: 5, xxl: 5 }}
                dataSource={products}
                renderItem={(item) => (
                    <List.Item key={item._id}>
                        <Link to={`/product/${item._id}`}>
                            <Card
                                hoverable
                                cover={<img alt={item.name} src={item.imageUrl || 'https://via.placeholder.com/250'} style={{ height: 200, objectFit: 'cover' }} />}
                            >
                                <Card.Meta title={item.name} description={`${item.price ? item.price.toLocaleString() : 'N/A'} VNĐ`} />
                            </Card>
                        </Link>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ViewedProducts;