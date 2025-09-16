const { toggleFavoriteService, getFavoriteProductsService } = require('../services/favoriteService');

const toggleFavorite = async (req, res) => {
    const userId = req.user.id || req.user._id; 
    console.log("Request Body:", req.body); 

    const { productId } = req.body;
    console.log("Extracted Product ID:", productId); // KIỂM TRA productId

    if (!userId || !productId) {
        return res.status(400).json({ EC: -1, EM: "Thiếu thông tin người dùng hoặc sản phẩm." });
    }

    const result = await toggleFavoriteService(userId, productId);
    return res.status(200).json(result);
};

const getFavoriteProducts = async (req, res) => {
    const userId = req.user.id || req.user._id;

    if (!userId) {
        return res.status(400).json({ EC: -1, EM: "Thiếu thông tin người dùng." });
    }
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await getFavoriteProductsService(userId, page, pageSize);
    return res.status(200).json(result);
};

module.exports = { toggleFavorite, getFavoriteProducts };