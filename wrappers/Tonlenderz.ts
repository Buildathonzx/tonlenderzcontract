import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TonlenderzConfig = {};

export function tonlenderzConfigToCell(config: TonlenderzConfig): Cell {
    return beginCell().endCell();
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
}
