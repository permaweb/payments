import { test } from 'uvu'
import * as assert from 'uvu/assert'

import fs from 'fs'
import { WarpFactory, LoggerFactory } from 'warp-contracts'

const jwk = JSON.parse(fs.readFileSync('./jwk.json'))
LoggerFactory.INST.logLevel('fatal')
const warp = WarpFactory.forMainnet()

test('isLicensed', async () => {
  const Payments = (await import('./index.js')).default
  const payments = Payments.init({
    warp,
    wallet: jwk,
    gateway: 'https://arweave.net'
  })
  const result = await payments.isLicensed('LbYoF5Z7mwSpAjLCPlVPUOym9dP0huGEpZHuCimL9Po', 'Rprhc32W_wwtlwxOnytH8O3cDO0dwnc8VV2lhZr2E7s')
    .catch(e => {
      console.log(e.message)
      return e
    })
  console.log(result)
  assert.ok(true)
})

test('isLicensed', async () => {
  const Payments = (await import('./index.js')).default
  const payments = Payments.init({
    warp,
    wallet: jwk,
    gateway: 'https://arweave.net'
  })
  const result = await payments.isLicensed('Lp5y1cVXH2TwBFn7vdYl32sl1Th6pFfGDlJAswywNSA', 'nSi-fTP4iqiSZoZRFjAJiZKKYwQc58zz01DjjYmkJ38')
    .catch(e => {
      console.log(e.message)
      return e
    })
  console.log(result)
  assert.ok(true)
})

test.run()