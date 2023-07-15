/**
 * @typedef {Object} Env
 * @property {any} contract
 * @property {any} arweave
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

export default {
	/**
   * @param {Env} env
   * @returns {Payments}
   */
	init(env) {
		const { contract } = env
		return {
		  isLicensed(addr) {
				return Promise.resolve(true)
			},
			pay(addr) {
				return Promise.resolve({ok:true})
				// get license info from asset id
				//const id = contract.txId()
				// get tags
				// determine fee and distribution method
				// verify user has balance in U

				// create transfer interaction with `Indexed-By: License-Payment`
				// return contract.setEvaluationOptions({
				// 	allowBigInt: true,
				// 	internalWrites: true,
				// 	unsafeClient: 'skip',
				// 	remoteStateSyncEnabled: true,
				// }).writeInteraction({
				// 	function: 'transfer',
				// 	target: owner
				// }, { strict: true })
			}
		}
	}
}
