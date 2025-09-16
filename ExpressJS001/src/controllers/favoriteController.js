const { toggleFavoriteService, getFavoriteProductsService } = require('../services/favoriteService');

const toggleFavorite = async (req, res) => {
    const result = await toggleFavoriteService(req.user.id, req.body.productId);
    return res.status(200).json(result);
};

const getFavoriteProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await getFavoriteProductsService(req.user.id, page, pageSize);
    return res.status(200).json(result);
};

module.exports = { toggleFavorite, getFavoriteProducts };