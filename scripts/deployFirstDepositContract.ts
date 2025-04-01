import { Cell, TonClient, WalletContractV5R1 } from "@ton/ton";
import * as fs from "fs";
import { mnemonicToWalletKey } from "ton-crypto";
import { FirstDepositContract } from "../wrappers/FirstDepositContract"; // this is the interface class from step 7

export async function run() {
  const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: process.env.TON_API_KEY });

  // prepare Counter's initial code and data cells for deployment
  const counterCode = Cell.fromBoc(fs.readFileSync("build/first_deposit_contract.cell"))[0]; // compilation output from step 6
  const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const counter = FirstDepositContract.createForDeploy(counterCode, initialCounterValue);

  // exit if contract is already deployed
  console.log("contract address:", counter.address.toString());
  if (await client.isContractDeployed(counter.address)) {
    return console.log("Counter already deployed");
  }
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.PRIVATE_KEY || ""; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV5R1.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  console.log(await walletContract.getBalance());
  
  const walletSender = walletContract.sender(key.secretKey);
  
  const seqno = await walletContract.getSeqno();
  
  // send the deploy transaction
  const counterContract = client.open(counter);
  await counterContract.sendDeploy(walletSender, BigInt(1));
  
  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}