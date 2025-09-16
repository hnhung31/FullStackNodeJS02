import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, Typography, Spin, Divider, Statistic, Button, message, List, Card } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, MessageOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { getProductByIdApi, getSimilarProductsApi, toggleFavoriteApi } from '../utils/api';
import { AuthContext } from '../components/context/auth.context';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                // Fetch đồng thời chi tiết sản phẩm và sản phẩm tương tự
                const [productRes, similarRes] = await Promise.all([
                    getProductByIdApi(id),
                    getSimilarProductsApi(id)
                ]);

                if (productRes && productRes.EC === 0) {
                    setProduct(productRes.data);
                    if (auth.isAuthenticated) {
                        const userLiked = productRes.data.likes.includes(auth.user.id);
                        setIsFavorited(userLiked);
                    }
                }

                if (similarRes && similarRes.EC === 0) {
                    setSimilarProducts(similarRes.data);
                }

            } catch (error) {
                message.error("Không thể tải thông tin sản phẩm.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
        window.scrollTo(0, 0);
    }, [id, auth]);

    const handleToggleFavorite = async () => {
        if (!auth.isAuthenticated) {
            message.warn("Vui lòng đăng nhập để thực hiện chức năng này.");
            return;
        }
        setIsFavorited(prev => !prev);
        try {
            const res = await toggleFavoriteApi(id);
            if (res && res.EC === 0) {
                message.success(res.EM);
            } else {
                // Nếu API trả về lỗi logic, hoàn tác lại trạng thái
                message.error(res.EM || "Đã có lỗi xảy ra.");
                setIsFavorited(prev => !prev);
            }
        } catch (error) {
            message.error("Đã có lỗi xảy ra.");
            setIsFavorited(prev => !prev);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (!product) {
        return <Title level={2} style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm</Title>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={10}>
                    <Image width="100%" src={product.imageUrl || 'https://via.placeholder.com/500'} />
                </Col>
                <Col xs={24} md={14}>
                    <Title level={2}>{product.name}</Title>
                    <Text type="secondary">Danh mục: {product.category?.name || 'N/A'}</Text>
                    <Divider />
                    <Title level={3} style={{ color: '#c0392b' }}>{product.price.toLocaleString()} VNĐ</Title>
                    <Paragraph>{product.description}</Paragraph>
                    <Divider />
                    <Row gutter={16}>
                        <Col><Statistic title="Lượt xem" value={product.views} prefix={<EyeOutlined />} /></Col>
                        <Col><Statistic title="Đã mua" value={product.purchases} prefix={<ShoppingCartOutlined />} /></Col>
                        <Col><Statistic title="Bình luận" value={product.commentsCount} prefix={<MessageOutlined />} /></Col>
                    </Row>
                    <Divider />
                    <Button
                        type="primary"
                        danger
                        icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
                        size="large"
                        onClick={handleToggleFavorite}
                    >
                        {isFavorited ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                    </Button>
                </Col>
            </Row>

            <Divider />

            <Title level={3}>Sản phẩm tương tự</Title>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }}
                dataSource={similarProducts}
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
                locale={{ emptyText: 'Không có sản phẩm tương tự' }}
            />
        </div>
    );
};

export default ProductDetailPage;