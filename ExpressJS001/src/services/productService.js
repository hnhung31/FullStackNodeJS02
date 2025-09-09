const Product = require('../models/product');

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

module.exports = {
    getAllProductsService
};