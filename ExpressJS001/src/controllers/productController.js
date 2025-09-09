const { getAllProductsService } = require('../services/productService');

const getAllProducts = async (req, res) => {
    // Lấy các tham số từ query string, có giá trị mặc định
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8; // Mặc định 8 sản phẩm mỗi trang
    const category = req.query.category; // Lọc theo categoryId

    const data = await getAllProductsService(page, pageSize, category);
    return res.status(200).json(data);
};

module.exports = {
    getAllProducts
};