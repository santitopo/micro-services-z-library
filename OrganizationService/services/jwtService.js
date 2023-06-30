const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../errors');
const publicKey = fs.readFileSync('secrets/public.key', 'utf8');

module.exports = class JWTService {
  jwtDecode(token) {
    let ret;
    jwt.verify(token, publicKey, function (err, decoded) {
      if (err) {
        throw new UnauthorizedError(token);
      }
      ret = decoded;
    });
    return ret;
  }

  decodeAndFilterisAdmin(headers) {
    const token = headers['authorization'].split('Bearer ')[1];
    const decoded = this.jwtDecode(token);
    if (!decoded || !decoded.isAdmin || !decoded.organizationId) {
      throw new UnauthorizedError(token);
    }
    return decoded;
  }

  decode(headers) {
    const token = headers['authorization'].split('Bearer ')[1];
    const decoded = this.jwtDecode(token);
    if (!decoded || !decoded.organizationId) {
      throw new UnauthorizedError(token);
    }
    return decoded;
  }
};
