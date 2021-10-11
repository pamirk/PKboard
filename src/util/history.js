import axios from 'axios'
import { API_URL } from './io'


/*
  historyBoard object:
  boardHistory:
    [ 
      { room: <room_id>, board: [paths], timestamp : { }, title: xyz1 },
      { room: <room_id>, board: [paths], timestamp : { }, title: xyz2 },
      { room: <room_id>, board: [paths], timestamp : { }, title: xyz3 },
    ]
*/

/* Get history from API
 * returns back a list of boards with each one having:
 *  1. list of paths
 *  2. timestamp of when last opened,
 *  3. title: title of last viewing
 *  4. name: name of last viewing
 * the list of board will come back in order
 */
export function getBoardHistory(userToken, callback) {
  axios.get(API_URL + "/history/" + userToken)
  .then((response) => {
    callback(response.data);
  })
  .catch(function(err) {
    console.log(err)
  })
}

/* Send board update to API
 * Takes paths, title, roomID
 * Returns undefined
 */
export function saveToBoardHistory(userToken, roomId) {

  axios.post(API_URL + "/history", {'token': userToken, 'boardId': roomId});
  
}

function compressBoard(paths) {
  // take the paths and compress it to not kill the user's local stoage size (though we don't really need to)
  return paths
}



// WEBPACK FOOTER //
// ./app/util/history.js