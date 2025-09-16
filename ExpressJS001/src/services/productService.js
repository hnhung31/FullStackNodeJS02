const Product = require('../models/product');
const ViewedProduct = require('../models/viewedProduct');
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
            data: {
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
    const { 
        q, category, minPrice, maxPrice, sortBy, 
        page = 1, limit = 5 
    } = params;
    
    const mustClauses = [];
    const filterClauses = [];

    // 1. TÌM KIẾM MỜ (Fuzzy Search)
    if (q) {
        mustClauses.push({
            multi_match: {
                query: q,
                fields: ["name", "description"],
                fuzziness: "AUTO" 
            }
        });
    }

    // 2. LỌC (Filtering)
    if (category) {
        filterClauses.push({ term: { "category._id": category } });
    }
    if (minPrice || maxPrice) {
        const priceRange = {};
        if (minPrice) priceRange.gte = parseFloat(minPrice);
        if (maxPrice) priceRange.lte = parseFloat(maxPrice);
        filterClauses.push({ range: { price: priceRange } });
    }
    
    // 3. SẮP XẾP (Sorting)
    let sortOption = [{ "_score": "desc" }];
    if (sortBy) {
        if (sortBy === 'price_asc') sortOption = [{ "price": "asc" }];
        if (sortBy === 'price_desc') sortOption = [{ "price": "desc" }];
    }

    // 4. PHÂN TRANG (Pagination)
    const from = (Number(page) - 1) * Number(limit);

    try {
        const esQueryBody = {
            query: {
                bool: {
                    must: mustClauses.length > 0 ? mustClauses : { match_all: {} },
                    filter: filterClauses
                }
            },
            sort: sortOption,
            from: from,
            size: Number(limit)
        };
        
        console.log(">>> Service is sending this query to ES:", JSON.stringify(esQueryBody, null, 2));

        const response = await esClient.search({
            index: 'products',
            body: esQueryBody
        });

        const products = response.hits.hits.map(hit => {
            return {
                ...hit._source, // Lấy tất cả các trường trong _source
                _id: hit._id     // Thêm trường _id từ cấp cao hơn
            };
        });
        const totalProducts = response.hits.total.value;
        
        return {
            EC: 0, EM: "Tìm kiếm thành công",
            data: {
                products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalProducts,
                    totalPages: Math.ceil(totalProducts / Number(limit))
                }
            }
        };
    } catch (error) {
        console.error("Lỗi Elasticsearch trong Service: ", error);
        return { EC: -1, EM: "Lỗi server khi tìm kiếm sản phẩm" };
    }
};

const getProductByIdService = async (productId, userId) => {
    try {
        const product = await Product.findById(productId).populate('category');
        if (!product) {
            return { EC: 1, EM: "Không tìm thấy sản phẩm" };
        }

        // 1. Tăng bộ đếm lượt xem công khai
        product.views += 1;
        await product.save();

        // 2. Nếu user đã đăng nhập, ghi lại lịch sử xem cá nhân
        if (userId) {
            await ViewedProduct.findOneAndUpdate(
                { user: userId, product: productId },
                { viewedAt: new Date() },
                { upsert: true } // Tạo mới nếu chưa có, cập nhật nếu đã có
            );
        }

        return { EC: 0, EM: "Lấy chi tiết sản phẩm thành công", data: product };
    } catch (error) {
        console.log(error);
        return { EC: -1, EM: "Lỗi server" };
    }
};

const getSimilarProductsService = async (productId) => {
    try {
        const product = await Product.findById(productId).populate('category');
        if (!product) {
            return { EC: 1, EM: "Sản phẩm không tồn tại" };
        }

        const response = await esClient.search({
            index: 'products',
            body: {
                size: 5, // Lấy 5 sản phẩm tương tự
                query: {
                    bool: {
                        must_not: { term: { "_id": productId } },
                        should: [
                            { term: { "category._id": product.category._id.toString() } },
                            { multi_match: { query: product.name, fields: ["name", "description"], fuzziness: "AUTO" } }
                        ]
                    }
                }
            }
        });

        const similarProducts = response.hits.hits.map(hit => hit._source);
        return { EC: 0, EM: "Lấy sản phẩm tương tự thành công", data: similarProducts };
    } catch (error) {
        console.error("Lỗi Elasticsearch: ", error);
        return { EC: -1, EM: "Lỗi server khi tìm sản phẩm tương tự" };
    }
};

const incrementPurchaseCount = async (productId) => {
    await Product.findByIdAndUpdate(productId, { $inc: { purchases: 1 } });
};

const incrementCommentCount = async (productId) => {
    await Product.findByIdAndUpdate(productId, { $inc: { commentsCount: 1 } });
};
module.exports = {
    getAllProductsService,
    searchProductsService,
    getProductByIdService,
    getSimilarProductsService,
    incrementPurchaseCount,
    incrementCommentCount
};