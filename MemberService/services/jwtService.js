const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../errors');
const { logError } = require('../utils');
const secretKey = fs.readFileSync('secrets/private.key', 'utf8');
const publicKey = fs.readFileSync('secrets/public.key', 'utf8');

const signOptions = {
  expiresIn: config.tokenLife,
  algorithm: 'RS256'
};

module.exports = class JWTService {
  generateAuthToken(memberOrganization) {
    return this.sign({
      isAdmin: memberOrganization.is_admin,
      organizationId: memberOrganization.organization_id,
      memberId: memberOrganization.member_id
    });
  }
  generateRegistrationToken(memberId, organizationId, organizationName, email) {
    return this.sign({ memberId, organizationId, organizationName, email });
  }
  sign(content) {
    const token = jwt.sign(content, secretKey, signOptions);
    return token;
  }

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
};
