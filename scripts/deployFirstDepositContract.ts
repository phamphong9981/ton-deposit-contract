import { toNano } from '@ton/core';
import { FirstDepositContract } from '../wrappers/FirstDepositContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const firstDepositContract = provider.open(FirstDepositContract.createFromConfig({}, await compile('FirstDepositContract')));

    await firstDepositContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(firstDepositContract.address);

    // run methods on `firstDepositContract`
}
