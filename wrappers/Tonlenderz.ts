import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TonlenderzConfig = {
    interestRate: number;
    loanDuration: number;
};

export function tonlenderzConfigToCell(config: TonlenderzConfig): Cell {
    return beginCell()
        .storeUint(config.interestRate, 32)
        .storeUint(config.loanDuration, 32)
        .endCell();
}

export class Tonlenderz implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Tonlenderz(address);
    }

    static createFromConfig(config: TonlenderzConfig, code: Cell, workchain = 0) {
        const data = tonlenderzConfigToCell(config);
        const init = { code, data };
        return new Tonlenderz(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async lend(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).endCell(), // 1 represents lend operation
        });
    }

    async borrow(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).endCell(), // 2 represents borrow operation
        });
    }
}
