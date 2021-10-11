import './runtimeConfig'
import React from 'react'
import {Redirect, Route, Router, Switch} from 'react-router'
import {createBrowserHistory} from 'history'
import {v1} from 'uuid'
import {I18nextProvider} from 'react-i18next'
import DrawingBoard from './components/DrawingBoard'
import ResetPassword from './components/Accounts/reset_password'
import EmbedTest from './components/EmbedTest'
import i18n from './i18n'

function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <Router history={createBrowserHistory()}>
                <Switch>
                    <Redirect exact replace from="/" to={`/${v1()}${window.location.search}`}/>
                    <Route exact path="/reset-password/:uuid" component={ResetPassword}/>
                    <Route exact path="/embed/:customer/:room" component={DrawingBoard}/>
                    <Route exact path="/embed/:room" component={DrawingBoard}/>
                    <Route exact path="/embed-test/:room" component={EmbedTest}/>
                    <Route path="/:room" component={DrawingBoard}/>
                </Switch>
            </Router>
        </I18nextProvider>
    )
}

export default App;
