import React, {Component} from 'react'
import axios from 'axios'
import classNames from 'classnames'
import queryString from 'query-string'
import {Transition} from 'react-transition-group'
import DropZone from 'react-dropzone'
import {v1} from 'uuid'
import {API_URL, socket, uploadImage} from '../util/io'
import simplify from '../util/simplify'
import id from '../util/id'
import {getFileData} from '../util/files'
import {getAllPoints} from '../util/dom-events'
import {randomItem, randomValue} from '../util/random'
import {saveToBoardHistory} from '../util/history'
import {pythag} from '../util/math'
import {UserToken} from '../util/user-token'
import colors from '../lib/colors.json'
import ToolBar from './ToolBar/index'
import TextInput from './TextInput'
import * as tools from '../lib/tool-names'
import * as avatars from '../lib/avatars'
import Path from './Path'
import ImageUpload from './ImageUpload'
import Share from './Share/index'
import DisconnectMessage from './DisconnectMessage'
import EmailConfirmedMessage from './EmailConfirmedMessage'
import HelpSidebar from './HelpSidebar'
import History from './History'
import PopupTooltip from './PopupTooltip'
import AccountsCallout from './Accounts/callout'
import Signup from './Accounts/signup'
import Signin from './Accounts/signin'
import PencilTool from '../lib/tools/PencilTool'
import LineTool from '../lib/tools/LineTool'
import EraserTool from '../lib/tools/EraserTool'
import TextTool from '../lib/tools/TextTool'
import {eraserWidth, round2, strokeWidth} from '../util/sizing'
import {isMobile} from '../util/browser'
import mixpanel from '../lib/mixpanel'
import {translate} from 'react-i18next';
import {toRelative, X_MAX, Y_MAX} from '../util/relative-points'

let values = require('object.values')

export const HOTKEYS = [32]
export const CTRL = [17, 91, 93, 224]


const LEFT_ARROW = 37
const UP_ARROW = 38
const RIGHT_ARROW = 39
const DOWN_ARROW = 40
const ESC = 27
const Z_KEY = 90
const ZERO_KEY = 48
const PLUS_KEY = 187
const MINUS_KEY = 189

const toolHandlers = {
    [tools.PENCIL]: new PencilTool,
    [tools.LINE]: new LineTool,
    [tools.ERASER]: new EraserTool,
    [tools.TEXT]: new TextTool,
}

export const initialState = (props) => ({
    users: {
        [id]: {
            color: '#222222',
            name: null,
            avatar: null,
        }
    },
    currentPaths: [],
    disconnected: false,
    paths: [],
    currentTool: tools.PENCIL,
    textInputPosition: null,
    textInputValue: '',
    scale: {
        scale: 1,
        offsetX: 0,
        offsetY: 0
    },
    title: '',
    helpSidebarActive: false,
    clearModalActive: false,
    historyPanelActive: false,
    blackboardActive: ([null, "false"].indexOf(window.localStorage.getItem('blackboardActive')) !== -1 ? false : true),
    autocorrectActive: true,
    autocorrectTipActive: false,
    accountsCalloutActive: false,
    autocorrectTipShown: false,
    fullscreen: false,
    signupModalActive: false,
    signinModalActive: false,
    loading: false,
    pendingImage: null,
    uploadPromise: null,
    transientNotification: false,
    transientNotificationCaption: '',
    persistentNotification: false,
    persistentNotificationCaption: '',
    zoom: {
        prevScale: 1,
        scale: 1,
        startPoints: [],
        translation: {x: 0, y: 0},
        prevTranslation: {x: 0, y: 0}
    },
    isUserSignedIn: false,
    user: null,
    confirmEmailMessageActive: false,
    wasConnected: false,
    boardSaved: false
})

export function joinValues(obj) {
    var arr = []
    var i

    for (i in obj) {
        if (obj[i] != null) {
            arr = arr.concat(obj[i])
        }
    }
    return arr
}


class DrawingBoard extends Component {
    dPressed = false
    cmdCtrlPressed = false
    shiftPressed = false
    cPressed = false
    rPressed = false
    state = initialState(this.props)
    myPaths = []
    loadStartTimestampMs = null

    componentWillMount() {
        socket.on('changeCurrentPath', this.changeUserCurrentPath)
        socket.on('appendToCurrentPath', this.appendPointToCurrentPath)
        socket.on('addPath', this.addUserPath)
        socket.on('changeRoomName', this.changeTitleAsync)
        socket.on('createUser', this.updateUser)
        socket.on('updateUser', this.updateUser)
        socket.on('removeUser', this.removeUser)
        socket.on('setPaths', this.setPaths)
        socket.on('clearAll', this.clearBoard)
        socket.on('deletePath', this.deletePath)
        socket.on('setupComplete', this.setupComplete)
        socket.on('disconnect', this.handleDisconnect)
        socket.on('connect', this.handleConnect)

        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        window.addEventListener('resize', this.windowResize)

        window.DrawingBoard = this

        document.addEventListener('webkitfullscreenchange', this.fullscreenHandler, false);
        document.addEventListener('mozfullscreenchange', this.fullscreenHandler, false);
        document.addEventListener('fullscreenchange', this.fullscreenHandler, false);
        document.addEventListener('MSFullscreenChange', this.fullscreenHandler, false);

        window.scrollTo(0, 1);
    }

