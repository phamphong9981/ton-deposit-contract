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
            value: "0.01",
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    static createForDeploy(code: Cell, initialCounterValue: number): FirstDepositContract {
        const data = beginCell()
          .storeUint(initialCounterValue, 64)
          .endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new FirstDepositContract(address, { code, data });
      }
}
