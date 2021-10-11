import io from 'socket.io-client'
import axios from 'axios'

import id from '../util/id'

// export const SOCKET_HOST = process.env.NODE_ENV === 'production' ?
//   'https://pure-headland-59660.herokuapp.com/' : 'http://localhost:8081/'
export const SOCKET_HOST = 'https://pure-headland-59660.herokuapp.com/'

export const socket = io(SOCKET_HOST, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 2000,
  reconnectionAttempts: Infinity
})

export const uploadImage = async (data, mimetype) => {
  let boardId = window.location.pathname.substring(1)
  let payload = { boardId, data, mimetype }

  // Upload to API
  let response = await axios.post(`${API_URL}/upload`, payload)

  return response.data.imageURL
}

// export const API_URL = process.env.NODE_ENV === 'production' ? 'https://witeboard-prod.appspot.com' : 'http://localhost:3000'
export const API_URL = 'https://witeboard-prod.appspot.com'
