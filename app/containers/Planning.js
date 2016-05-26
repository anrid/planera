'use strict'

import React, { Component } from 'react'
import Moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Planning.scss'

import * as settingsActions from '../actions/settingsActions'
import { filteredConsultantsSelector } from '../selectors/users'

import BasicLayout from './BasicLayout'
import Loader from './Loader'

class Planning extends Component {
  render () {
    return (
      <BasicLayout className='pl-planning'>
        <PlanningBox {...this.props} />
      </BasicLayout>
    )
  }
}

const PlanningBox = (props) => (
  <section className='pl-planning-box'>
    <PlanningLeftColumn {...props} />
    <PlanningMainColumn {...props} />
  </section>
)

const PlanningLeftColumnSShiftSearchBox = ({ actions }) => {
  return (
    <section className='pl-planning-left-axis'>
      <div className='pl-planning-header'>%</div>
    </section>
  )
}

const PlanningLeftColumn = ({ shifts, actions }) => {
  return (
    <section className='pl-planning-left-column'>
      <div className='pl-planning-header'>
        Shifts
      </div>
      <div className='pl-planning-left-column__search-box'>
        <div className='pl-form__input'>
          <input type='text'
            placeholder='Search for shifts'
          />
        </div>
      </div>
      <div className='pl-planning-left-column__shift-titles'>
        {shifts.map((x, i) => {
          return (
            <div key={i} className='pl-planning-left-column__shift-title'>
              <span className='pl-planning-left-column__shift-number'>
                {i + 1}.
              </span>
              {x.title}
            </div>
          )
        })}
      </div>
      <div className='pl-planning-left-column__buttons'>
        <button className='pl-form-button'>
          <i className='fa fa-plus' />
          Add Shift
        </button>
      </div>
    </section>
  )
}

const PlanningLeftAxis = ({ shifts, actions }) => {
  return (
    <section className='pl-planning-left-axis'>
      <div className='pl-planning-header'>%</div>
    </section>
  )
}

const PlanningMainColumn = (props) => (
  <section className='pl-planning-main-column'>
    <PlanningTopAxis />
    <PlanningMainArea {...props} />
  </section>
)

const PlanningTopAxis = () => (
  <section className='pl-planning-top-axis'>
    <PlanningTopAxisMonth month='2016-06' />
    <PlanningTopAxisMonth month='2016-07' />
  </section>
)

const PlanningTopAxisMonth = ({ month }) => {
  const _month = Moment(month, 'YYYY-MM')
  const daysInMonth = _month.daysInMonth()

  const dates = []
  const weekdays = []
  for (let i = 0; i < daysInMonth; ++i) {
    dates.push(i + 1)
    if (weekdays.length < 7) {
      weekdays.push(_month.clone().add(i, 'day').format('dd'))
    }
  }

  return (
    <div className='pl-planning-top-axis__month'>
      <div className='pl-planning-top-axis__month__name'>
        {_month.format('MMMM YYYY')}
      </div>
      <div className='pl-planning-top-axis__month__dates'>
        {dates.map((x) => (
          <div className='pl-planning-cell' key={x}>{x}
            <div className='pl-planning-cell__day-of-week'>
              {weekdays[(x - 1) % 7]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PlanningShift = (props) => {
  const shift = props.shift
  const { pivotDate, dayWidth, onClick } = props

  const start = Moment(shift.startDate)
  const end = Moment(shift.endDate)
  const pivot = Moment(pivotDate)

  const shiftDays = end.diff(start, 'days') || 1
  let daysFromPivot = start.diff(pivot, 'days')
  if (daysFromPivot < 0) {
    // TODO: Handle start dates before pivot date.
    daysFromPivot = 0
  }

  const style = {
    width: dayWidth * shiftDays,
    left: dayWidth * daysFromPivot
  }

  let cls = ''
  switch (shift.color) {
    case 2:
      cls += 'pl-planning-shift--red'
      break
    case 3:
      cls += 'pl-planning-shift--green'
      break
    case 4:
      cls += 'pl-planning-shift--blue'
      break
  }

  return (
    <div className={'pl-planning-shift ' + cls} style={style} onClick={onClick}>
      <div className='pl-planning-shift__title'>
        {shift.title}
      </div>
      <div className='pl-planning-shift__assignees'>
        — June, Ace
      </div>
    </div>
  )
}

const PlanningMainArea = ({ shifts, actions }) => {
  const pivotDate = Moment('2016-06-01')
  const dayWidth = 22

  const getClickHandler = (shiftId) => () => actions.showShiftProperties(shiftId)

  return (
    <section className='pl-planning-main-area'>
      <div className='pl-planning-main-area__inner'>
        {shifts.map((x, i) => (
          <PlanningShift key={x._id} shift={x}
            dayWidth={dayWidth}
            position={i}
            pivotDate={pivotDate}
            onClick={getClickHandler(x._id)}
          />
        ))}
      </div>
    </section>
  )
}

function mapStateToProps (state) {
  // console.log('Planning, state=', state)
  const shifts = state.shifts.order.map((x) => (
    state.shifts.data[x]
  ))
  return {
    shifts
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

const ConnectedPlanning = connect(
  mapStateToProps,
  mapDispatchToProps
)(Planning)

const PlanningPage = () => (
  <Loader page={ConnectedPlanning} />
)

export default PlanningPage
