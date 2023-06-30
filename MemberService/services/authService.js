const {
  BadRequestError,
  AlreadyExistsError,
  ResourceNotFoundError,
  UnauthorizedError,
  NotExistError
} = require('../errors');
const crypto = require('crypto');
const config = require('../config');
const organizationApi = require('./organizationApi');

module.exports = class AuthService {
  constructor(repository, jwtService, mailingService) {
    this.repository = repository;
    this.jwtService = jwtService;
    this.mailingService = mailingService;
  }

  async addAdminAndNewOrganization(body) {
    if (
      !body ||
      !body.name ||
      !body.last_name ||
      !body.email ||
      !body.organization_name ||
      !body.password
    ) {
      throw new BadRequestError('add', 'admin');
    }
    const searchedMember = await this.repository.getMemberByEmail(body.email);
    if (searchedMember) {
      throw new AlreadyExistsError('email', body.email);
    }
    const searchedOrganization = await organizationApi.getOrganizationByName(
      body.organization_name
    );

    if (searchedOrganization) {
      throw new AlreadyExistsError('organization', body.organization_name);
    }
    const organizationId = await organizationApi.addOrganization(
      body.organization_name
    );

    const hash = crypto
      .createHash('md5')
      .update(body.password || '')
      .digest('hex');

    const memberId = await this.repository.addMember(
      body.name,
      body.last_name,
      body.email,
      hash
    );
    const isAdmin = true;
    const pendingInvite = false;
    await this.repository.addMemberOrganization(
      organizationId,
      memberId,
      isAdmin,
      pendingInvite
    );

    return memberId;
  }

  async login(body) {
    if (!body || !body.password || !body.email || !body.organization_id) {
      throw new BadRequestError('login', '');
    }
    const searchedMember = await this.repository.getMemberByEmail(body.email);
    if (!searchedMember) {
      throw new UnauthorizedError();
    }

    const hash = crypto
      .createHash('md5')
      .update(body.password || '')
      .digest('hex');

    if (searchedMember.password !== hash) {
      throw new UnauthorizedError();
    }

    const searchedOrg = await organizationApi.getOrganizationById(
      body.organization_id
    );

    if (!searchedOrg) {
      throw new UnauthorizedError();
    }

    const searchedMemberOrg = await this.repository.getMemberOrganization(
      body.organization_id,
      searchedMember.id
    );
    if (!searchedMemberOrg || searchedMemberOrg.pending_invite) {
      throw new UnauthorizedError();
    }

    const token = this.jwtService.generateAuthToken(searchedMemberOrg);
    return {
      token,
      userData: {
        email: body.email,
        name: searchedMember.name,
        lastname: searchedMember.lastname,
        mail_notifications: searchedMemberOrg.mail_notifications
      }
    };
  }

  decodeAndFilterisAdmin(headers) {
    const token = headers['authorization'].split('Bearer ')[1];
    const decoded = this.jwtService.jwtDecode(token);
    if (!decoded || !decoded.isAdmin || !decoded.organizationId) {
      throw new UnauthorizedError(token);
    }
    return decoded;
  }

  decode(headers) {
    const token = headers['authorization'].split('Bearer ')[1];
    const decoded = this.jwtService.jwtDecode(token);
    if (!decoded || !decoded.organizationId) {
      throw new UnauthorizedError(token);
    }
    return decoded;
  }

  decodeAndFilterPendingRegistrationToken(headers) {
    const token = headers['authorization'].split('Bearer ')[1];
    const decoded = this.jwtService.jwtDecode(token);
    if (!decoded || !decoded.memberId || !decoded.organizationId) {
      throw new UnauthorizedError(token);
    }
    return decoded;
  }

  async getMemberOrganizations(body) {
    if (!body || !body.password || !body.email) {
      throw new BadRequestError('login', '');
    }
    const hash = crypto
      .createHash('md5')
      .update(body.password || '')
      .digest('hex');

    const searchedMember = await this.repository.getMemberByEmail(body.email);
    if (!searchedMember || searchedMember.password !== hash) {
      throw new UnauthorizedError();
    }

    const memberOrganizations = await this.repository.getOrganizationsByMember(
      searchedMember.id
    );
    return memberOrganizations;
  }

  async addPendingRegistrationMember(body, memberId, organizationId) {
    const organizations = await this.repository.getOrganizationsByMember(
      memberId
    );
    if (
      !organizations.some(
        (org) => org.id === organizationId && org.pending_invite
      )
    ) {
      throw new UnauthorizedError(memberId);
    }
    const searchedMember = await this.repository.getMemberById(memberId);
    if (
      !searchedMember.name &&
      !searchedMember.lastname &&
      !searchedMember.password
    ) {
      if (!body || !body.name || !body.last_name || !body.password) {
        throw new BadRequestError('add', 'member');
      }
      const hash = crypto
        .createHash('md5')
        .update(body.password || '')
        .digest('hex');

      await this.repository.updateMember(
        body.name,
        body.last_name,
        searchedMember.email,
        hash,
        memberId
      );
    }
    await this.repository.acceptInviteOnMemberOrganization(
      memberId,
      organizationId
    );
  }

  async preRegisterMember(
    memberId,
    email,
    organizationId,
    isAdmin,
    organizationName
  ) {
    if (!email && !memberId) {
      throw BadRequestError('preRegister', '');
    }
    const memberExists = memberId !== null;
    if (memberId) {
      await this.repository.preRegisterExistentMember(
        memberId,
        organizationId,
        isAdmin
      );
    } else {
      memberId = await this.repository.preRegisterNewMember(
        email,
        organizationId,
        isAdmin
      );
    }
    const registrationToken = this.jwtService.generateRegistrationToken(
      memberId,
      organizationId,
      organizationName,
      email
    );

    const mailBody = memberExists
      ? `Hola, has sido invitado a unirte a la organización: ${organizationName}. Para aceptar la invitación utiliza el siguiente enlace en el correr de las próximas ${config.tokenLife}: ${config.webDomain}/accept-invite/${registrationToken}`
      : `Hola, has sido invitado a unirte a la organización: ${organizationName}. Para aceptar la invitación utiliza el siguiente enlace en el correr de las próximas ${config.tokenLife}: ${config.webDomain}/register/${registrationToken}`;

    this.mailingService.sendMail(
      email,
      mailBody,
      `Invitación a Organización ${organizationName}`
    );
  }

  async invite(body, organizationId) {
    if (!body || !Array.isArray(body)) {
      throw new BadRequestError('invite', 'members');
    }
    const organization = await organizationApi.getOrganizationById(
      organizationId
    );
    if (!organization) {
      throw new NotExistError('organization', organizationId);
    }
    const error = [];
    for (let i = 0; i < body.length; i++) {
      let row = body[i];
      try {
        if (!row.email) {
          throw new BadRequestError('invite', 'email');
        }
        const searchedMember = await this.repository.getMemberByEmail(
          row.email
        );
        if (searchedMember) {
          const organizations = await this.repository.getOrganizationsByMember(
            searchedMember.id
          );
          if (organizations.some((org) => org.id === organizationId)) {
            throw new AlreadyExistsError('Member', row.email);
          }
          await this.preRegisterMember(
            searchedMember.id,
            searchedMember.email,
            organizationId,
            row.isAdmin,
            organization.name
          );
        } else {
          await this.preRegisterMember(
            null,
            row.email,
            organizationId,
            row.isAdmin,
            organization.name
          );
        }
      } catch (e) {
        error.push({
          email: row.email,
          reason: `${e.message ? e.message : 'Internal Error'}`
        });
      }
    }
    return error;
  }

  async editMemberPreferences(
    tokenMemberId,
    tokenOrganizationId,
    requested_organization_id,
    mailNotifications
  ) {
    if (
      !requested_organization_id ||
      !tokenOrganizationId ||
      !tokenMemberId ||
      !mailNotifications
    ) {
      throw new BadRequestError('edit', 'Organization Preferences');
    }
    if (requested_organization_id != tokenOrganizationId) {
      throw new UnauthorizedError();
    }

    const organizationId =
      await this.repository.updateMemberOrganizationPreferences(
        tokenOrganizationId,
        tokenMemberId,
        JSON.parse(mailNotifications)
      );
    return organizationId;
  }

  //PRIVATE METHODS

  async getMemberById(memberId) {
    if (!memberId) {
      throw new BadRequestError('get', 'member');
    }
    const member = await this.repository.getMemberById(memberId);
    return member;
  }

  async getMemberOrganizationPreferences(memberId, organizationId) {
    if (!memberId || !organizationId) {
      throw new BadRequestError('get', 'member preferences');
    }
    const preferences = await this.repository.getMemberOrganizationPreferences(
      memberId,
      organizationId
    );
    return preferences;
  }
};
