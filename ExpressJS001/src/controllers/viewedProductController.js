const { getViewedProductsService } = require('../services/viewedProductService');

const getViewedProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await getViewedProductsService(req.user.id, page, pageSize);
    return res.status(200).json(result);
};

module.exports = { getViewedProducts };
