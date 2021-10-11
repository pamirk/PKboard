import React, { Component } from 'react'
import axios from 'axios'
import { I18nextProvider, translate } from 'react-i18next';

import { API_URL } from '../../util/io'
import i18n from '../../i18n'
import validate from '../../util/validate-password'

class ResetPassword extends Component {
  
  state = {
    userFirstName: '',
    userId: '',
    uuid: '',
    password: '',
    confirmPassword: '',
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
    
    axios.post(API_URL + "/password/reset/" + this.state.uuid, this.state)
      .then((response) => {
        // TODO: Show actual success notification
        // Something on the page itself saying that your password has been reset
        // and a button with a link to go back to home
        alert("Your password has been reset")
        window.localStorage.setItem('userToken', response.data);
        window.location.replace("/");
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount() {
    let { uuid } = this.props.match.params

    // check that the link was called with a uuid
    if (!uuid) {
      // TODO: Need a 404 or 400 page
      alert("Invalid link")
      window.location.replace("/")
    }

    // If the request has a uuid, check the validity 
    // of the uuid and get the user's first name
    axios.get(API_URL + "/password/reset/" + uuid)
    .then((response) => {
      this.setState({
        uuid,
        userFirstName: response.data.userFirstName,
        userId: response.data.userId,
      })
    })
    .catch((err) => {
      // If the link is expired
      if (err.response && err.response.status == 410) {
        alert("This password reset link is expired. You can request another password reset link from the sign-in page.")
        window.location.replace("/?signin=true")
      }
    })
  }

  constructor(props) {
    super(props)
  }

  render() {

    const { t } = this.props;

    return (
      <div className="reset-password">
        <div className="backdrop" onClick={this.props.toggleSigninModalActive}></div>
        <div className="accounts-modal">
          <div className="accounts-modal-title">Reset your password</div>
          <div className="accounts-modal-caption">Hi {this.state.userFirstName}! Use the form below to reset your password.</div>
          <form className="accounts-modal-form" onSubmit={this.onFormSubmit}>
            <input className="accounts-modal-input reset-password-input" name="password" value={this.state.password} placeholder={t('Accounts/password')} type="password" onChange={this.onInputChanged}/>
            <input className="accounts-modal-input reset-confirm-password-input" name="confirmPassword" value={this.state.confirmPassword} placeholder={t('Accounts/confirm_password')} type="password" onChange={this.onInputChanged}/>
            <button className="accounts-modal-submit reset-submit">Reset Password</button>
          </form>
        </div>
      </div>
    )
  }
}

export default translate("translations")(ResetPassword)



// WEBPACK FOOTER //
// ./app/components/Accounts/reset_password.js