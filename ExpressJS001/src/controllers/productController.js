const { getAllProductsService } = require('../services/productService');
const { esClient } = require('../config/elasticsearch'); 

const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8; 
    const category = req.query.category;

    const data = await getAllProductsService(page, pageSize, category);
    return res.status(200).json(data);
};

const searchProducts = async (req, res) => {
    try {
        const {
            q, 
            category, 
            minPrice,
            maxPrice,
            sortBy, 
            page = 1, 
            limit = 10 
        } = req.query;

        const mustClauses = [];
        const filterClauses = [];

        if (q) {
            mustClauses.push({
                multi_match: {
                    query: q,
                    fields: ["name", "description"],
                    fuzziness: "AUTO" 
                }
            });
        }

        if (category) {
            filterClauses.push({
                match: { 
                    "category": category
                }
            });
        }

        if (minPrice || maxPrice) {
            const priceRange = {};
            if (minPrice) priceRange.gte = parseFloat(minPrice);
            if (maxPrice) priceRange.lte = parseFloat(maxPrice);
            filterClauses.push({ range: { price: priceRange } });
        }
        
        let sortOption = [{ "_score": "desc" }];
        if (sortBy) {
            if (sortBy === 'price_asc') sortOption = [{ "price": "asc" }];
            if (sortBy === 'price_desc') sortOption = [{ "price": "desc" }];
        }

        const from = (Number(page) - 1) * Number(limit);

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

        console.log(">>> Sending this query to ES:", JSON.stringify(esQueryBody, null, 2));

        const results = await esClient.search({
            index: 'products',
            body: esQueryBody
        });

        const products = results.hits.hits.map(hit => hit._source);
        const total = results.hits.total.value;

        return res.status(200).json({
            EC: 0,
            message: 'Search successful',
            data: {
                products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            EC: -1,
            message: 'An error occurred during search'
        });
    }
};
module.exports = {
    getAllProducts, searchProducts
};