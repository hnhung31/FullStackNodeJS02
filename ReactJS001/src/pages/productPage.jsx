import { useState, useEffect } from 'react';
import { List, Card, Spin, Select, Pagination, Typography, Col, Row, Input, InputNumber, Space } from 'antd';
import { searchProductsApi, getCategoriesApi } from '../utils/api';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debouncedPriceFilter, setDebouncedPriceFilter] = useState({ min: '', max: '' });
    
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedPriceFilter(priceFilter);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 800);
        return () => clearTimeout(timerId);
    }, [priceFilter]);

    useEffect(() => {
        // Lấy danh sách danh mục
        const fetchCategories = async () => {
            try {
                const res = await getCategoriesApi();
                if (res && res.EC === 0) { // Giả định interceptor cũng hoạt động ở đây
                    setCategories(res.DT);
                }
            } catch (error) { console.error("Failed to fetch categories:", error); }
        };
        fetchCategories();
        fetchProducts(1, filters); // Tải dữ liệu lần đầu
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await searchProductsApi(
                    pagination.currentPage,
                    pagination.pageSize,
                    selectedCategory,
                    debouncedSearchTerm,
                    sortBy,
                    debouncedPriceFilter.min,
                    debouncedPriceFilter.max
                );
                
                // === SỬA LẠI THEO ĐÚNG CẤU TRÚC RESPONSE ĐÃ BÓC VỎ ===
                const productsData = res?.data?.products;
                const paginationData = res?.data?.pagination;

                // res bây giờ là response đã được bóc vỏ, nên check res.EC trực tiếp
                if (res && res.EC === 0 && Array.isArray(productsData)) {
                    setProducts(productsData);
                    setPagination(prev => ({ ...prev, total: paginationData.total }));
                } else {
                    setProducts([]);
                    setPagination(prev => ({ ...prev, total: 0 }));
                }
            } catch (error) {
                console.error("Failed to search products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pagination.currentPage, pagination.pageSize, selectedCategory, debouncedSearchTerm, sortBy, debouncedPriceFilter]);

    // --- Handlers ---
    const handleCategoryChange = (value) => setSelectedCategory(value || null);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (value) => setSortBy(value || null);
    const handlePriceChange = (name, value) => {
        setPriceFilter(prev => ({ ...prev, [name]: value }));
    };
    const handlePageChange = (page, pageSize) => setPagination(prev => ({ ...prev, currentPage: page, pageSize: pageSize }));

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Danh sách sản phẩm</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="bottom">
                <Col>
                    <Title level={5} style={{ margin: 0 }}>Tìm kiếm</Title>
                    <Input.Search placeholder="Tên sản phẩm..." value={searchTerm} onChange={handleSearchChange} style={{ width: 250 }} allowClear enterButton />
                </Col>
                <Col>
                    <Title level={5} style={{ margin: 0 }}>Danh mục</Title>
                    <Select placeholder="Tất cả" style={{ width: 150 }} onChange={handleCategoryChange} allowClear>
                        {categories.map(cat => <Option key={cat._id} value={cat.name}>{cat.name}</Option>)}
                    </Select>
                </Col>
                <Col>
                     <Title level={5} style={{ margin: 0 }}>Khoảng giá</Title>
                    <Space.Compact>
                        <InputNumber
                            placeholder="Từ"
                            value={priceFilter.min}
                            onChange={(value) => handlePriceChange('min', value)}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: 120 }}
                        />
                        <InputNumber
                            placeholder="Đến"
                            value={priceFilter.max}
                            onChange={(value) => handlePriceChange('max', value)}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: 120 }}
                        />
                    </Space.Compact>
                </Col>
                <Col>
                    <Title level={5} style={{ margin: 0 }}>Sắp xếp</Title>
                    <Select placeholder="Mặc định" style={{ width: 180 }} onChange={handleSortChange} allowClear>
                        <Option value="price_asc">Giá: Tăng dần</Option>
                        <Option value="price_desc">Giá: Giảm dần</Option>
                    </Select>
                </Col>
            </Row>
            
            {loading ? (
                <div style={{ textAlign: 'center', margin: '20px 0' }}><Spin size="large" /></div>
            ) : (
                <>
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                        dataSource={products}
                        renderItem={(item) => (
                            <List.Item key={item._id}>
                                <Card
                                    hoverable
                                    cover={<img alt={item.name} src={item.imageUrl || 'https://via.placeholder.com/250'} style={{ height: 250, objectFit: 'cover' }} />}
                                >
                                    <Card.Meta title={item.name} description={`${item.price ? item.price.toLocaleString() : 'N/A'} VNĐ`} />
                                </Card>
                            </List.Item>
                        )}
                        locale={{ emptyText: 'Không tìm thấy sản phẩm nào' }}
                    />
                    <Row justify="center" style={{ marginTop: 24 }}>
                        <Col>
                            <Pagination current={pagination.currentPage} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} showSizeChanger responsive />
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default ProductPage;