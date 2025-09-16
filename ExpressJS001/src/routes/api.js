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

router.get('/:id', productController.getProductById);
router.get('/:id/similar', productController.getSimilarProducts);

router.get('/', auth, favoriteController.getFavoriteProducts);
router.post('/toggle', auth, favoriteController.toggleFavorite);

router.get('/', authMiddleware, viewedProductController.getViewedProducts);

module.exports = routerAPI;
