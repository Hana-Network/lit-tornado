// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./MerkleTreeWithHistory.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LitTornado is MerkleTreeWithHistory, ReentrancyGuard {
    address public verifier;
    uint256 public denomination;

    mapping(bytes32 => bool) public nullifierHashes;
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => uint32) public commitmentIndices;

    event Deposit(
        bytes32 indexed commitment,
        uint32 leafIndex,
        uint256 timestamp
    );
    event Withdrawal(
        address to,
        bytes32 nullifierHash,
        address indexed relayer,
        uint256 fee
    );

    /**
     * @dev Constructor
     * @param _verifier Address of the Lit PKP
     * @param _denomination transfer amount for each deposit
     * @param _merkleTreeHeight the height of deposits' Merkle Tree
     */
    constructor(
        address _verifier,
        uint256 _denomination,
        uint32 _merkleTreeHeight
    ) MerkleTreeWithHistory(_merkleTreeHeight) {
        require(_denomination > 0, "denomination should be greater than 0");
        verifier = _verifier;
        denomination = _denomination;
    }

    /**
     @dev Deposit funds into the contract. The caller must send (for ETH) or approve (for ERC20) value equal to or `denomination` of this instance.
     @param _commitment the note commitment, which is Keccak256(nullifier + secret)
    */
    function deposit(bytes32 _commitment) external payable nonReentrant {
        require(!commitments[_commitment], "The commitment has been submitted");
        require(
            msg.value == denomination,
            "Please send `denomination` ETH along with transaction"
        );

        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;
        commitmentIndices[_commitment] = insertedIndex;
        emit Deposit(_commitment, insertedIndex, block.timestamp);
    }

    function generateProofFromCommitment(
        bytes32 leaf
    ) public view returns (bytes32[] memory proof) {
        require(commitments[leaf], "Leaf not found");
        uint32 _index = commitmentIndices[leaf];
        return generateProof(leaf, _index);
    }

    function splitSignature(
        bytes memory signature
    ) private pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(signature.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(
        bytes32 messageHash,
        bytes memory signature
    ) private pure returns (address) {
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function verifyMessage(
        bytes32 messageHash,
        bytes memory signature,
        address expectedSigner
    ) private pure returns (bool) {
        return recoverSigner(messageHash, signature) == expectedSigner;
    }

    /** @dev Withdraw a deposit from the contract. `proof` is a signature verified by Lit PKP. */
    function withdraw(
        bytes memory signature,
        bytes32 root,
        bytes32 nullifierHash,
        address payable recipient,
        address payable relayer,
        uint256 fee
    ) external nonReentrant {
        require(
            !nullifierHashes[nullifierHash],
            "The note has been already spent"
        );
        require(isKnownRoot(root), "Cannot find your merkle root");

        bytes32 messageHash = keccak256(
            abi.encodePacked(root, nullifierHash, recipient, relayer, fee)
        );

        require(
            verifyMessage(messageHash, signature, verifier),
            "Invalid withdraw proof"
        );

        nullifierHashes[nullifierHash] = true;

        (bool success, ) = recipient.call{value: denomination - fee}("");
        require(success, "Payment to recipient failed");
        if (fee > 0) {
            (success, ) = relayer.call{value: fee}("");
            require(success, "Payment to relayer failed");
        }

        emit Withdrawal(recipient, nullifierHash, relayer, fee);
    }

    /** @dev whether a note is already spent */
    function isSpent(bytes32 nullifierHash) external view returns (bool) {
        return nullifierHashes[nullifierHash];
    }
}
