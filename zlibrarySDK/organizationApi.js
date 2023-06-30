const { ApiError } = require("./errors");
const axios = require("axios");

module.exports = class OrganizationApi {
  constructor(baseURL) {
    this.customAxios = axios.create({
      baseURL,
    });
  }
  async getOrganizationIdByApiKey(apiKey) {
    try {
      const response = await this.customAxios.get(`/organizations`, {
        params: { apiKey },
      });

      return response.data === "" ? null : response.data;
    } catch (e) {
      if (!e.response) {
        throw new ApiError(null, "Connection Error");
      } else {
        throw new ApiError(e.response.status, e.response.statusText);
      }
    }
  }
  async getOrganizationById(id) {
    try {
      const response = await this.customAxios.get(`/organizations/${id}`);
      return response.data === "" ? null : response.data;
    } catch (e) {
      if (!e.response) {
        throw new ApiError(null, "Connection Error");
      } else {
        throw new ApiError(e.response.status, e.response.statusText);
      }
    }
  }
  async getTopBooksInOrg(apiKey) {
    try {
      const response = await this.customAxios.get(`/books/top-books?amount=5`, {
        headers: {
          Authorization: apiKey,
        },
      });
      return response.data === "" ? null : response.data;
    } catch (e) {
      if (!e.response) {
        throw new ApiError(null, "Connection Error");
      } else {
        throw new ApiError(e.response.status, e.response.statusText);
      }
    }
  }

  async reservationsOfBookBetween(isbn, dateFrom, dateTo, apiKey) {
    try {
      const response = await this.customAxios.get(
        `/reservations/external-api`,
        {
          params: {
            isbn,
            dateFrom,
            dateTo,
          },
          headers: {
            Authorization: apiKey,
          },
        }
      );
      return response.data === "" ? null : response.data;
    } catch (e) {
      if (!e.response) {
        throw new ApiError(null, "Connection Error");
      } else {
        throw new ApiError(e.response.status, e.response.statusText);
      }
    }
  }
};
