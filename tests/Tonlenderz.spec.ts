import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Tonlenderz } from '../wrappers/Tonlenderz';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Tonlenderz', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Tonlenderz');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tonlenderz: SandboxContract<Tonlenderz>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonlenderz = blockchain.openContract(Tonlenderz.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tonlenderz.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonlenderz.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonlenderz are ready to use
    });
});
