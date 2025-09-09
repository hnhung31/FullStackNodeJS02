const Category = require('../models/category');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({
            EC: 0,
            EM: 'Lấy danh sách danh mục thành công',
            DT: categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi server khi lấy danh mục'
        });
    }
};

module.exports = {
    getAllCategories
};