    componentWillUnmount() {
        socket.removeListener('changeCurrentPath', this.changeUserCurrentPath)
        socket.removeListener('appendToCurrentPath', this.appendPointToCurrentPath)
        socket.removeListener('addPath', this.addUserPath)
        socket.removeListener('changeRoomName', this.changeTitleAsync)
        socket.removeListener('createUser', this.updateUser)
        socket.removeListener('updateUser', this.updateUser)
        socket.removeListener('removeUser', this.removeUser)
        socket.removeListener('setPaths', this.setPaths)
        socket.removeListener('clearAll', this.clearBoard)
        socket.removeListener('deletePath', this.deletePath)
        socket.removeListener('setupComplete', this.setupComplete)
        socket.removeListener('disconnect', this.handleDisconnect)
        socket.removeListener('connect', this.handleConnect)

        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
        window.removeEventListener('resize', this.windowResize)

        this.stopGestureEventListeners()

        this.innerWrapper.removeListener('wheel', this.onWheel)
    }

    isEmbedded = () => {
        let path = this.props.location.pathname

        return (path.match(/^\/embed\//) !== null)
    }

    isWhitelabel = () => {
        let {match} = this.props
        let {customer} = match.params

        return customer
    }

    windowResize = zoom => {
        let area = window.innerHeight * window.innerHeight * 1.8,
            scaleRatio = Math.sqrt(area / ((2 * Y_MAX) * (2 * X_MAX))),
            offsetX = window.innerWidth / 2,
            offsetY = window.innerHeight / 2

        if (!zoom || !zoom.scale) {
            zoom = this.state.zoom
        }

        let scale = {
            offsetX: offsetX + zoom.translation.x,
            offsetY: offsetY + zoom.translation.y,
            scale: scaleRatio * (+zoom.scale)
        }

        this.setState({scale})
    }

    toggleSignupModalActive = () => {
        this.setState({
            signupModalActive: !this.state.signupModalActive,
            signinModalActive: false
        })
    }

    toggleSigninModalActive = () => {
        this.setState({
            signinModalActive: !this.state.signinModalActive,
            signupModalActive: false
        })
    }

    setHelpSidebarActive = () => {
        this.setState({
            helpSidebarActive: true
        })
    }

    setHelpSidebarInactive = () => {
        this.setState({
            helpSidebarActive: false
        })
    }

    setHistoryPanelActive = () => {
        this.setState({
            historyPanelActive: true
        })
    }

    setHistoryPanelInactive = () => {
        this.setState({
            historyPanelActive: false
        })
    }

    setAutocorrectTipActive = () => {
        this.setState({
            autocorrectTipActive: true
        })
        setTimeout(() => this.setAutocorrectTipInactive(), 3500);
    }

    setAutocorrectTipInactive = () => {
        this.setState({
            autocorrectTipActive: false
        })
    }

    toggleBlackboard = () => {
        let newState = !this.state.blackboardActive

        this.setState({
            blackboardActive: newState
        })
        window.localStorage.setItem('blackboardActive', newState)
    }

    toggleAutocorrect = () => {
        if (!this.state.autocorrectActive) {
            mixpanel.track("AutoCorrectSetOn")
        } else {
            mixpanel.track("AutoCorrectSetOff")
        }

        this.setState({
            autocorrectActive: !this.state.autocorrectActive
        })
    }

    setupComplete = () => {

        mixpanel.register_once({
            // The current witeboard user will be tracked by the first user id that is given to them as
            // mixpanel will attach this value to the user's browser storage. If mixpanel sees this value in the user's cookies,
            // it won't re-assign it the current userId (as userId is regenerate every time). Essentially, we try to
            // maximize the time we can track one user.
            "storedUserId": userId
        })

        // unlike register once which will identify once, this is tracking the ephemeral userId tokens
        mixpanel.identify({
            userId
        })

        if (!Object.values) {
            values.shim()
        }

        // Build an object from colors and avatars to count of users with that
        // color and avatar
        var colorObj = {}
        var avatarObj = {}
        colors.map(function (color) {
            colorObj[color.color] = 0
        })

        Object.values(avatars).map(function (avatar) {
            avatarObj[avatar] = 0
        })

        for (var userId in this.state.users) {
            if (userId == id)
                continue

            let userColor = this.state.users[userId].color
            let userAvatar = this.state.users[userId].avatar
            colorObj[userColor] += 1
            avatarObj[userAvatar] += 1
        }

        // Get the colors and avatars with the lowest count
        let colorMin = Math.min(...Object.values(colorObj))
        let avatarMin = Math.min(...Object.values(avatarObj))

        var chooseColors = []
        for (var userColor in colorObj) {
            if (colorObj[userColor] == colorMin)
                chooseColors.push(userColor)
        }

        var chooseAvatars = []
        for (var userAvatar in avatarObj) {
            if (avatarObj[userAvatar] == avatarMin)
                chooseAvatars.push(userAvatar)
        }

        let color = randomItem(chooseColors)
        let avatar = randomItem(chooseAvatars)

        this.setColor(color)
        this.setAvatar(avatar)

        // only set the title if one hasn't been set and there was one provided by slack
        let newTitle = this.getTitle()
        if (!this.state.title && newTitle) {
            this.changeTitle(newTitle)
        }

        this.saveBoard()
    }

    getTitle = () => {
        if (typeof URLSearchParams === 'undefined') {
            return null
        }

        let params = new URLSearchParams(window.location.search)

        return params.get('title')
    }

    handleDisconnect = () => {
        this.setState({disconnected: true})

        window.setTimeout(() => {
            this.reconnect()
        }, 1000)
    }

    reconnect = () => {
        let {disconnected} = this.state

        if (!disconnected) {
            return
        }

        socket.open()
        window.setTimeout(this.reconnect, 1000)
    }

    handleConnect = () => {
        this.loadStartTimestampMs = performance.now()
        this.joinRoom()

        window.setTimeout(() => {
            this.setState({
                disconnected: false,
                wasConnected: true
            })
        }, 0)
    }

    changeUserCurrentPath = ({userId, currentPath}) => {
        this.setState({
            currentPaths: {
                ...this.state.currentPaths,
                [userId]: currentPath
            }
        })
    }

    appendPointToCurrentPath = ({userId, newPathFragment}) => {
        let currentPath = this.state.currentPaths[userId]
        if (currentPath == null || currentPath.type !== tools.PENCIL || newPathFragment.type !== tools.PENCIL) {
            return this.changeUserCurrentPath({userId, currentPath})
        }
        currentPath = {
            ...currentPath,
            data: currentPath.data.concat(newPathFragment.data)
        }
        return this.changeUserCurrentPath({userId, currentPath})
    }

    addUserPath = ({userId, newPath}) => {
        let currentPaths = {...this.state.currentPaths}
        delete currentPaths[userId]

        mixpanel.track("PathCreated")

        // If this is the first path being drawn, save the board to history
        if (this.state.paths.length == 0) {
            this.saveBoard()
        }

        this.setState({
            paths: this.state.paths.concat([newPath]),
            currentPaths
        })
    }

    saveBoard = force => {
        window.setTimeout(() => {
            let {paths, title} = this.state
            let {match} = this.props
            let {room} = match.params

            if (this.state.userToken && !this.state.boardSaved && (paths.length > 0 || force)) {
                saveToBoardHistory(this.state.userToken.getToken(), room)
                this.setState({
                    boardSaved: true
                })
            }
        }, 20)
    }

    onKeyDown = (e) => {
        if (e.which in tools.SHORTCUTS) {
            mixpanel.track("ShortcutUsed")
            mixpanel.track("ShortcutUsed: " + tools.SHORTCUTS[e.which])
            this.changeTool(tools.SHORTCUTS[e.which])
        } else if (HOTKEYS.indexOf(e.which) != -1) {
            mixpanel.track("ShortcutUsed")
            mixpanel.track("ShortcutUsed: Space")
            if (!this.dPressed) {
                this.dPressed = true
            }
        }

        // esc pressed
        else if (e.which === ESC) {
            mixpanel.track("ShortcutUsed")
            mixpanel.track("ShortcutUsed: Esc")

            this.setState({
                helpSidebarActive: false
            })
        }

        // cmd/ctrl pressed
        else if (CTRL.indexOf(e.which) != -1) {
            this.cmdCtrlPressed = true
        }

        // Z pressed
        else if (e.which === Z_KEY) {
            // if cmd/ctrl was pressed
            if (this.cmdCtrlPressed) {
                mixpanel.track("ShortcutUsed")
                mixpanel.track("ShortcutUsed: Undo")
                e.preventDefault()
                this.deleteLastPath()
            }
        }

        // Command+Zero to zoom back out
        else if (e.which === ZERO_KEY) {
            if (this.cmdCtrlPressed) {
                mixpanel.track("ShortcutUsed")
                mixpanel.track("ShortcutUsed: CmdZero")
                e.preventDefault()
                let zoom = initialState().zoom

                this.setState({zoom})
                this.windowResize(zoom)
            }
        }

        // + / -
        else if (e.which === PLUS_KEY) {
            e.preventDefault()

            if (this.cmdCtrlPressed) {
                let {scale, zoom} = this.state

                this.setState({
                    scale: {...scale, scale: scale.scale * Math.sqrt(2)},
                    zoom: {...zoom, scale: zoom.scale * Math.sqrt(2)}
                })
            }
        } else if (e.which === MINUS_KEY) {
            e.preventDefault()

            if (this.cmdCtrlPressed) {
                let {scale, zoom} = this.state

                this.setState({
                    scale: {...scale, scale: scale.scale / Math.sqrt(2)},
                    zoom: {...zoom, scale: zoom.scale / Math.sqrt(2)}
                })
            }
        }

        // Arrows
        else if (e.which === UP_ARROW) {
            let {scale} = this.state
            scale = {...scale, offsetY: scale.offsetY + 100}
            this.setState({scale})
        } else if (e.which === DOWN_ARROW) {
            let {scale} = this.state
            scale = {...scale, offsetY: scale.offsetY - 100}
            this.setState({scale})
        } else if (e.which === LEFT_ARROW) {
            let {scale} = this.state
            scale = {...scale, offsetX: scale.offsetX + 100}
            this.setState({scale})
        } else if (e.which === RIGHT_ARROW) {
            let {scale} = this.state
            scale = {...scale, offsetX: scale.offsetX - 100}
            this.setState({scale})
        }

        // Shift pressed
        else if (e.which == 16) {
            mixpanel.track("ShortcutUsed")
            mixpanel.track("ShortcutUsed: Shift")
            this.shiftPressed = true
        } else if (e.which == 67) {
            mixpanel.track("ShortcutUsed")
            mixpanel.track("ShortcutUsed: Circle")
            this.cPressed = true
        } else if (e.which == 82) {
            mixpanel.track("ShortcutUsed")
            mixpanel.track("ShortcutUsed: Rectangle")
            this.rPressed = true
        }
    }

    onKeyUp = (e) => {
        if (HOTKEYS.indexOf(e.which) != -1) {
            if (this.dPressed) {
                this.dPressed = false
            }

            this.onMouseUp()
        } else if (CTRL.indexOf(e.which) != -1) {
            this.cmdCtrlPressed = false
        } else if (e.which == 16) {
            this.shiftPressed = false
        } else if (e.which == 67) {
            this.cPressed = false
        } else if (e.which == 82) {
            this.rPressed = false
        }
    }

    touchCount = e => {
        if (e.touches.length === 0) {
            return e.changedTouches.length
        } else {
            return e.touches.length
        }
    }

    pythag = points => {
        let a = points[0],
            b = points[1]

        return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
    }

    avg = points => {
        let a = points[0],
            b = points[1]

        let absolute = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

        let offset = [window.innerWidth / 2, (window.innerHeight - 40) / 2]

        return [
            absolute[0] - offset[0],
            absolute[1] - offset[1]
        ]
    }

    onZoomStart = e => {
        let {zoom} = this.state
        let startPoints = getAllPoints(e)
        let prevScale = zoom.scale
        let prevTranslation = zoom.translation

        this.setState({
            zoom: {
                ...zoom,
                startPoints,
                prevScale,
                prevTranslation
            }
        })
    }

    onZoom = e => {
        let {startPoints, prevScale, prevTranslation} = this.state.zoom
        let points = getAllPoints(e)
        let prevZoomDist = pythag(startPoints)
        let scale = pythag(points) / prevZoomDist * prevScale

        let avg = this.avg(startPoints)
        let newAvg = this.avg(points)

        return this._zoom({
            scale,
            prevScale,
            prevTranslation,
            center: newAvg,
            prevCenter: avg,
        })
    }

    _zoom = params => {
        let {center, prevCenter, prevTranslation, scale, prevScale} = params

        if (!scale) {
            scale = prevScale
        }

        if (scale > 16) {
            scale = 16
        } else if (scale < 0.125) {
            scale = 0.125
        }

        let diffX = center[0] - prevCenter[0]
        let diffY = center[1] - prevCenter[1]

        let translation = {
            x: (1 - scale / prevScale) * (prevCenter[0] - prevTranslation.x) +
                diffX + prevTranslation.x,
            y: (1 - scale / prevScale) * (prevCenter[1] - prevTranslation.y) +
                diffY + prevTranslation.y
        }

        let zoom = {...this.state.zoom, scale, translation}

        this.setState({zoom})

        this.windowResize(zoom)
    }

    onZoomEnd = e => {
        this.setState({
            zoom: {
                ...this.state.zoom,
                startPoints: []
            }
        })
    }

    startGestureEventListeners = () => {
        document.addEventListener('gesturestart', this.handleGestureStart)
        document.addEventListener('gesturechange', this.handleGestureChange)
    }

    stopGestureEventListeners = () => {
        document.removeEventListener('gesturestart', this.handleGestureStart)
        document.removeEventListener('gesturechange', this.handleGestureChange)
    }

    handleGestureStart = e => {
        e.preventDefault()
    }

    handleGestureChange = e => {
        e.preventDefault()
    }

    onTouchStart = e => {
        e.preventDefault()

        let currentPath = this.state.currentPaths[id]
        let touchCount = this.touchCount(e)

        document.getElementById('main').className = 'main path-active'

        if (touchCount === 1) {
            return this.onMouseDown(e)
        } else if (currentPath && currentPath.data.length < 10) {
            this.delegateEvent('onCancel')(e)
        } else {
            this.onMouseUp(e)
        }

        if (touchCount === 2) {
            this.onZoomStart(e)
        }
    }

    onTouchMove = e => {
        e.preventDefault()

        let touchCount = this.touchCount(e)
        let currentPath = this.state.currentPaths[id]

        if (currentPath && touchCount === 1) {
            this.onMouseMove(e)
        } else if (touchCount === 2) {
            this.onZoom(e)
        }
    }

    onTouchEnd = e => {
        let currentPath = this.state.currentPaths[id]

        document.getElementById('main').className = 'main'

        if (this.state.zoom.startPoints.length === 0) {
            this.onMouseUp(e)
        } else {
            this.onZoomEnd()
        }
    }

    onWheel = e => {
        let {paths} = this.state

        if (paths.length === 0) {
            if (!this.isEmbedded() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault()
            }

            return
        }

        e.preventDefault()

        let {translation} = this.state.zoom

        let prevScale = this.state.zoom.scale

        // ZOOM
        if (e.ctrlKey) {
            let scale = prevScale * (1 + 0.01 * (-e.deltaY))
            let center = [e.clientX - window.innerWidth / 2, e.clientY - (window.innerHeight - 0) / 2]

            return this._zoom({
                center,
                scale,
                prevScale,
                prevCenter: center,
                prevTranslation: translation
            })
        }

        // PAN
        //this._zoom({ center, prevCenter, prevTranslation, scale })
        let newTranslation = {
            x: translation.x - e.deltaX,
            y: translation.y - e.deltaY
        }

        let zoom = {...this.state.zoom, translation: newTranslation}

        this.setState({zoom})

        this.windowResize(zoom)
    }

    onMouseDown = (e) => {
        if (this.state.disconnected) {
            return null
        }

        let titleInput = document.querySelector('.toolbar-title-input')
        if (titleInput) {
            titleInput.blur()
        }

        this.delegateEvent('onMouseDown')(e);
    }

    onMouseMove = (e) => {
        this.delegateEvent('onMouseMove')(e)
    }

    onMouseUp = (e) => {
        this.delegateEvent('onMouseUp')(e)
    }

    onMouseLeave = (e) => {
        this.delegateEvent('onMouseLeave')(e)
    }

    closeTextInput = () => {
        if (this.state.textInputPosition == null) {
            return
        }

        this.delegateEvent('onTextCreate')()

        this.setState({
            textInputPosition: null
        })
    }

    cancelTextInput = () => {
        this.setState({
            textInputPosition: null,
            textInputValue: ''
        })
        this.delegateEvent('onTextCancel')()
    }

    changeTextInput = (textInputValue) => {
        this.setState({textInputValue})
        this.delegateEvent('onTextChange')(null, {textInputValue})
    }

    delegateEvent = (evtName) => {
        return (e, options) => {
            let result

            options = {
                ...options,
                dPressed: this.dPressed,
                shiftPressed: this.shiftPressed,
                cPressed: this.cPressed,
                rPressed: this.rPressed
            }

            let tool = toolHandlers[this.state.currentTool]

            if (tool) {
                result = tool.handle(evtName, this.state, e, options)
            } else {
                console.warn(`Tool not available: ${this.state.currentTool}`)
            }

            if (result == null) return

            if (result.textInputPosition != null) {
                this.setState({
                    textInputValue: '',
                    textInputPosition: result.textInputPosition
                })

                if (isMobile) {
                    window.setTimeout(() => {
                        let value = window.prompt('Enter text')

                        if (value && value.trim() != '') {
                            this.setState({
                                textInputValue: value
                            })

                            window.setTimeout(this.closeTextInput, 100)
                        }
                    }, 20)
                }
            }

            if (result.newPath != null) {
                this.addPath(result.newPath)

                if (result.newPath.oldData &&
                    !this.state.autocorrectTipShown &&
                    !window.localStorage.getItem('acknowledgedAutocorrectTip')) {
                    this.setState({autocorrectTipActive: true})

                    window.setTimeout(() => {
                        this.setState({
                            autocorrectTipActive: false,
                            autocorrectTipShown: true
                        })
                    }, 4000)
                }
            } else if (result.currentPath != null) {
                this.setCurrentPath(result.currentPath)
            } else if (result.cancelCurrentPath) {
                this.setCurrentPath(null)
            } else if (result.currentPathBroadcastOnly != null) {
                this.broadcastCurrentPath(result.currentPathBroadcastOnly)
            }
        }
    }

    hideAccountsCallout = (hideInFuture = false) => {
        if (hideInFuture) {
            window.localStorage.setItem('hideCallout', 1)
        }

        this.setState({
            accountsCalloutActive: false
        })
    }

    showAccountsCallout = () => {
        //if (window.localStorage.getItem('hideCallout')) { return }
        if (!this.isEmbedded()) {
            this.setState({
                accountsCalloutActive: true
            });
        }
    }

    addPath = (newPath) => {
        newPath = {...newPath, id: v1()}
        if (newPath.oldData != null) {
            let autocorrectedPathId = v1()
            this.myPaths.push({id: newPath.id, oldPath: {...newPath, data: newPath.oldData, oldData: null}})
        } else {
            this.myPaths.push({id: newPath.id, oldPath: null})
        }

        if (newPath.type === tools.PENCIL || newPath.type == tools.ERASER) {
            let tolerance = 0.001 // magic number, gotten after several iterations. Basically, when a circle becomes jagged instead of smooth
            let scalar = this.state.scale.scale
            let simd = simplify(newPath.data, tolerance, true)
            newPath.data = simd
        }

        if (this.myPaths.length == 5) {
            this.showAccountsCallout()
        }

        let paths = this.state.paths.concat([newPath])

        let currentPaths = {
            ...this.state.currentPaths,
            [id]: null
        }

        this.setState({
            currentPaths,
            paths
        })

        socket.emit('addPath', {
            userId: id,
            newPath
        })
    }

    setCurrentPath = (currentPath) => {
        this.setState({
            currentPaths: {
                ...this.state.currentPaths,
                [id]: currentPath
            }
        })

        let prevPath = this.state.currentPaths[id]
        if (prevPath && currentPath && prevPath.type === tools.PENCIL &&
            currentPath.type === tools.PENCIL) {
            let newCurrentPath = {
                ...currentPath,
                data: [currentPath.data[currentPath.data.length - 1]]
            }
            this.broadcastAppendPointToCurrentPath(newCurrentPath)
        } else {
            this.broadcastCurrentPath(currentPath)
        }
    }

    broadcastCurrentPath = (currentPath) => {
        socket.emit('changeCurrentPath', {
            userId: id,
            currentPath
        })
    }

    broadcastAppendPointToCurrentPath = (newPathFragment) => {
        socket.emit('appendToCurrentPath', {
            userId: id,
            newPathFragment
        })
    }

    setPaths = ({paths, currentPaths}) => {
        let timeToLoadMs = performance.now() - this.loadStartTimestampMs
        let {match} = this.props
        let {room} = match.params
        mixpanel.track("UserPageHit", {"timeToLoadMs": timeToLoadMs, "boardId": room})

        this.setState({
            currentPaths,
            paths,
            loading: false
        })
    }

    clearBoard = () => {

        this.setState({
            paths: [],
            currentPaths: []
        })
    }

    deleteLastPath = () => {
        if (this.myPaths.length > 0) {
            var lastPath = this.myPaths.pop();
            socket.emit('deletePath', lastPath.id)
            this.deletePath(lastPath.id)

            if (lastPath.oldPath != null) {
                window.setTimeout(() => this.addPath(lastPath.oldPath), 0)
            }
        }
    }

    deletePath = (pathId) => {
        for (var i = this.state.paths.length - 1; i >= 0; i--) {
            if (this.state.paths[i].id == pathId) {
                this.setState({
                    paths: this.state.paths.slice(0, i).concat(this.state.paths.slice(i + 1))
                })

                break
            }
        }
    }

    updateUser = (opts) => {
        let {userId, details} = opts

        this.setState({
            users: {
                ...this.state.users,
                [userId]: details
            }
        })
    }

    removeUser = (userId) => {
        let users = {...this.state.users}
        delete users[userId]

        let currentPaths = {...this.state.currentPaths}
        delete currentPaths[userId]

        this.setState({
            users,
            currentPaths
        })
    }

    toggleClearModal = (e) => {
        this.setState({
            clearModalActive: !this.state.clearModalActive
        })
    }

    triggerClearBoard = (e) => {
        socket.emit('clearAll')
        this.setState({
            currentTool: tools.PENCIL
        })
        this.toggleClearModal()
        e.preventDefault()
    }

    setColor = (colorCode) => {
        let updatedUser = {
            ...this.state.users[id],
            color: colorCode
        }

        socket.emit('updateUser', updatedUser)

        this.setState({
            users: {
                ...this.state.users,
                [id]: updatedUser
            }
        })
    }

    setAvatar = (avatarCode) => {
        let updatedUser = {
            ...this.state.users[id],
            avatar: avatarCode
        }

        socket.emit('updateUser', updatedUser)

        this.setState({
            users: {
                ...this.state.users,
                [id]: updatedUser
            }
        })
    }

    setName = (name) => {
        let updatedUser = {
            ...this.state.users[id],
            name
        }

        socket.emit('updateUser', updatedUser)

        this.setState({
            users: {
                ...this.state.users,
                [id]: updatedUser
            }
        })

        window.localStorage.setItem('user_name', name || '')
    }

    setUserToken = (jwt) => {
        window.localStorage.setItem('userToken', jwt)
        window.location.reload()
    }

    changeTool = (newTool) => {
        this.setState({currentTool: newTool})
    }

    changeTitle = (newTitle) => {
        mixpanel.track("RoomTitleUpdated")
        this.setState({title: newTitle})
        socket.emit('changeRoomName', {name: newTitle})
    }

    changeTitleAsync = (opts) => {
        this.setState({title: opts.name})
    }

    toggleFullScreen = () => {
        var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }

    fullscreenHandler = () => {
        let fullscreen = document.webkitFullscreenElement != null || document.mozFullscreenElement != null || document.msFullscreenElement != null || document.fullscreenElement != null
        this.setState({
            fullscreen: fullscreen
        });
    }

    dismissConfirmEmailMessage = () => {
        this.setState({confirmEmailMessageActive: false})
    }

    showConfirmEmailMessage = () => {
        this.setState({confirmEmailMessageActive: true})
    }

    componentDidMount() {
        this.windowResize()
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
            document.getElementsByTagName("body")[0].className += " safari";
        }

        this.startGestureEventListeners()

        let query = queryString.parse(window.location.search)

        if (!this.state.userToken && query.signin) {
            this.toggleSigninModalActive()
        }

        this.innerWrapper.addEventListener('wheel', this.onWheel, {
            capture: true,
            passive: false,
        })
    }

    joinRoom = () => {
        let {match} = this.props
        let {room} = match.params

        let values = queryString.parse(window.location.search)
        if (values.token) {
            window.localStorage.setItem('userToken', values.token)
        }

        let userTokenString = window.localStorage.getItem('userToken')

        // If a user token was passed with a query parameter
        // (used only when authenticating with google for now)
        if (values.token && !userTokenString) {
            this.setUserToken(values.token)
        }

        // If the confirm email token is in the query params
        // the user is confirming their email
        if (values.confirm_email) {
            axios.post(API_URL + "/emailconfirm", {"uuid": values.confirm_email})
                .then((response) => {
                    if (response.data.success) {

                        if (!userTokenString)
                            this.setUserToken(response.data.token)

                        this.showConfirmEmailMessage()
                    } else {
                        console.log("EMAIL CONFIRM FAILED");
                    }
                })
                .catch((err) => {
                    console.log(err)
                });

        }

        // PARSE ALL QUERY PARAMETERS ABOVE THIS
        // Remove all query params from the url
        window.history.replaceState({}, "", window.location.href.replace(window.location.search, ''))

        let name;

        // If we have a signed in user
        if (userTokenString) {
            let userToken = new UserToken(userTokenString)

            if (userToken.isExpired()) {
                window.localStorage.removeItem('userToken')
                window.location.reload()
            }

            name = userToken.getFullName()
            this.setState({userToken: userToken})

            // Get the legacy history from localstorage
            let history = window.localStorage.getItem('boardHistory')

            // If this person has a localstorage board history, and if this isn't a reconnect,
            // send the history to the api
            if (history && !this.state.wasConnected) {
                let payload = {boardIds: JSON.stringify(Object.keys(JSON.parse(history))), token: userToken}
                axios.post(API_URL + "/history/batch", payload)
                    .then(response => {
                        if (response.data.success) {
                            window.localStorage.removeItem('boardHistory')
                        }
                    });
            }
        }

        let color = colors[0].color
        let avatar = randomValue(avatars)
        let user = {
            ...this.state.users[id],
            avatar,
            color
        }

        if (name) {
            user = {...user, name}
        }

        this.setState({
            users: {
                ...this.state.users,
                [id]: user
            }
        })
        socket.emit('createUser', {room, userId: id, details: user})

        this.windowResize()
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
            document.getElementsByTagName("body")[0].className += " safari";
        }
    }

