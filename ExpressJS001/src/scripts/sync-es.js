// src/scripts/sync-es.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product'); // Đảm bảo đường dẫn đúng
const Category = require('../models/category');
const { esClient } = require('../config/elasticsearch');

const syncData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('MongoDB connected for sync...');

        console.log('Fetching products and populating categories...');
        const products = await Product.find({})
            .populate('category', 'name') // Dùng populate để lấy tên category
            .lean();

        if (products.length === 0) {
            console.log('No products found. Nothing to sync.');
            return;
        }
        console.log(`Found ${products.length} products to sync.`);

        const body = products.flatMap(doc => {
            const { _id, ...productData } = doc;

            return [
                { index: { _index: 'products', _id: _id.toString() } },
                productData
            ];
        });
        
        console.log('Indexing data to Elasticsearch...');
        const bulkResponse = await esClient.bulk({ refresh: true, body });

        if (bulkResponse.errors) {
            console.error('--- BULK INDEXING FAILED ---');
            console.error(JSON.stringify(bulkResponse, null, 2));
        } else {
            console.log(`Successfully indexed ${products.length} documents.`);
        }

    } catch (error) {
        console.error('Error during synchronization:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
};

syncData();