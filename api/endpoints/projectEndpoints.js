'use strict'

const P = require('bluebird')
const Joi = require('joi')

const ProjectService = require('../services/projectService')
const Schemas = require('./schemas')

function create (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, createProjectSchema)
    return ProjectService.create(valid.title, valid.workspaceId, context.userId)
    .then((project) => {
      const projectId = project._id.toString()
      return {
        topic: 'project:create',
        payload: {
          projectId,
          project
        }
      }
    })
  })
}

function update (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, updateProjectSchema)
    return ProjectService.update(valid.projectId, valid.update, context.userId)
    .then((project) => {
      const projectId = project._id.toString()
      return {
        topic: 'project:update',
        payload: {
          projectId,
          project
        }
      }
    })
  })
}

function addMember (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, addOrRemoveMemberSchema)
    return ProjectService.addMember(valid.projectId, valid.memberId, context.userId)
    .then((project) => {
      const projectId = project._id.toString()
      return {
        topic: 'project:update',
        payload: {
          projectId,
          project
        }
      }
    })
  })
}

function removeMember (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, addOrRemoveMemberSchema)
    return ProjectService.removeMember(valid.projectId, valid.memberId, context.userId)
    .then((project) => {
      const projectId = project._id.toString()
      return {
        topic: 'project:update',
        payload: {
          projectId,
          project
        }
      }
    })
  })
}

const addOrRemoveMemberSchema = Joi.object().keys({
  projectId: Joi.string().min(20).required().description('Project id.'),
  memberId: Joi.string().min(20).required().description('Member id.')
})

const createProjectSchema = Joi.object().keys({
  workspaceId: Joi.string().min(20).required().description('User’s current workspace id.'),
  title: Joi.string().min(3).required().description('Project title.')
})

const updateProjectSchema = Joi.object().keys({
  projectId: Joi.string().min(20).required().description('Project id.'),
  update: Joi.object().keys({
    title: Joi.string().min(3).description('Project title.'),
    desc: Joi.string().min(3).description('Project desc.'),
    isPrivate: Joi.boolean().description('Project privacy setting.'),
    startDate: Joi.date().iso().description('Project start date.'),
    dueDate: Joi.date().iso().description('Project due date.'),
    completedDate: Joi.date().iso().description('Project completed date.')
  }).xor(
    // Force updating one field at a time.
    'title',
    'desc',
    'isPrivate',
    'startDate',
    'dueDate',
    'completedDate'
  )
})

module.exports = {
  create,
  update,
  addMember,
  removeMember
}