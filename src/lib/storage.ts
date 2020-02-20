export interface Request {
  type: string,
  data: string
}

export interface Store {
  token: string,
  records: Array<Request>
}

export class Storage {
  /**
   * Connector configuration
   */
  static keys = {
    userToken: 'user.access_token',
    records: 'user.data.records'
  }

  /**
   * Datastore
   */
  public store: Store

  constructor() {
    this.store = {
      token: '',
      records: [],
    }
  }

  /**
   * User Token
   */
  public token(token?: string): string {
    if (token === undefined)
      return this.store.token
    else
      this.store.token = token
    return token
  }

  /**
   * User Records
   */
  public records(record?: Request): object {
    if (record === undefined) {
      return this.store.records
    } else {
      if (this.store.records.indexOf(record) === -1) {
        this.store.records.push(record)
      }
      return new Set(this.store.records)
    }
  }
}
