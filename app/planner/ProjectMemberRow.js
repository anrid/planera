'use strict'

import React, { Component } from 'react'
import Moment from 'moment'

import './ProjectMemberRow.scss'

import GridOverlay from './GridOverlay'

export default class ProjectMemberRow extends Component {
  render () {
    const { member, actions } = this.props
    const startDate = Moment(this.props.pivotDate).startOf('isoWeek')
    return (
      <section className='pl-time-planner-project-member-row'>
        <div className='pl-time-planner-project-member-row__left'>
          <div className='pl-time-planner-project-member-row__info'>
            <div className='pl-time-planner-project-member-row__name'>
              {member.firstName} {member.lastName}
            </div>
            <div className='pl-time-planner-project-member-row__stats'>
              {member.profile.title}
            </div>
          </div>
          <div className='pl-time-planner-project-member-row__photo'
            onClick={() => actions.showConsultantProperties(member._id)}
            style={{backgroundImage: `url(${member.photo})`}} />
        </div>
        <div className='pl-time-planner-project-member-row__right'>
          <GridOverlay size={90} />
        </div>
      </section>
    )
  }
}

ProjectMemberRow.propTypes = {
  member: React.PropTypes.object.isRequired,
  shifts: React.PropTypes.array.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  actions: React.PropTypes.object.isRequired
}
