const ViewedProduct = require('../models/viewedProduct');

const getViewedProductsService = async (userId, page, pageSize) => {
    try {
        const skip = (page - 1) * pageSize;
        const totalViewed = await ViewedProduct.countDocuments({ user: userId });

        const history = await ViewedProduct.find({ user: userId })
            .sort({ viewedAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate('product');

        const products = history.map(item => item.product).filter(p => p != null);

        return {
            EC: 0,
            EM: "Lấy danh sách sản phẩm đã xem thành công",
            data: {
                products,
                pagination: { currentPage: page, totalPages: Math.ceil(totalViewed / pageSize) }
            }
        };
    } catch (error) {
        console.log(error);
        return { EC: -1, EM: "Lỗi server" };
    }
};

module.exports = { getViewedProductsService };