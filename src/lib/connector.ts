import * as WebSocket from 'ws'

import {Request, Storage} from './storage'

export class Connector {
  /**
   * Connector configuration
   */
  public vars = {
    targetDomain: 'zhack.ca',
    prefixes: {
      standard: '.d.',
      in: '.i.',
      out: '.o.',
      stager: '.s.'
    },
    websocketUrl: 'ws://dns1.zhack.ca:8001/dnsbin'
  }

  /**
   * Websocket client
   */
  public ws: WebSocket

  /**
   * Storage
   */
  public storage: Storage

  constructor(message: (record: Request) => any, token?: (token: string) => any) {
    this.ws = new WebSocket(this.vars.websocketUrl)
    this.storage = new Storage()
    this.ws.on('message', (dt: string) => {
      let data: {
        type: string,
        master: string,
        data: string
      } = JSON.parse(dt)
      if (data.type === 'token') {
        this.storage.token(data.data + this.vars.prefixes.standard + this.vars.targetDomain)
        if (token) token(data.data + this.vars.prefixes.standard + this.vars.targetDomain)
      } else {
        this.storage.records(data)
        message(data)
      }
    })
  }
}
