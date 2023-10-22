# Lit Tornado: A Mixer App Powered by Lit Protocol

## Introduction
Lit Tornado is a mixer app designed to facilitate confidential transactions, similar to Tornado Cash, but with a significant innovation - it utilizes Lit Protocol instead of zero-knowledge proofs. This innovative approach leverages the power of Lit Actions and PKPs to validate off-chain computations on-chain, providing a similar privacy level as zero-knowledge proofs but without the associated high computational and implementation costs.

## Why Lit Protocol?
In traditional mixer apps like Tornado Cash, zero-knowledge proofs are employed to ensure transaction privacy. However, these proofs can be computationally expensive and complex to implement. Lit Protocol offers a unique solution to this problem. By utilizing Lit Actions and PKPs, we can validate off-chain computations on-chain, ensuring transaction privacy without the need for zero-knowledge proofs. This approach significantly reduces computational and implementation costs while maintaining a high privacy level.

## How It Works
With Lit Tornado, users can make deposits in a manner similar to Tornado Cash, with the deposit mechanism functioning the same way. The difference lies in how withdrawals are processed. In Lit Tornado, we employ Lit Actions and PKPs to validate transactions, ensuring that the commitment generated from the user's secret and nullifier is included in the smart contract's Merkle tree. This process maintains user privacy, as the target of the proof is not disclosed. Additionally, to prevent the sender's information from being revealed during withdrawals, we use a relayer. This relayer is also powered by Lit Actions and PKPs, simplifying the process and further enhancing user privacy.


## Implementation Comparison: From Zero-Knowledge Proofs to Lit Actions
Below are the links to compare the implementation of Tornado Cash's zero-knowledge circuits and our Lit Action.

- Here is the code for Tornado Cash's zero-knowledge circuits:  
[Tornado Cash ZK Circuits](https://github.com/tornadocash/tornado-core/tree/master/circuits)

- We have ported this to a Lit Action here:  
[Lit Tornado Generate Proof Signature Action](https://github.com/Hana-Network/lit-tornado/blob/main/lit/lit_actions/src/generateProofSignature.action.ts)

This comparison clearly showcases the innovative approach we took in migrating from complex zero-knowledge proof circuits to the streamlined and efficient process using Lit Actions and PKPs.


## Implementation Comparison: From Zero-Knowledge Proofs to Lit Actions
In this section, we will compare the implementation of Tornado Cash's smart contracts and zero-knowledge proof circuits with our Lit Tornado smart contracts and Lit Actions.

### Smart Contract Comparison:
- Here is the withdraw function in Tornado Cash's smart contract:  
[Tornado Cash Withdraw Function](https://github.com/tornadocash/tornado-core/blob/1ef6a263ac6a0e476d063fcb269a9df65a1bd56a/contracts/Tornado.sol#L76)

- Here is the withdraw function in Lit Tornado's smart contract:  
[Lit Tornado Withdraw Function](https://github.com/tornadocash/tornado-core/blob/1ef6a263ac6a0e476d063fcb269a9df65a1bd56a/contracts/Tornado.sol#L76)

At first glance, the two functions may appear almost identical. However, Tornado Cash's verifyProof is for zero-knowledge proof, whereas Lit Tornado's verifyMessage is for signature verification. This results in a significant difference in computation costs.

### Zero-Knowledge Proof Circuit and Lit Action Comparison:  
- Here is the code for Tornado Cash's zero-knowledge circuits:  
[Tornado Cash ZK Circuits](https://github.com/tornadocash/tornado-core/tree/master/circuits)

- We have ported this to a Lit Action here:  
[Lit Tornado Generate Proof Signature Action](https://github.com/Hana-Network/lit-tornado/blob/main/lit/lit_actions/src/generateProofSignature.action.ts)

This comparison clearly showcases the innovative approach we took in migrating from complex zero-knowledge proofs to the streamlined and efficient process using Lit Actions and PKPs.


## Lit Action Relayer: A Strong Caution on Security

The transaction content is created on the client side, and the Lit Action Relayer simply signs it. This is entirely insecure because, in a fully secure implementation, the relayer should validate the content of the transaction before signing it. Our implementation is meant solely for demonstration and does not uphold the security measures necessary for real-world applications.

- Here is the client-side code for the transaction creation:  
[Client-Side Transaction Code](https://github.com/Hana-Network/lit-tornado/blob/546ad9a8e1d7ee5985d42df61a3b0a5e2af21541/frontend/src/hooks/useWithdraw.ts#L149)

- The Lit Action code for the relayer can be found here:  
[Relayer Lit Action Code](https://github.com/Hana-Network/lit-tornado/blob/main/lit/lit_actions/src/relayer.action.ts)

## Live Demo
Click [here](https://lit-tornado.vercel.app/) to access the live demo.


## ETHGlobal Showcase
Learn more about our project and its journey in the ETHGlobal hackathon by visiting our [showcase page](https://ethglobal.com/showcase/lit-tornado-9wokg).

