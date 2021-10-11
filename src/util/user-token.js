export class UserToken {
  constructor(jwt) {
    if (!UserToken._instance) {
      this._token = jwt
      this._tokenData = JSON.parse(atob(jwt.split('.')[1]))

      UserToken._instance = this
    }

    return UserToken._instance
  }

  get(key) {
    return this._tokenData[key]
  }

  getFullName() {
    return this._tokenData['firstName'] + " " + this._tokenData['lastName']
  }

  isExpired() {
    return this._tokenData['exp'] < (new Date().getTime() / 1000)
  }

  getToken() {
    return this._token
  }
}


// WEBPACK FOOTER //
// ./app/util/user-token.js