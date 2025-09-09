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