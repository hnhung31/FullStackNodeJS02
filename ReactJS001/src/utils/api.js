import axios from './axios.customize';

export const createUserApi = (name, email, password) => {
    return axios.post("/v1/api/register", { name, email, password });
};

export const loginApi = (email, password) => {
    return axios.post("/v1/api/login", { email, password });
};

export const getAccountApi = () => {
    return axios.get("/v1/api/account");
};

export const getUsersApi = (page = 1, pageSize = 10) => {
    return axios.get(`/v1/api/user?page=${page}&pageSize=${pageSize}`);
};

export const getProductsApi = (page, pageSize, category) => {
    let url = `/v1/api/products?page=${page}&pageSize=${pageSize}`;
    if (category) {
        url += `&category=${category}`;
    }
    return axios.get(url);
};

export const getCategoriesApi = () => {
    return axios.get(`/v1/api/categories`);
};

export const searchProductsApi = (page, limit, category, searchTerm, sortBy, minPrice, maxPrice) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    // Chỉ thêm tham số nếu nó có giá trị
    if (category) params.append('category', category);
    if (searchTerm) params.append('q', searchTerm);
    if (sortBy) params.append('sortBy', sortBy);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    return axios.get(`/v1/api/search?${params.toString()}`);
};

export const getProductByIdApi = (productId) => {
    return axios.get(`/v1/api/products/${productId}`);
};

export const getSimilarProductsApi = (productId) => {
    return axios.get(`/v1/api/products/${productId}/similar`);
};

export const getFavoriteProductsApi = (page = 1, limit = 10) => {
    return axios.get(`/v1/api/favorites?page=${page}&limit=${limit}`);
};

export const toggleFavoriteApi = (productId) => {
    return axios.post(`/v1/api/favorites/toggle`, { productId });
};


export const getViewedProductsApi = (page = 1, limit = 5) => {
    return axios.get(`/v1/api/viewed-products?page=${page}&limit=${limit}`);
};