import Raven from '~/utils/raven'
import Promise from 'bluebird'

import bootClient from './boot'
import Status from '~/utils/status'

import { InvalidInvitationCodeError } from '~/utils/errors'
import { error } from '~/utils/log'
import config from '~/utils/config'
import {initializeLogging} from '~/utils/log'

global.Promise = Promise

config.applicationInterface = 'commandline'
initializeLogging()

Raven
  .smartConfig({'role': 'client'})
  .install()

// Status.on('status-changed', function (status) {
//   console.log(status.text)
// })

const invitationToken = 'mmn'

bootClient(() => new Promise((resolve, reject) => resolve(invitationToken)))
.catch(InvalidInvitationCodeError, err => {
  error("Invalid invitation code")
  process.exit(1)
})

process.on('uncaughtException', function (err) {
  console.log('err uncaught Exception  : ', err)
})
