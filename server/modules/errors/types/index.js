'use strict';

const BaseError = require('./base');
const ClientError = require('./client');
const InternalError = require('./internal');
const ServerError = require('./server');
const ReportedError = require('./reported');

// Auth

const NotAuthenticatedError = require('./auth/notAuthenticated');
const NotAuthorizedError = require('./auth/notAuthorized');
const UserPendingError = require('./auth/userPending');
const UserSuspendedError = require('./auth/userSuspended');

// Client
const BadRequestError = require('./client/badRequest');
const ExistsError = require('./client/exists');
const ExpiredTokenError = require('./client/expiredToken');
const InvalidTokenError = require('./client/invalidToken');
const NotFoundError = require('./client/notFound');
const SessionExpiredError = require('./client/sessionExpired');
const ValidationError = require('./client/validation');

module.exports = {
	BaseError,
	ClientError,
	InternalError,
	ServerError,
	ReportedError,
	NotAuthenticatedError,
	NotAuthorizedError,
	UserPendingError,
	UserSuspendedError,
	BadRequestError,
	ExistsError,
	ExpiredTokenError,
	InvalidTokenError,
	NotFoundError,
	SessionExpiredError,
	ValidationError,
};
