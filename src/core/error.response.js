'use strict '

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIZED: 401,
    NOTFOUND: 404
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    UNAUTHORIZED: 'Not login',
    NOTFOUND: 'Not found the object'

}


class ErrorResponse extends Error {

    constructor(message, status) {

        super(message)
        this.status = status
    }
}


class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOTFOUND, statusCode = StatusCode.NOTFOUND) {
        super(message, statusCode)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}