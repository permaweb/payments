import { test } from 'uvu'
import * as assert from 'uvu/assert'

import fs from 'fs'
import { WarpFactory, LoggerFactory } from 'warp-contracts'

const jwk = JSON.parse(fs.readFileSync('./jwk.json'))
LoggerFactory.INST.logLevel('fatal')
const warp = WarpFactory.forMainnet()

test('pay license if not paid', async () => {
  const Payments = (await import('./index.js')).default
  const payments = Payments.init({
    warp,
    wallet: jwk,
    gateway: 'https://arweave.net'
  })
  const result = await payments.pay('LbYoF5Z7mwSpAjLCPlVPUOym9dP0huGEpZHuCimL9Po', 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI')
  console.log(result)
  assert.ok(true)
})

test.run()