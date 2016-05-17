'use strict'

const P = require('bluebird')
const Jwt = require('../api/lib/jwt')
const Hoek = require('hoek')

require('../api/lib/database.js')()

const User = require('../api/services/userModel.js')
const UserService = require('../api/services/userService')

const Workspace = require('../api/services/workspaceModel.js')
const WorkspaceService = require('../api/services/workspaceService')

module.exports = {
  _chain: P.resolve(),
  _context: { },

  // Enqueue expect a function as it’s first argument.
  // All queued functions will be executed in sequence (waterfall) and their
  // results added to our context.
  queue (func, name) {
    this._chain = this._chain
    .then(() => P.resolve(func()))
    .tap((result) => {
      if (name) {
        // console.log(`Adding ${name} to context:`, result)
        this._context[name] = result
      }
    })
    return this
  },

  getToken (userId) {
    return Jwt.createToken({ userId })
  },

  wait (func) {
    return this._chain.then(() => func(this._context))
  },

  reset () {
    const removeAllTestData = P.all([
      User.remove({ email: /@test\.test$/ }),
      Workspace.remove({ name: /test\.test/ })
    ])
    return this.queue(() => removeAllTestData)
  },

  user (name) {
    return this.queue(() => {
      const email = `${name}@test.test`
      return UserService.signup({
        email,
        firstName: name,
        password: 'test123'
      })
    }, name)
  },

  workspace (name, ownerName) {
    return this.queue(() => {
      const owner = this._context[ownerName]
      Hoek.assert(owner, `Missing user in context: ${ownerName}`)
      return WorkspaceService.create(`${name}.test.test`, owner._id.toString())
    }, name)
  }

}
