import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { FirstDepositContract } from '../wrappers/FirstDepositContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FirstDepositContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FirstDepositContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let firstDepositContract: SandboxContract<FirstDepositContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        firstDepositContract = blockchain.openContract(FirstDepositContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await firstDepositContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: firstDepositContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and firstDepositContract are ready to use
    });
});
