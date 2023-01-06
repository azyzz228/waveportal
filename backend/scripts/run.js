
const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Contract deployed to ->", waveContract.address);
    console.log("Contract deployed by ->", owner.address);

    await waveContract.getTotalWaves();

    // First Connection
    const waveTxn = await waveContract.wave();
    await waveTxn.wait();

    await waveContract.getTotalWaves();

    // Second Connection
    const secondWaveTxn = await waveContract.connect(randomPerson).wave();
    await secondWaveTxn.wait();

    await waveContract.getTotalWaves();
};

const runMain = async () => {
    try {
        await main();
        process.exit(9); // exit node without errors
    } catch (error) {
        console.log(error);
        process.exit(1); // exit with "uncaught fatal exception", node command
    }
}

runMain();