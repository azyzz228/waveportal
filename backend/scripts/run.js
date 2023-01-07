
const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();
    
    console.log("Contract deployed to ->", waveContract.address);
    console.log("Contract deployed by ->", owner.address);
    
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    

    // Sending Few Waves!!

    // First Connection
    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait(); // Wait for the transaction to be mined

    // Second Connection
    waveTxn = await waveContract.connect(randomPerson).wave("Another Message!");
    await waveTxn.wait(); // wait for it to be mined

    console.log(await waveContract.getAllWaves());
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