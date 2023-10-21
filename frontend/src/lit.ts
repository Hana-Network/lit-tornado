// import { defineChain } from "viem";

// export const chronicle = defineChain({
//   id: 175177,
//   network: "Chronicle",
//   name: "Chronicle - Lit Protocol Testnet",
//   nativeCurrency: { name: "LIT", symbol: "LIT", decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ["https://chain-rpc.litprotocol.com/http"],
//     },
//     public: {
//       http: ["https://chain-rpc.litprotocol.com/http"],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "Explorer",
//       url: "https://chain.litprotocol.com",
//     },
//   },
//   testnet: true,
// });

export const PROOF_LIT_ACTION_CODE = `
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // lit_actions/src/generateProofSignature.action.ts
  var hashLeftRight = (left, right) => {
    return ethers.utils.solidityKeccak256(["bytes32", "bytes32"], [left, right]);
  };
  function indexToPathIndices(index, treeHeight) {
    const binaryIndex = index.toString(2).padStart(treeHeight, "0");
    return Array.from(binaryIndex).reverse().map((char) => char === "0");
  }
  function verifyMerkleProof(leaf, root, pathElements, leafIndex, treeHeight) {
    const pathIndices = indexToPathIndices(leafIndex, treeHeight);
    let computedHash = leaf;
    for (let i = 0; i < pathElements.length; i++) {
      const sibling = pathElements[i];
      const isLeft = pathIndices[i];
      computedHash = isLeft ? hashLeftRight(computedHash, sibling) : hashLeftRight(sibling, computedHash);
    }
    return computedHash === root;
  }
  function circuit(privateInputs2, publicInputs2) {
    const { secret, nullifier, merkleProof, leafIndex } = privateInputs2;
    const { treeRoot, nullifierHash, merkleTreeHeight } = publicInputs2;
    const commitment = hashLeftRight(secret, nullifier);
    if (nullifierHash !== publicInputs2.nullifierHash) {
      console.log("Invalid nullifier hash");
      return false;
    }
    return verifyMerkleProof(
      commitment,
      treeRoot,
      merkleProof,
      leafIndex,
      merkleTreeHeight
    );
  }
  var generateProofSignature = () => __async(void 0, null, function* () {
    if (circuit(privateInputs, publicInputs)) {
      console.log("Proof verified");
      const sigShare = yield LitActions.signEcdsa({
        toSign,
        publicKey,
        sigName
      });
      // LitActions.setResponse({ response: JSON.stringify(sigShare) });
    } else {
      console.error("Proof not verified");
    }
  });
  generateProofSignature();
})();
`;