    hideAutocorrectTip = e => {
        e.preventDefault()
        this.setState({autocorrectTipActive: false})
        window.localStorage.setItem('acknowledgedAutocorrectTip', 1)
    }

    handleDrop = async (files, rejectedFiles, evt) => {
        let file = files[0]

        if (!file) {
            return
        }

        let {data, mimeType, width, height} = await getFileData(file)

        let reader = new FileReader()

        reader.addEventListener('load', () => {
            let url = reader.result

            this.setState({
                pendingImage: {
                    url,
                    width,
                    height,
                    x: evt.clientX,
                    y: evt.clientY,
                },
                uploadPromise: this.uploadImage(data, mimeType)
            })
        })

        reader.readAsDataURL(file)
    }

    uploadImage = async (data, mimeType) => {
        return await uploadImage(data, mimeType)
    }

    setImagePosition = async position => {
        let {scale, zoom, pendingImage} = this.state

        let relativePosition = toRelative(position, scale)

        let width = pendingImage.width / scale.scale * zoom.scale
        let height = pendingImage.height / scale.scale * zoom.scale

        relativePosition = [
            relativePosition[0] - width / 2,
            relativePosition[1] - height / 2
        ]

        let {uploadPromise} = this.state

        let uri = await uploadPromise

        let newPath = {
            width,
            height,
            uri,
            type: tools.IMAGE,
            position: relativePosition,
            pendingImage: null,
            uploadPromise: null,
        }

        this.addPath(newPath)

        this.setState({pendingImage: null})
    }

