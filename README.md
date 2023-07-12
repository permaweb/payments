# Permaweb Payments Library

The Permaweb Payments library is a powerful tool that simplifies the handling of licensing workflows and payments on the permaweb. It provides an easy-to-use API for developers to integrate licensing functionality into their applications and interact with the Arweave blockchain.

## Features

- **License Workflow**: The library facilitates the licensing workflow, allowing developers to check if an address is licensed and initiate payments seamlessly.

- **Payment Handling**: Developers can easily integrate payment functionality into their applications using the library. It provides a straightforward API to initiate and process payments on the permaweb.

- **Integration with Arweave**: The library integrates with the Arweave blockchain, leveraging its decentralized and permanent storage capabilities for licensing and payment transactions.

## Installation

To install the Permaweb Payments library, use the following command:

```bash
npm install @permaweb/payments
```

## Usage

To initialize the library, import it into your project and call the `init` method with the contract and Arweave parameters:

```javascript
import Payments from '@permaweb/payments';

const payments = Payments.init({ contract, arweave });
```

### Check License

To check if an address is licensed, use the `isLicensed` method:

```javascript
const isLicensed = await payments.isLicensed(address);
```

### Make a Payment

To initiate a payment, use the `pay` method:

```javascript
await payments.pay(address);
```

## Examples

Here are some examples to help you get started:

### Check License Example

```javascript
import Payments from '@permaweb/payments';

const payments = Payments.init({ contract, arweave });

const isLicensed = await payments.isLicensed(address);
console.log(`Address ${address} is licensed: ${isLicensed}`);
```

### Make a Payment Example

```javascript
import Payments from '@permaweb/payments';

const payments = Payments.init({ contract, arweave });

await payments.pay(address);
console.log(`Payment sent to address: ${address}`);
```

## Contributions

Contributions to the Permaweb Payments library are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request on the library's GitHub repository.

## License

The Permaweb Payments library is released under the [MIT License](https://opensource.org/licenses/MIT). Please refer to the LICENSE file for more details.

---

Thank you for using the Permaweb Payments library. We hope it simplifies the licensing and payment workflows for your permaweb applications. Happy building!

