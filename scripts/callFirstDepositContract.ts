import { Address, TonClient } from "@ton/ton";
import { FirstDepositContract } from "../wrappers/FirstDepositContract"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: process.env.TON_API_KEY });

  // open Counter instance by address
  const counterAddress = Address.parse("kQBVv1V2vFOOoFO5avsTZAhiZLgLd8yE4It0aW6859zZ9n4y"); // replace with your address from step 8
  const counter = new FirstDepositContract(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}