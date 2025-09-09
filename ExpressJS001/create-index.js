// create-index.js
const client = require('./es-config');

async function createProductIndex() {
    const indexName = 'products';
    const indexExists = await client.indices.exists({ index: indexName });

    if (indexExists) {
        console.log(`Index "${indexName}" đã tồn tại. Đang xóa...`);
        await client.indices.delete({ index: indexName });
    }

    console.log(`Đang tạo index "${indexName}"...`);
    await client.indices.create({
        index: indexName,
        body: {
            mappings: {
                properties: {
                    name: { type: 'text' }, // Dùng cho Fuzzy Search
                    description: { type: 'text' },
                    price: { type: 'double' }, // Dùng để lọc theo khoảng
                    imageUrl: { type: 'keyword', index: false },
                    category: {
                        properties: {
                            _id: { type: 'keyword' }, // Dùng để lọc chính xác
                            name: { type: 'keyword' }
                        }
                    }
                }
            }
        }
    });
    console.log(`Index "${indexName}" đã được tạo thành công.`);
}

createProductIndex().catch(console.error);