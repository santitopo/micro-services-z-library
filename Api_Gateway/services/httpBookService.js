const axios = require('axios');
const config = require('../config');

const customAxios = axios.create({
    baseURL: config.urlBookService
});
module.exports = {
    get: customAxios.get,
    post: customAxios.post,
    put: customAxios.put,
    delete: customAxios.delete
};