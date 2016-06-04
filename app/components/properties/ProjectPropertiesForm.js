'use strict'

import React, { Component } from 'react'

import './ProjectPropertiesForm.scss'

import ConsultantsWidget from '../../containers/ConsultantsWidget'
import ConsultantCard from '../../containers/ConsultantCard'
import Button from '../../planner/Button'

export default class ProjectPropertiesForm extends Component {
  constructor (props) {
    super(props)
    this.onValueChange = this.onValueChange.bind(this)
    this.onToggleProjectMember = this.onToggleProjectMember.bind(this)
    this.onSave = this.onSave.bind(this)
    this.state = {
      showConsultantsWidget: false,
      errors: null,
      project: null
    }
  }

  onToggleProjectMember (userId) {
    console.log('onToggleProjectMember, userId=', userId)
    const { project, actions } = this.props
    actions.toggleProjectMember(project._id, userId)
  }

  onValueChange (section, fieldName) {
    return (event) => {
      const project = Object.assign(
        this.state[section] || { },
        { [fieldName]: event.target.value }
      )
      this.setState({ project })
    }
  }

  onSave () {
    const newProject = this.state.project
    const { project, actions } = this.props
    Object.keys(newProject).forEach((x) => {
      if (project[x] !== newProject[x]) {
        console.log('Saving', x, newProject[x])
        actions.updateProject(project._id, x, newProject[x])
      }
    })
  }

  hasError (name) {
    const { errors } = this.state
    return errors && errors[name]
  }

  renderError (name) {
    const { errors } = this.state
    if (!errors || !errors[name]) {
      return null
    }
    return (
      <div className='pl-form__error-text'>
        {errors[name]}
      </div>
    )
  }

  renderAssigeesSection () {
    const { showConsultantsWidget } = this.state
    const { project } = this.props

    const toggle = () => {
      this.setState({
        showConsultantsWidget: !this.state.showConsultantsWidget
      })
    }

    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Project Members</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Consultants</div>

            <Button onClick={toggle}>
              <i className='fa fa-fw fa-plus' /> Assign
            </Button>

            <div className='pl-project-properties-form__consultants-widget'>
              {showConsultantsWidget && (
                <ConsultantsWidget
                  selected={project.members}
                  onSelect={this.onToggleProjectMember}
                  onClose={toggle}
                />
              )}
            </div>

            <div className='pl-project-properties-form__members'>
              {project.members.map((x) => <ConsultantCard key={x} userId={x} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderProjectInformationSection () {
    const { project } = this.props
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Project information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              defaultValue={project.title}
              onChange={this.onValueChange('project', 'title')}
              onBlur={this.onSave}
            />
          {this.renderError('title')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('startDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Start Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 10:00'
              defaultValue={project.startDate}
              onChange={this.onValueChange('project', 'startDate')}
              onBlur={this.onSave}
            />
            <div className='pl-form__help-text'>
              Date and time formats are flexible,
              e.g. both 5/1/2016 10:00am and 2016-05-01 10:00:00
              represent the May 1st 2016 at 10:00 am.
            </div>
          {this.renderError('startDate')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('endDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>End Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 18:00'
              defaultValue={project.endDate}
              onChange={this.onValueChange('project', 'endDate')}
              onBlur={this.onSave}
            />
          {this.renderError('endDate')}
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <section className='pl-project-properties-form'>
        {this.renderProjectInformationSection()}
        {this.renderAssigeesSection()}
      </section>
    )
  }
}

ProjectPropertiesForm.propTypes = {
  project: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
