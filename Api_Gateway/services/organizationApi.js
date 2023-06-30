const http = require('./httpOrganizationService');

async function getOrganizationInfo (organizationId, headers) {
    const response = await http.get(`/organizations/${organizationId}`);
    return response.data === '' ? null : response.data;
}

async function refreshApiKey (organizationId, headers) {
    const response = await http.get(`/organizations/${organizationId}/refresh-key`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function getOrgIdWithApiKey (url) {
    const response = await http.get(url);
    return response.data === '' ? null : response.data;
}

module.exports = {
    getOrganizationInfo,
    refreshApiKey,
    getOrgIdWithApiKey
}