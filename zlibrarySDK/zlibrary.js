const OrganizationApi = require("./organizationApi");

const { ApiError, UnauthorizedError } = require("./errors");

class ZLibrary {
  constructor(apiURL, apiKey) {
    this.organizationApi = new OrganizationApi(apiURL);
    this.apiKey = apiKey;
    this.authenticated = false;
  }

  async authenticate() {
    try {
      const organizationId =
        await this.organizationApi.getOrganizationIdByApiKey(this.apiKey);
      const organization = await this.organizationApi.getOrganizationById(
        organizationId
      );
      if (!organization) {
        throw new UnauthorizedError(null, this.apiKey);
      }
      this.authenticated = true;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async topBooks() {
    try {
      if (!this.authenticated) {
        return { success: false, error: "Not Authenticated" };
      }
      const topBooks = await this.organizationApi.getTopBooksInOrg(this.apiKey);
      return { success: true, response: topBooks };
    } catch {
      return { success: false, error: "Unknown Error" };
    }
  }

  async reservationsOfBookBetween(isbn, dateFrom, dateTo) {
    try {
      if (!this.authenticated) {
        return { success: false, error: "Not Authenticated" };
      }
      const bookReservations =
        await this.organizationApi.reservationsOfBookBetween(
          isbn,
          dateFrom,
          dateTo,
          this.apiKey
        );
      return { success: true, response: bookReservations };
    } catch {
      return { success: false, error: "Unknown Error" };
    }
  }
}
module.exports = ZLibrary;
