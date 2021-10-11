let mixpanel = require('mixpanel-browser');

if (process.env.NODE_ENV !== 'production') {
  mixpanel.init("7ac33d0eb495bc4a1a847b47a3b0175d");
} else {
  mixpanel.init("b31982348b5078ec3731c2eb26784b43");
}

export default mixpanel
