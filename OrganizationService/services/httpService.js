const axios = require('axios');
const config = require('../config');

axios.defaults.baseURL = config.MEMBER_API;

module.exports = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};
