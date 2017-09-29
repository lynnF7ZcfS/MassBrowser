import { CommonAPI } from '@common/api'
import { PermissionDeniedError, InvalidInvitationCodeError } from '@utils/errors'
import config from '@utils/config'
import { error, debug } from '@utils/log'

const SESSION_URL = '/sessions'
const CLIENT_URL = '/client'

class ClientAPI extends CommonAPI {
  registerClient (invitationCode) {
    return this.transport.post(
      '/clients',
      {
        ip: undefined,
        'invitation_code': invitationCode
      }
    )
      .then(r => r.data)
      .catch(PermissionDeniedError, err => {
        throw new InvalidInvitationCodeError('Invalid Invitation Code')
      })
  }

  clientUp () {
    return this.transport.post(
      CLIENT_URL + '/' + this.userID,
      {
        'categoie': 'TBD'
      }
    ).then(r => r.data)
  }

  requestSession (categories) {
    return this.transport.post(
      CLIENT_URL + '/' + this.userID + SESSION_URL, {
        
        'categories': categories
      }
    )
      .then(r => {
        if (r.status == 201) {
          return r.data
        }

        // Sesion not found
        return null
      })
  }

  updateClientAddress (RemoteIP,RemotePort) {
    debug("UPDATING IP",RemotePort)
    return this.transport.post(
      CLIENT_URL + '/' + this.userID,
      {
        'ip': RemoteIP,
        'port': RemotePort
      }
    ).then(r => r.data)

  }

  requestNewStunServer () {
    var data = {}
    return new Promise((resolve, reject) => {
      resolve({
        'ip': config.serverURL.replace('https://', ''),
        'port': 8823
      })
    })
    // TODO:
    //return this.transport.get('/client/stun', data).then(r => r.data.allowed_categories)
  }
}

const API = new ClientAPI()
export default API