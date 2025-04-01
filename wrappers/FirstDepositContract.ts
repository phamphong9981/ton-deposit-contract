import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FirstDepositContractConfig = {};

export function firstDepositContractConfigToCell(config: FirstDepositContractConfig): Cell {
    return beginCell().endCell();
}

export class FirstDepositContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new FirstDepositContract(address);
    }

    static createFromConfig(config: FirstDepositContractConfig, code: Cell, workchain = 0) {
        const data = firstDepositContractConfigToCell(config);
        const init = { code, data };
        return new FirstDepositContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
