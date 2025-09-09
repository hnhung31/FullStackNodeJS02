// indexer.js
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/product');
const esClient = require('./es-config');

async function syncMongoToES() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB đã kết nối để đồng bộ.');

        // Lấy tất cả sản phẩm và thông tin danh mục liên quan
        const products = await Product.find({}).populate('category', 'name').lean();
        if (products.length === 0) {
            console.log("Không tìm thấy sản phẩm nào trong MongoDB.");
            return;
        }

        const body = products.flatMap(doc => [
            { index: { _index: 'products', _id: doc._id.toString() } },
            doc
        ]);

        console.log(`Đang lập chỉ mục cho ${products.length} sản phẩm...`);
        await esClient.bulk({ refresh: true, body });
        console.log('Đồng bộ dữ liệu thành công!');

    } catch (error) {
        console.error('Lỗi trong quá trình đồng bộ:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB đã ngắt kết nối.');
    }
}

syncMongoToES();