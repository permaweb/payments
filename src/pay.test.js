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
  const result = await payments.pay('Tzthl3xaI4K4cUYBIQ13O7AhuAc3F57y5R86ns2Yq4o', 'wQH9ojMXplWYiQvkSGVjIdWclk3XDM59poFoaOXKR8E')
  console.log(result)
  assert.ok(true)
})

test.run()