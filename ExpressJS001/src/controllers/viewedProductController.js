const { getViewedProductsService } = require('../services/viewedProductService');

const getViewedProducts = async (req, res) => {
    // === SỬA LẠI DÒNG NÀY CHO ĐÚNG ===
    const userId = req.user ? req.user._id : null;
    // ===================================

    // Thêm bước kiểm tra để đảm bảo an toàn
    if (!userId) {
        // Trả về mảng rỗng nếu không có user, component sẽ tự ẩn đi
        return res.status(200).json({ EC: 0, data: { products: [] } });
    }
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await getViewedProductsService(userId, page, pageSize);
    return res.status(200).json(result);
};

module.exports = { getViewedProducts };
