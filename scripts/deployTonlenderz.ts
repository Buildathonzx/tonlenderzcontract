import { toNano } from '@ton/core';
import { Tonlenderz } from '../wrappers/Tonlenderz';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const config = { interestRate: 5, loanDuration: 30 };
    const tonlenderz = provider.open(Tonlenderz.createFromConfig(config, await compile('Tonlenderz')));

    await tonlenderz.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tonlenderz.address);

    // run methods on `tonlenderz`
}
