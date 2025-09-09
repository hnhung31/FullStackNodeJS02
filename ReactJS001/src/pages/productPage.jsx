import { useState, useEffect, useCallback } from 'react';
import { List, Card, Spin, Select, Pagination, Typography, Col, Row, Input, Slider, Button } from 'antd';
import { getCategoriesApi, searchProductsApi } from '../utils/api';
import debounce from 'lodash.debounce';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 8, total: 0 });

    // State cho các bộ lọc
    const [filters, setFilters] = useState({
        q: '',
        category: null,
        minPrice: 0,
        maxPrice: 100000000
    });

    // Hàm gọi API tìm kiếm
    const fetchProducts = async (page, currentFilters) => {
        setLoading(true);
        const params = { ...currentFilters, page, pageSize: pagination.pageSize };
        
        // Xóa các param rỗng để URL gọn gàng
        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === '') delete params[key];
        });

        const res = await searchProductsApi(params);
        if (res && res.EC === 0) {
            setProducts(res.DT.products);
            setPagination(res.DT.pagination);
        }
        setLoading(false);
    };

    // Dùng debounce để không gọi API liên tục khi người dùng gõ tìm kiếm
    const debouncedFetch = useCallback(debounce((nextFilters) => fetchProducts(1, nextFilters), 500), []);

    useEffect(() => {
        // Lấy danh sách danh mục
        const fetchCategories = async () => {
            const res = await getCategoriesApi();
            if (res && res.EC === 0) setCategories(res.DT);
        };
        fetchCategories();
        fetchProducts(1, filters); // Tải dữ liệu lần đầu
    }, []);

    const handleFilterChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        debouncedFetch(newFilters); // Gọi API sau 500ms
    };
    
    const handlePageChange = (page) => {
        setPagination(p => ({ ...p, currentPage: page }));
        fetchProducts(page, filters);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Danh sách sản phẩm</Title>
            
            {/* Filter Controls */}
            <Row gutter={[16, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                    <Search
                        placeholder="Tìm kiếm sản phẩm (vd: ipone)..."
                        onChange={e => handleFilterChange('q', e.target.value)}
                        enterButton
                    />
                </Col>
                <Col xs={24} md={6}>
                    <Select
                        placeholder="Chọn danh mục"
                        style={{ width: '100%' }}
                        onChange={value => handleFilterChange('category', value)}
                        allowClear
                    >
                        {categories.map(cat => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
                    </Select>
                </Col>
                <Col xs={24} md={10}>
                    <Typography.Text>Lọc theo giá (0 - 100 triệu):</Typography.Text>
                    <Slider
                        range
                        min={0}
                        max={100000000}
                        step={1000000}
                        defaultValue={[0, 100000000]}
                        onChangeComplete={([min, max]) => {
                            const newFilters = { ...filters, minPrice: min, maxPrice: max };
                            setFilters(newFilters);
                            fetchProducts(1, newFilters);
                        }}
                        tooltip={{ formatter: value => `${(value / 1000000).toLocaleString()} triệu` }}
                    />
                </Col>
            </Row>

            {loading ? <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div> : (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={products}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable
                                cover={<img alt={item.name} src={item.imageUrl || 'https://via.placeholder.com/200'} style={{ height: 200, objectFit: 'cover' }} />}
                            >
                                <Card.Meta title={item.name} description={`${item.price.toLocaleString()} VNĐ`} />
                            </Card>
                        </List.Item>
                    )}
                />
            )}
            
            <Row justify="center" style={{ marginTop: 24 }}>
                <Pagination
                    current={pagination.currentPage}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </Row>
        </div>
    );
};

export default ProductPage;