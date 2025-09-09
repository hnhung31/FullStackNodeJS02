import { useState, useEffect } from 'react';
import { List, Card, Spin, Select, Pagination, Typography, Col, Row } from 'antd';
import { getProductsApi, getCategoriesApi } from '../utils/api';

const { Title } = Typography;
const { Option } = Select;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 4,
        total: 0,
        totalPages: 1,
    });

    // Chạy 1 lần đầu để lấy danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesApi();
            if (res && res.EC === 0) {
                setCategories(res.DT);
            }
        };
        fetchCategories();
    }, []);

    // Effect này sẽ chạy mỗi khi page hoặc category thay đổi
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const res = await getProductsApi(pagination.currentPage, pagination.pageSize, selectedCategory);
            if (res && res.EC === 0) {
                // *** Logic cho Lazy Loading: nối thêm sản phẩm vào danh sách cũ
                // setProducts(prevProducts => [...prevProducts, ...res.DT.products]);

                // *** Logic cho Phân trang: thay thế hoàn toàn danh sách sản phẩm
                setProducts(res.DT.products);

                setPagination(res.DT.pagination);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [pagination.currentPage, selectedCategory]);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setProducts([]); // Xóa sản phẩm cũ
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset về trang 1
    };

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({ ...prev, currentPage: page, pageSize: pageSize }));
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Danh sách sản phẩm</Title>
            <Select
                placeholder="Chọn danh mục"
                style={{ width: 200, marginBottom: 24 }}
                onChange={handleCategoryChange}
                allowClear
            >
                {categories.map(cat => (
                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                ))}
            </Select>

            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={products}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            hoverable
                            cover={<img alt={item.name} src={item.imageUrl || 'https://via.placeholder.com/150'} />}
                        >
                            <Card.Meta title={item.name} description={`${item.price.toLocaleString()} VNĐ`} />
                        </Card>
                    </List.Item>
                )}
            />

            {loading && <div style={{ textAlign: 'center' }}><Spin /></div>}

            {/* PHẦN HIỂN THỊ PHÂN TRANG - CHỌN 1 TRONG 2 CÁCH DƯỚI ĐÂY */}

            {/* ========================================================== */}
            {/* CÁCH 2: DÙNG PHÂN TRANG (PAGINATION) */}
            {/* ========================================================== */}
            <Row justify="center" style={{ marginTop: 24 }}>
                <Col>
                    <Pagination
                        current={pagination.currentPage}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={handlePageChange}
                        showSizeChanger
                    />
                </Col>
            </Row>

        </div>
    );
};

export default ProductPage;