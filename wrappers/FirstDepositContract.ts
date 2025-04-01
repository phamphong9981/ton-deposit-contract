import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FirstDepositContractConfig = {};

export function firstDepositContractConfigToCell(config: FirstDepositContractConfig): Cell {
    return beginCell().endCell();
}

export class FirstDepositContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new FirstDepositContract(address);
    }

    static createFromConfig(config: FirstDepositContractConfig, code: Cell, workchain = 0) {
        const data = firstDepositContractConfigToCell(config);
        const init = { code, data };
        return new FirstDepositContract(contractAddress(workchain, init), init);
    }

    static createForDeploy(code: Cell, initialCounterValue: number): FirstDepositContract {
        const data = beginCell().storeUint(initialCounterValue, 64).endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new FirstDepositContract(address, { code, data });
    }

    // function call
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value: '0.01',
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const { stack } = await provider.get('counter', []);
        return stack.readBigNumber();
    }

    async sendIncrement(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
            .storeUint(1, 32) // op (op #1 = increment)
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: '0.002', // send 0.002 TON for gas
            body: messageBody,
        });
    }
}
