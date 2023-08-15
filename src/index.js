import { arGql } from 'ar-gql'
import { allocate } from './lib/allocate.js'
import {
	assoc, path, keys, compose, pick, reduce,
	prop, pluck, all, equals, values, map, toUpper
} from 'ramda'

import { of, fromPromise, Resolved, Rejected } from 'hyper-async'

/**
 * @typedef {Object} Env
 * @property {any} warp
 * @property {any} wallet
 * @property {string} gateway - url for arweave graphql server
 */

/**
 * @callback Licensed
 * @param {string} addr - wallet address
 * @returns {Promise<Boolean>}
 */

/**
 * @callback Pay
 * @param {string} address -  wallet address
 * @returns {Promise<{ok:Boolean}>}
 */

/**
 * @typedef {Object} Payments
 * @property {Licensed} isLicensed
 * @property {Pay} pay
 */

const DRE = 'https://dre-u.warp.cc/contract'
const U = 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw'
const options = {
	allowBigInt: true,
	internalWrites: true,
	unsafeClient: 'skip',
	remoteStateSyncEnabled: true,
	remoteStateSyncSource: DRE
}

export default {
	/**
	 * @param {Env} env
	 * @returns {Payments}
	 */
	init(env) {
		const { warp, wallet, gateway } = env
		const argql = arGql(`${gateway || 'https://arweave.net'}/graphql`)

		return {
			isLicensed(contract, addr) {
				return of({ contract, addr })
					.chain(getLicenseInfo)
					.chain(findInteractionsByAddress)
					.chain(getValidity)
					.map(allValid)
					.bichain(_ => Resolved(false), Resolved)
					.toPromise()
			},
			async pay(contract, addr) {
				const asset = warp.contract(contract).setEvaluationOptions(options)
				const u = warp.contract(U).connect(wallet).setEvaluationOptions(options)
				return of({ contract, addr, asset, u })
					// TODO: check balance to make sure user can pay?
					.chain(getLicenseInfo)
					.chain(isPayPerView)
					.chain(getPayees)
					.toPromise()
					.then(makePaymentAsync)
			}
		}

		function makePaymentAsync(ctx) {
			//const write = fromPromise(ctx.u.writeInteraction.bind(ctx.u))
			const write = ctx.u.writeInteraction.bind(ctx.u)
			const payees = allocate(ctx.owners, ctx.payment)
			return Promise.all(
				compose(
					map(i => write({
						function: 'transfer',
						target: i,
						qty: payees[i]
					}, {
						strict: true,
						tags: [
							{ name: 'Payment-Fee', value: ctx.contract },
							{ name: 'Target', value: i },
							{ name: 'Fee', value: payees[i] }
						]
					})),
					keys
				)(payees)
			)
				.then(results => ({ ok: true, results }))
		}

		function getPayees(ctx) {
			const read = fromPromise(ctx.asset.readState.bind(ctx.asset))
			return read().map(path(['cachedValue', 'state', 'balances']))
				.map(owners => ({ ...ctx, owners }))
		}

		function isPayPerView(ctx) {
			if (toUpper(ctx.license.Access) === toUpper('Restricted') && toUpper(ctx.license['Payment-Mode']) === toUpper('Global-Distribution')) {
				return Resolved({
					...ctx,
					payment: Number(ctx.license['Access-Fee'].replace('One-Time-', '')) * 1e6
				})
			} else if (toUpper(ctx.license['Commercial-Use']) === toUpper('Allowed')) {
				return Resolved({
					...ctx,
					payment: Number(ctx.license['License-Fee'].replace('One-Time-', '')) * 1e6
				})
			} else {
				return Rejected({ ok: false, message: 'License not Pay Per View' })
			}
		}

		function allValid(ctx) {
			return all(equals(true))(values(ctx.validity))
		}

		function getValidity(ctx) {
			const read = fromPromise(() => fetch(`${DRE}/?id=${U}`).then(r => r.json()))
			// const u = warp.contract(U).setEvaluationOptions(options)
			// const read = fromPromise(u.readState.bind(u))
			return read()
				.map(
					compose(
						validity => ({ ...ctx, validity }),
						pick(ctx.interactions),
						prop('validity')
					)
				)
		}

		function findInteractionsByAddress(ctx) {
			const query = fromPromise(argql.run)
			return query(buildInteractionsQuery(), { addrs: [ctx.addr], contracts: [ctx.contract] })
				.map(
					compose(
						pluck('id'),
						pluck('node'),
						path(['data', 'transactions', 'edges'])
					)
				)
				.chain(interactions => interactions.length > 0 ? Resolved({ ...ctx, interactions }) : Rejected(false))
		}

		function getLicenseInfo(ctx) {
			const getTx = fromPromise(argql.tx)
			return getTx(ctx.contract)
				.map(compose(
					pick(['License', 'Access', 'Access-Fee', 'Payment-Mode', 'Commercial-Use', 'License-Fee']),
					reduce((a, t) => assoc(t.name, t.value, a), {}),
					prop('tags')
				))
				.map(license => ({ ...ctx, license }))

		}

		/*
		const read = fromPromise(warp.contract(ctx.contract).setEvalutionOptions(options).readState)
		return read().map(path(['cachedValue', 'state']))
		*/
	}
}

function buildInteractionsQuery() {
	return `query($addrs: [String!]!, $contracts: [String!]!) {
		transactions(
			tags: [
				{ name: "Sequencer-Owner", values: $addrs },
				{ name: "App-Name", values: ["SmartWeaveAction"]},
				{ name: "Payment-Fee", values: $contracts}
			]
		) {
			edges {
				node {
					id
				}
			}
		}				
				}`
}