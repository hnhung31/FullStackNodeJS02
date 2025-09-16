const { getAllProductsService, searchProductsService, getProductByIdService, getSimilarProductsService } = require('../services/productService');
const { esClient } = require('../config/elasticsearch'); 

const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5; 
    const category = req.query.category;

    const data = await getAllProductsService(page, pageSize, category);
    return res.status(200).json(data);
};
const searchProducts = async (req, res) => {
    try {
        const params = req.query;
        const data = await searchProductsService(params);
        return res.status(200).json(data);

    } catch (error) {
        console.error('Search error in Controller:', error);
        return res.status(500).json({
            EC: -1,
            message: 'An error occurred during search'
        });
    }
};
const getProductById = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user ? req.user.id : null; 
    const result = await getProductByIdService(productId, userId);
    return res.status(result.EC === 0 ? 200 : 404).json(result);
};

const getSimilarProducts = async (req, res) => {
    const result = await getSimilarProductsService(req.params.id);
    return res.status(200).json(result);
};
module.exports = {
    getAllProducts, searchProducts, getProductById, getSimilarProducts
};