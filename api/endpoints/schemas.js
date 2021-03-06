'use strict'

const Boom = require('boom')
const Joi = require('joi')

function validateOrThrow (data, schema) {
  if (!data) {
    throw Boom.badRequest('Missing data')
  }
  const result = Joi.validate(data, schema, { stripUnknown: true })
  if (result.error) {
    const e = Boom.badRequest('Validation error')
    e.output.payload.message = result.error.details.map((x) => x.message).join(', ')
    e.output.payload.details = result.error.details.reduce((acc, x) => {
      acc[x.path] = x.message
      return acc
    }, { })
    throw e
  }
  return result.value
}

module.exports = {
  validateOrThrow
}
