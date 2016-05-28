'use strict'

import Moment from 'moment'
import ObjectId from 'bson-objectid'

import * as types from '../actions/actionTypes'

const initialState = {
  order: ['SF1', 'SF2', 'SF3', 'SF4'],
  data: {
    SF1: {
      _id: 'SF1',
      assignees: [],
      startDate: '2016-06-02 10:00:00',
      endDate: '2016-06-02 18:00:00',
      color: 1,
      title: 'H&M'
    },
    SF2: {
      _id: 'SF2',
      assignees: [],
      startDate: '2016-06-02 15:00:00',
      endDate: '2016-06-04 18:00:00',
      color: 1,
      title: 'H&M'
    },
    SF3: {
      _id: 'SF3',
      assignees: [],
      startDate: '2016-06-04 10:00:00',
      endDate: '2016-06-10 18:00:00',
      color: 2,
      title: 'Ikea'
    },
    SF4: {
      _id: 'SF4',
      assignees: [],
      startDate: '2016-06-03 10:00:00',
      endDate: '2016-06-03 18:00:00',
      color: 3,
      title: 'Konsum'
    }
  }
}

export default function shifts (state = initialState, action = {}) {
  let n, updated, created
  switch (action.type) {
    case types.CREATE_SHIFT:
      n = { ...state }
      const { startDate, ownerId } = action.payload
      created = {
        _id: ObjectId.generate(),
        ownerId,
        assignees: [],
        startDate,
        endDate: Moment(startDate).add(8, 'hours').format(),
        color: 1,
        title: '[New, untitled shift]'
      }
      n.order = n.order.concat(created._id)
      n.data[created._id] = created
      return n

    case types.RECEIVE_SHIFT:
      const { shift } = action.payload
      n = { ...state }
      n.order = n.order.concat(shift._id)
      n.order = [ ...new Set(n.order) ] // Ensure it’s unique.

      n.data[shift._id] = shift
      return n

    case types.ASSIGN_CONSULTANT:
      const { shiftId, userId } = action.payload
      n = { ...state }
      updated = { ...state.data[shiftId] }
      if (updated.assignees.find((x) => x === userId)) {
        updated.assignees = updated.assignees.filter((x) => x !== userId)
      } else {
        updated.assignees = updated.assignees.concat(userId)
      }
      n.data[shiftId] = updated
      return n

    case types.RECEIVE_SHIFT_LIST:
      const { shiftList } = action.payload
      n = { ...state }

      // Replace all local state.
      n.order = shiftList.map((x) => x._id)
      n.order = [ ...new Set(n.order) ]
      n.order.sort()

      n.data = shiftList.reduce((acc, x) => {
        acc[x._id] = x
        return acc
      }, { })
      return n

    default:
      return state
  }
}
