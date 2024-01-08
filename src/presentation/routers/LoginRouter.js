const HttpResponse = require('../helpers/HttpResponse')
const MissingParamError = require('../helpers/MissingParamError')

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('Email'))
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
