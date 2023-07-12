export default {
	init(env) {
		return {
		  isLicensed(addr) {
				return Promise.resolve(true)
			},
			pay(addr) {
				return Promise.resolve({ok: true})
			}
		}
	}
}
