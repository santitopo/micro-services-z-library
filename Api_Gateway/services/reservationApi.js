const http = require('./httpReservationService');

async function createBook (body, headers) {
    const response = await http.post('/reservations/',body, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function getBookAvailability (url, headers) {
    const response = await http.get(`${url}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function updateBook (param, headers) {
    const response = await http.put(`/reservations/${param}`, {},{ headers: {'authorization': headers.authorization } });
    return response.data === '' ? null : response.data;
}

async function getStudentReservations (headers) {
    const response = await http.get('/reservations/student', {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function getOrganizationReservations (url, headers) {
    const response = await http.get(`${url}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function getOrganizationReservationsExternal (url, headers) {
    const response = await http.get(`${url}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

module.exports = {
    createBook,
    getBookAvailability,
    updateBook,
    getStudentReservations,
    getOrganizationReservations,
    getOrganizationReservationsExternal
}