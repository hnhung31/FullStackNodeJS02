const Product = require('../models/product');
const esClient = require('../../es-config');

const getAllProductsService = async (page, pageSize, categoryId) => {
    try {
        const filter = {};
        // Nếu có categoryId được truyền vào, thêm nó vào bộ lọc
        if (categoryId) {
            filter.category = categoryId;
        }

        const skip = (page - 1) * pageSize;

        // Lấy tổng số sản phẩm khớp với bộ lọc để tính toán số trang
        const totalProducts = await Product.countDocuments(filter);

        // Lấy danh sách sản phẩm đã được phân trang và lọc
        const products = await Product.find(filter)
            .populate('category', 'name') // Lấy thêm thông tin 'name' từ model Category
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        return {
            EC: 0,
            EM: "Lấy danh sách sản phẩm thành công",
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    total: totalProducts,
                    totalPages: Math.ceil(totalProducts / pageSize)
                }
            }
        };

    } catch (error) {
        console.log(error);
        return { EC: -1, EM: "Lỗi server khi lấy sản phẩm" };
    }
};
const searchProductsService = async (params) => {
    const { q, category, minPrice, maxPrice, page = 1, pageSize = 8 } = params;
    
    const mustQueries = [];
    const filterQueries = [];

    // 1. FUZZY SEARCH trên tên sản phẩm
    if (q) {
        mustQueries.push({
            match: {
                name: {
                    query: q,
                    fuzziness: "AUTO" // Phép màu nằm ở đây!
                }
            }
        });
    }

    // 2. LỌC theo danh mục, giá,...
    if (category) {
        filterQueries.push({ term: { "category._id": category } });
    }
    if (minPrice || maxPrice) {
        const rangeQuery = {};
        if (minPrice) rangeQuery.gte = parseFloat(minPrice);
        if (maxPrice) rangeQuery.lte = parseFloat(maxPrice);
        filterQueries.push({ range: { price: rangeQuery } });
    }

    try {
        const { body } = await esClient.search({
            index: 'products',
            from: (page - 1) * pageSize,
            size: pageSize,
            body: {
                query: {
                    bool: {
                        must: mustQueries, // Các điều kiện TÌM KIẾM
                        filter: filterQueries // Các điều kiện LỌC
                    }
                }
            }
        });

        const products = body.hits.hits.map(hit => hit._source);
        const totalProducts = body.hits.total.value;
        
        return {
            EC: 0, EM: "Tìm kiếm thành công",
            DT: {
                products,
                pagination: {
                    currentPage: page, pageSize,
                    total: totalProducts,
                    totalPages: Math.ceil(totalProducts / pageSize)
                }
            }
        };
    } catch (error) {
        console.error("Lỗi Elasticsearch: ", error.meta.body.error);
        return { EC: -1, EM: "Lỗi server khi tìm kiếm sản phẩm" };
    }
};
module.exports = {
    getAllProductsService,
    searchProductsService
};