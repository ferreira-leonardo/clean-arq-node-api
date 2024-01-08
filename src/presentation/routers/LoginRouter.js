const HttpResponse = require('../helpers/HttpResponse')
const MissingParamError = require('../helpers/MissingParamError')
const InvalidParamError = require('../helpers/InvalidParamError')

class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('Email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('Email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('Password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
    //   console.error(error)
      return HttpResponse.serverError()
    }
  }
}

module.exports = LoginRouter
