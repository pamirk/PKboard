import React, { Component } from 'react'
import axios from 'axios'
import { API_URL } from '../../util/io'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

class Signin extends Component {
  
  state = {
    email: '',
    password: '',
  }

  onInputChanged = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onFormSubmit = (e) => {
    e.preventDefault()
    
    axios.post(API_URL + "/login", this.state)
      .then((response) => {
        this.props.setUserToken(response.data)
        this.props.toggleSigninModalActive()
      })
      .catch(function(err) {
        window.alert('Invalid email or password!\nPlease check your email and password and try again.')
        console.log(err)
      })
  }

  validateEmail = (email) => {
    let regex = RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
    return regex.test(email)
  }

  onResetPasswordClick = (e) => {
    if (this.validateEmail(this.state.email)) {
      axios.post(API_URL + "/password/reset", {"email":this.state.email})
        .then((response) => {
          alert("If that email address is valid, a password reset email was sent.\nClick the link in the email to reset your password")
        })
        .catch((err) => {
          console.log(err)
        });
    }
    else {
      // TODO: Show actual/better error maybe with colors?
      alert("Invalid email")
    }
  }

  constructor(props) {
    super(props)
  }

  render() {

    const { t } = this.props;

    return (
      <div className="signin">
        <div className="backdrop" onClick={this.props.toggleSigninModalActive}></div>
        <div className="accounts-modal">
          <div className="accounts-modal-title">{t('Accounts/sign_in_title')}</div>
          <div className="accounts-modal-caption">{t('Accounts/sign_in_caption')}</div>
          <form className="accounts-modal-form" onSubmit={this.onFormSubmit}>
            <input className="accounts-modal-input signin-email" value={this.state.email} name="email" placeholder={t('Accounts/email_address')} type="email" onChange={this.onInputChanged}/>
            <input className="accounts-modal-input signin-password" value={this.state.password} name="password" placeholder={t('Accounts/password')} type="password" onChange={this.onInputChanged}/>
            <button className="accounts-modal-submit signin-submit">{t('Accounts/sign_in')}</button>
            <div className="accounts-modal-extra clearfix">
              <div className="accounts-modal-extra-caption">{t('Accounts/forgot_password')}</div>
              <div className="accounts-modal-extra-button" onClick={this.onResetPasswordClick}>{t('Accounts/reset_password')}</div>
            </div>
          </form>
          <a href={API_URL + '/auth/google'}>
          <div className="accounts-modal-oauth">
            <div className="accounts-modal-google clearfix">
              <div className="accounts-modal-google-icon"><img className="fit-parent" src="/static/assets/img/icons/google.png" /></div>
              <div className="accounts-modal-google-caption">{t('Accounts/sign_in_google')}</div>
            </div>
          </div>
          </a>
        </div>
      </div>
    )
  }
}

export default translate("translations")(Signin)



// WEBPACK FOOTER //
// ./app/components/Accounts/signin.js