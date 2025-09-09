// src/config/elasticsearch.js

const { Client } = require('@elastic/elasticsearch');

const esHost = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';

const esClient = new Client({ node: esHost });

// (Tùy chọn) Kiểm tra kết nối khi khởi động
esClient.ping()
    .then(() => console.log('>>> Elasticsearch client is connected!'))
    .catch(error => console.error('>>> Elasticsearch connection error:', error));

module.exports = { esClient };