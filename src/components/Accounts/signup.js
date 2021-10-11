import React, { Component } from 'react'
import axios from 'axios'
import validate from '../../util/validate-password'
import { API_URL } from '../../util/io'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

class Signup extends Component {

  state = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  }

  constructor(props) {
    super(props)
  }

  onInputChanged = (e) => {
    this.setState({[e.target.name]: e.target.value}, function() {
      console.log(this.state)
    })
  }

  onFormSubmit = (e) => {
    e.preventDefault()
    let validation = validate(this.state.password, this.state.confirmPassword)
    
    // TODO: Show better feedback for validation
    if(validation > 0) {
      if(validation == 1)
        alert("Your password is too short. The password must be 8 characters or longer.")
      else
        alert("Password and Confirm Password fields do not match.")

      return
    }

    let userData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    }

    axios.post(API_URL + "/signup", this.state)
    .then((response) => {
      if(response.data.success) {
        this.props.setUserToken(response.data.token)
        this.props.toggleSignupModalActive()
      }
      else {
        alert(response.data.error)
      }
    })
  }

  render() {

    const { t } = this.props;

    return (
      <div className="signup">
        <div className="backdrop" onClick={this.props.toggleSignupModalActive}></div>
        <div className="accounts-modal">
          <div className="accounts-modal-title">{t('Accounts/sign_up')}</div>
          <div className="accounts-modal-caption">{t('Accounts/sign_up_caption')}</div>
          
          <form className="accounts-modal-form" onSubmit={this.onFormSubmit}>
            <input className="accounts-modal-input signup-email" placeholder={t('Accounts/email_address')} type="email" name="email" onChange={this.onInputChanged} required/>
            <div className="accounts-modal-input-container clearfix">
              <input className="accounts-modal-input signup-firstname" placeholder={t('Accounts/first_name')} name="firstName" onChange={this.onInputChanged} required/>
              <input className="accounts-modal-input signup-lastname" placeholder={t('Accounts/last_name')} name="lastName" onChange={this.onInputChanged} required/>
            </div>
            <input className="accounts-modal-input signup-password" placeholder={t('Accounts/password')} type="password" name="password" onChange={this.onInputChanged} required/>
            <input className="accounts-modal-input signup-confirm-password" placeholder={t('Accounts/confirm_password')} type="password" name="confirmPassword" onChange={this.onInputChanged} required/>
            <button className="accounts-modal-submit signup-submit">{t('Accounts/sign_up')}</button>
          </form>
          
          <a href={API_URL + '/auth/google'}>
          <div className="accounts-modal-oauth">
            <div className="accounts-modal-google clearfix">
              <div className="accounts-modal-google-icon"><img className="fit-parent" src="/static/assets/img/icons/google.png" /></div>
              <div className="accounts-modal-google-caption">{t('Accounts/sign_up_google')}</div>
            </div>
          </div></a>
          
          <div className="accounts-modal-extra clearfix">
            <div className="accounts-modal-extra-caption">{t('Accounts/already_have_account')}</div>
            <div className="accounts-modal-extra-button" onClick={this.props.toggleSigninModalActive}>{t('Accounts/sign_in')}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate("translations")(Signup)


// WEBPACK FOOTER //
// ./app/components/Accounts/signup.js