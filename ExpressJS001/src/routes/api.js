const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const favoriteController = require('../controllers/favoriteController');
const viewedProductController = require('../controllers/viewedProductController');

const auth = require('../middleware/auth');

const routerAPI = express.Router();

// Các routes không cần xác thực token
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Các routes cần xác thực token
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, getAccount);


routerAPI.get('/search', productController.searchProducts);
routerAPI.get('/products', productController.getAllProducts);

routerAPI.get('/categories', categoryController.getAllCategories);
routerAPI.get('/products/search', productController.searchProducts);

routerAPI.get('/products/:id', productController.getProductById);
routerAPI.get('/products/:id/similar', productController.getSimilarProducts);

routerAPI.get('/favorites', auth, favoriteController.getFavoriteProducts);
routerAPI.post('/favorites/toggle', auth, favoriteController.toggleFavorite);

routerAPI.get('/viewed-products', auth, viewedProductController.getViewedProducts);

module.exports = routerAPI;
