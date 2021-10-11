// Validates the signup form. Returns 0 if the form is valid.
// 1 => password shorter then MIN_PASSWORD_LENGTH
// 2 => password and confirm_password don't match
export default function validate(password, confirmPassword) {
  if(password.length < 8)
    return 1
  else if(password !== confirmPassword)
    return 2

  return 0
}


// WEBPACK FOOTER //
// ./app/util/validate-password.js