    handleCancelImage = () => {
        this.setState({
            pendingImage: null,
            uploadPromise: null,
        })
    }

    triggerNotification = (type, caption) => {
        if (type === 'transient') {
            this.setState({
                transientNotification: true,
                transientNotificationCaption: caption,
            });
        }
    }

    innerWrapperRef = el => {
        this.innerWrapper = el
    }

    render() {
        let height = window.innerHeight
        let pathObjs = []
        let paths = this.state.paths.concat(joinValues(this.state.currentPaths))
        let {pendingImage, zoom} = this.state
        let isEmbedded = this.isEmbedded()
        let blackboardActive = !isEmbedded && this.state.blackboardActive

        const {t} = this.props;

        paths.forEach((data, i) => {
            pathObjs.push(
                <Path
                    data={data}
                    key={i}
                    scale={this.state.scale}
                    blackboardActive={blackboardActive}
                />
            )
        })

        return (
            <div
                className={classNames(
                    'drawing-board',
                    blackboardActive ? 'blackboard' : ''
                )}
                style={{height}}
            >
                <ToolBar
                    isEmbedded={isEmbedded}
                    currentColor={this.state.users[id].color}
                    currentTool={this.state.currentTool}
                    onTriggerClear={this.toggleClearModal}
                    onChangeColor={this.setColor}
                    changeToolWrapper={this.changeTool}
                    deleteLastPathWrapper={this.deleteLastPath}
                    title={this.state.title}
                    onTitleChange={this.changeTitle}
                    users={this.state.users}
                    setHistoryPanelActive={this.setHistoryPanelActive}
                    blackboardActive={blackboardActive}
                    toggleBlackboard={this.toggleBlackboard}
                    autocorrectActive={this.state.autocorrectActive}
                    toggleAutocorrect={this.toggleAutocorrect}
                    setHelpSidebarActive={this.setHelpSidebarActive}
                    userToken={this.state.userToken}
                />
                {isEmbedded
                    ? null
                    : <Share
                        users={this.state.users}
                        onChangeName={this.setName}
                        toggleSignupModalActive={this.toggleSignupModalActive}
                        userToken={this.state.userToken}
                        blackboardActive={this.state.blackboardActive}
                        confirmEmailMessageActive={this.state.confirmEmailMessageActive}
                    />}
                {paths.length === 0 &&
                <div className="empty-state">
                    {this.isWhitelabel()
                        ? null
                        : <div>
                            <div className="empty-state-icon"/>
                            <div className="empty-state-title"/>
                        </div>}
                    <div className="empty-state-caption">{t('DrawingBoard/empty_caption')}</div>
                </div>}
                {isEmbedded
                    ? null
                    : <div
                        className={classNames(
                            'toggle-fullscreen',
                            this.state.fullscreen ? 'toggle-fullscreen-exit' : ''
                        )}
                        onClick={this.toggleFullScreen}
                    >
                        <span/>
                    </div>}
                {this.state.clearModalActive &&
                <div className="clear-modal clear-modal-active">
                    <div className="clear-modal-backdrop"></div>
                    <div className="clear-modal-content transition-whoosh">
                        <div className="clear-modal-title">{t('DrawingBoard/clear_title')}</div>
                        <div className="clear-modal-caption">{t('DrawingBoard/clear_caption')}</div>
                        <div className="clear-modal-action clearfix">
                            <div className="clear-modal-accept" onClick={this.triggerClearBoard}>{t('Erase All')}</div>
                            <div className="clear-modal-cancel" onClick={this.toggleClearModal}>{t('Cancel')}</div>
                        </div>
                    </div>
                </div>}
                {this.state.helpSidebarActive &&
                <HelpSidebar
                    helpSidebarActive
                    setHelpSidebarActiveWrapper={this.setHelpSidebarActive}
                    setHelpSidebarInActiveWrapper={this.setHelpSidebarInactive}
                />}
                {this.state.historyPanelActive &&
                <History
                    active
                    setHistoryPanelInactive={this.setHistoryPanelInactive}
                    userToken={this.state.userToken}
                    blackboardActive={this.state.blackboardActive}
                    toggleSignupModalActive={this.toggleSignupModalActive}
                    toggleSigninModalActive={this.toggleSigninModalActive}
                />}
                <div
                    className="drawing-board"
                    data-tool={this.state.currentTool}
                    data-cursor-size={this.state.currentTool === tools.ERASER ?
                        round2(eraserWidth(this.state.scale), 2, 120) + 2 :
                        round2(strokeWidth(this.state.scale), 2, 120) + 2}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onTouchCancel={this.onTouchEnd}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                    onMouseLeave={this.onMouseLeave}
                    ref={this.innerWrapperRef}
                >
                    <DropZone
                        disableClick
                        onDrop={this.handleDrop}
                    >
                        {({getRootProps, isDragActive}) => (
                            <div
                                {...getRootProps()}
                                className={classNames(
                                    'canvas-dropzone',
                                    {'canvas-dropzone-active': isDragActive},
                                )}
                                style={{height: '100%'}}
                            >
                                <svg
                                    height="100%"
                                    width="100%"
                                >
                                    {pathObjs}
                                </svg>
                            </div>
                        )}
                    </DropZone>
                </div>
                {this.state.disconnected
                    ? <DisconnectMessage/>
                    : null}
                {this.state.confirmEmailMessageActive
                    ? <EmailConfirmedMessage
                        userToken={this.state.userToken}
                        dismissConfirmEmailMessage={this.dismissConfirmEmailMessage}
                    />
                    : null}
                {this.state.loading && (
                    <div className="loading">
                        <div className="empty-state">
                            {this.isWhitelabel()
                                ? null
                                : <div>
                                    <div className="empty-state-icon"/>
                                    <div className="empty-state-title"></div>
                                </div>}
                            <div className="empty-state-caption">{t('DrawingBoard/loading_message')}</div>
                        </div>
                    </div>
                )}
                <Transition in={this.state.autocorrectTipActive} timeout={1000}>
                    {state => {
                        if (state === 'exited') {
                            return null
                        }

                        return (
                            <PopupTooltip className={classNames(
                                'tooltip-shape-detect',
                                `tooltip-shape-detect-${state}`
                            )}>
                                {t('DrawingBoard/tip_undo_autocorrect')}
                                <a onClick={this.hideAutocorrectTip}>{t('Don\'t show this again')}</a>
                            </PopupTooltip>
                        )
                    }}
                </Transition>
                {pendingImage
                    ? <ImageUpload
                        url={pendingImage.url}
                        initialX={pendingImage.x}
                        initialY={pendingImage.y}
                        width={pendingImage.width}
                        height={pendingImage.height}
                        onDrop={this.setImagePosition}
                        onCancel={this.handleCancelImage}
                        zoom={zoom}
                    />
                    : null}
                {this.state.userToken
                    ? null
                    : <AccountsCallout
                        active={this.state.accountsCalloutActive}
                        onClose={this.hideAccountsCallout}
                        toggleSignupModalActive={this.toggleSignupModalActive}
                        toggleSigninModalActive={this.toggleSigninModalActive}
                    />}

                {this.state.signupModalActive && (
                    <Signup
                        toggleSignupModalActive={this.toggleSignupModalActive}
                        toggleSigninModalActive={this.toggleSigninModalActive}
                        setUserToken={this.setUserToken}
                    />
                )}
                {this.state.signinModalActive && (
                    <Signin
                        toggleSigninModalActive={this.toggleSigninModalActive}
                        setUserToken={this.setUserToken}
                    />
                )}
                {this.state.textInputPosition && !isMobile &&
                <div className="text-input-wrapper">
                    <TextInput
                        position={this.state.textInputPosition}
                        value={this.state.textInputValue}
                        onChange={this.changeTextInput}
                        onComplete={this.closeTextInput}
                        onCancel={this.cancelTextInput}
                        color={this.state.users[id].color}
                        scale={this.state.scale}
                        blackboardActive={blackboardActive}
                    />
                </div>}
            </div>
        )
    }
}

export default translate("translations")(DrawingBoard)
