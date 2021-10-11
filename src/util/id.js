import {v4} from 'uuid'

// sets a global id once. 
// this function doesn't generate a new uuid every time its called
export default v4()

