import { Guru } from './guru'
import config from '../config'

export const guru = new Guru({
    email: config.get('auth.email'),
    token: config.get('auth.token'),
})

export default guru
