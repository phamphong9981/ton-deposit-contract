# deposit-contract
We will make this contract a little more advanced and allow TON coins that are deposited in it to be withdrawn by a special admin role. This admin will also be able to transfer ownership to a different admin and more.  
[https://testnet.tonviewer.com/kQBVv1V2vFOOoFO5avsTZAhiZLgLd8yE4It0aW6859zZ9n4y](https://testnet.tonviewer.com/kQBVv1V2vFOOoFO5avsTZAhiZLgLd8yE4It0aW6859zZ9n4y)
## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
