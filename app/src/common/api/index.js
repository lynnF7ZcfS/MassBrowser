import { HttpTransport } from '@utils/transport'
import config from '@utils/config'
import { error } from '@utils/log'

const SESSION_URL = '/sessions'
const CLIENT_URL = '/client'

export class CommonAPI {
  constructor () {
    this.transport = new HttpTransport(config.serverURL + '/api')

    this.authToken = null
    this.userID = null
  }

  setTransport(transport) {
    this.transport = transport
  }

  async authenticate (username, password) {
    return this.transport.post(
      '/auth',
      {
        'username': username,
        'password': password
      }  
    )
    .then(response => response.data)
    .then(body => {
      this.userID = username
      return body
    })
  }
  
  getLastModificationTime (entity) {
    return this.transport.get('/meta/last_modification_date')
      .then(response => response.data)
      .then(text => new Date(text))
  }

  syncDatabase (entity, modifiedSince, limit = 10, offset = 0) {
    return this.transport.get(
      `/${entity}?limit=${limit}&offset=${offset}&modified_since=${modifiedSince.toISOString()}`
    )
    .then(response => response.data)
  }

  getSessions () {
    return this.transport.get(
      CLIENT_URL + '/' + this.userID + '/sessions?limit=50&status=1'
    ).then(r => r.data.results)
  }

  updateSessionStatus(sessionID, status) {
    return this.transport.put(
      CLIENT_URL + '/' + this.userID + '/session/' + sessionID + '/status',
      {
        status: status
      }
    ).then(r => r.data.results)
  }

  async getPrivacyPolicyVersion () {
    const privacyPolicyVersionUrl = config.isRelay
      ? 'https://massbrowser.cs.umass.edu/privacy/relay-privacy-version'
      : 'https://massbrowser.cs.umass.edu/privacy/client-privacy-version'

    const response = await this.transport.get(privacyPolicyVersionUrl)
    try {
      return await response.data
    } catch (e) {
      error(e)
      return 0
    }
  }
}

const API = new CommonAPI()
export default API

