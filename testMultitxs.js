const { ethers, providers, Wallet, BigNumber } = require('ethers');
const config = require('./config');
const { FlashbotsBundleProvider, FlashbotsBundleResolution } = require("@flashbots/ethers-provider-bundle");
//const provider = providers.getDefaultProvider('goerli')
let chaiId = 5 //goerli
const db = require('../NodeJS/helper/db');
const { id } = require('ethers/lib/utils');
const mysql_new = new db();

const provider = new providers.JsonRpcProvider(config.HTTP_RPC_PROVIDER.goerli, chaiId);
const provider2 = new providers.JsonRpcProvider(config.HTTP_RPC_PROVIDER.goerli, chaiId);
const provider1 = new providers.WebSocketProvider(config.WSS_RPC_PROVIDER.goerli, chaiId);

let wallets = new Wallet(config.PrivateKey);
let authSigner = wallets.connect(provider);
let wallets2 = new Wallet(config.PrivateKey2);
let authSigner2 = wallets2.connect(provider2);
let contractAddress = "0xc5a10fcab1e4f036d65023e50e290c1adcb2c5bb"
const flashLoanContract = new ethers.Contract(contractAddress, config.FLASHBLOAN_ABI, authSigner);

const flashLoanContract2 = new ethers.Contract("0x2E08470d3a6067C07F39aa06d86f2481e55FDEd0", config.FLASHBLOAN_ABI, authSigner2);

async function simpleTransaction(aaveAsset, amount, tokens, TransactionId, id, tokenPair, dexPair){
    // let nonce = await provider.getTransactionCount("0x5f24d63201d55d33a439f7fc44b30de6adb96c3c");
    // let nonce2 = await provider2.getTransactionCount("0x6343D7675ef45d12ED09e66ec45CD12BC5f6423d");
    // var dt = dateTime.create();
    // var createdAt = dt.format('Y-m-d H:M:S');

    const moment = require('moment') 
    let timestamp = moment.utc().format('YYYY-MM-DD HH:mm:ss')


    // flashLoanContract.flashloanTriangular(aaveAsset,amount,tokens,({nonce:nonce}))
    // flashLoanContract2.flashloanTriangular(aaveAsset,amount,tokens,({nonce:nonce2}))
    // flashLoanContract.flashloanTriangular(aaveAsset,amount,tokens,({nonce:nonce+2}))
    // flashLoanContract.flashloanTriangular(aaveAsset,amount,tokens,({nonce:nonce}))
    // flashLoanContract.flashloanTriangular(aaveAsset,amount,tokens,({nonce:nonce}))
    
    // console.log(nonce);
}

async function dual(aaveAsset, amount, tokens, TransactionId, id, tokenPair, dexPair) {
    let status
    let payload = {
        status:status,
        token1:aaveAsset[0],
        token2:tokens[0],
        transactionId:TransactionId
    }
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        'https://relay-goerli.flashbots.net/',
        'goerli')

    const block = await provider.getBlock("latest");
    const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, 1);
    const priorityFee = BigNumber.from(10).pow(9);

    let populateTx
    let gasEstimation
    try {
        populateTx = await flashLoanContract.populateTransaction.flashloanDual(aaveAsset, amount, tokens);
        gasEstimation = await flashLoanContract.estimateGas.flashloanDual(aaveAsset, amount, tokens)
        //gasEstimation = gasEstimation.toString()
    } catch (error) {
        // console.log(error, "error")
        status = "Failed";
        mysql_new.updateDualOpportunity(payload,status);
        return ;
    }

    const transaction11 = {
        type: 2,
        maxFeePerGas: priorityFee.add(maxBaseFeeInFutureBlock),
        maxPriorityFeePerGas: priorityFee,
        gasLimit: gasEstimation,
        to: contractAddress,
        chainId: chaiId,
        data: populateTx.data
    }

    const signedBundle = await flashbotsProvider.signBundle([
        {
            signer: wallets, // ethers signer
            transaction: transaction11 // ethers populated transaction object
        }
    ]);

    const simulation = await flashbotsProvider.simulate(signedBundle, block.number)

    if ("error" in simulation || simulation.firstRevert !== undefined) {
        // console.log(`Simulation Error: ${JSON.stringify(simulation, null, 2)}`);
        status = "Failed";
        mysql_new.updateDualOpportunity(payload,status);
        return ;
    } else {
        console.log(`Simulation Success!`)
    }
    provider1.on('block', async (blockNumber) => {
        let BLOCKS_IN_FUTURE = 1;
        let targetBlockNumber = blockNumber + BLOCKS_IN_FUTURE;
        // console.log(`Current Block Number: ${blockNumber},   Target Block Number:${targetBlockNumber}`)
        const bundleResponse = await flashbotsProvider.sendRawBundle(signedBundle, targetBlockNumber);
        if ('error' in bundleResponse) {
            throw new Error(bundleResponse.error.message)
        }
        const bundleResolution = await bundleResponse.wait()
        if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
            console.log(`Congrats, included in ${targetBlockNumber}`)
            let receipt = await bundleResponse.receipts()
            console.log(receipt)
            let status;
            if(receipt[0].status==1 || receipt[0].status==true){
                status = "Success"
                let transactionPayload = {
                    transactionHash: receipt[0].transactionHash,
                    tokenPair:tokenPair,
                    exchange:dexPair,
                    amount:amount,
                    profit:1,
                    fees:1,
                    entityId:id,
                    status:status,
               }
                await mysql_new.insertDualTransaction(transactionPayload)
                console.log("insert transaction in db");
                process.exit(0);
            }
            if(receipt[0].status==0 || receipt[0].status==false){
                status = "Failed"
            }
            
            mysql_new.updateDualOpportunity(payload,status);
            
        } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
            console.log(`Not included in ${targetBlockNumber}`)
        } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log("bailing!")
            //process.exit(1)
        }
    })
    
}


// 0x31b0de9d4af8f20f0bea4d353576aa4011928fd53dc352fa1fd25fb5a70d097e

// 0x42ffc1c4e753deefe5598a6b8490059b1925b28e77356e0b53e2b37c482c2abd

let aaveAssetDual = ["0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33"] //DAI
let amountDual = ["100000000000000000"]
let tokensDual = ["0xCCa7d1416518D095E729904aAeA087dBA749A4dC", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]
//dual(aaveAssetDual, amountDual, tokensDual)

let aaveAssetTriangular = ["0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33"] //DAI
let amountTriangular = ["100000000000000000"]
let amountTriangular2 = ["10000000000000000000"]

let tokensTriangular = ["0xCCa7d1416518D095E729904aAeA087dBA749A4dC", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]
async function main(){
    let response = await simpleTransaction(aaveAssetTriangular, amountTriangular, tokensTriangular);
    // console.log(response);
}
main();

// triangular(aaveAssetTriangular, amountTriangular2, tokensTriangular)
// let arry = [triangular(aaveAssetTriangular, amountTriangular2, tokensTriangular), triangular(aaveAssetTriangular, amountTriangular, tokensTriangular)]
// Promise.all(arry)

module.exports = {dual:dual} ;
