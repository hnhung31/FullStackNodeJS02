import { useState, useEffect, useContext } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getViewedProductsApi } from '../utils/api';
import { AuthContext } from '../components/context/auth.context'; // Đảm bảo đường dẫn này đúng

const { Title } = Typography;

const ViewedProducts = () => {
    console.log("1. ViewedProducts component is rendering."); // DEBUG: KIỂM TRA XEM COMPONENT CÓ CHẠY KHÔNG

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext);

    console.log("2. Auth state inside ViewedProducts:", auth); // DEBUG: KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP

    useEffect(() => {
        if (auth.isAuthenticated) {
            const fetchViewedProducts = async () => {
                setLoading(true);
                try {
                    const res = await getViewedProductsApi(1, 5);
                    console.log("3. API Response for Viewed Products:", res); // DEBUG: KIỂM TRA KẾT QUẢ API

                    if (res && res.EC === 0 && res.data?.products) {
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
    }, [auth.isAuthenticated]);

    if (loading) {
        return <div style={{ textAlign: 'center', margin: '20px 0' }}><Spin /></div>;
    }

    if (!auth.isAuthenticated || products.length === 0) {
        return null;
    }
    
    return (
        <div style={{ marginBottom: 32, padding: '0 24px' }}>
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