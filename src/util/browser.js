import bowser from 'bowser'
window.bowser = bowser

export const isMobile = !!(bowser.mobile || bowser.tablet)



// WEBPACK FOOTER //
// ./app/util/browser.js