import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LitTornado
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const litTornadoABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_verifier', internalType: 'address', type: 'address' },
      { name: '_denomination', internalType: 'uint256', type: 'uint256' },
      { name: '_merkleTreeHeight', internalType: 'uint32', type: 'uint32' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'commitment',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'leafIndex',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'nullifierHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'relayer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Withdrawal',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ROOT_HISTORY_SIZE',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'commitmentIndices',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'commitments',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'currentRootIndex',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'denomination',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: '_commitment', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'filledSubtrees',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'leaf', internalType: 'bytes32', type: 'bytes32' },
      { name: '_index', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'generateProof',
    outputs: [{ name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'leaf', internalType: 'bytes32', type: 'bytes32' }],
    name: 'generateProofFromCommitment',
    outputs: [{ name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getLastRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '_left', internalType: 'bytes32', type: 'bytes32' },
      { name: '_right', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashLeftRight',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_root', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isKnownRoot',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'nullifierHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'isSpent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'levels',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nextIndex',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'nullifierHashes',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'roots',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'verifier',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
      { name: 'root', internalType: 'bytes32', type: 'bytes32' },
      { name: 'nullifierHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'recipient', internalType: 'address payable', type: 'address' },
      { name: 'relayer', internalType: 'address payable', type: 'address' },
      { name: 'fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'i', internalType: 'uint256', type: 'uint256' }],
    name: 'zeros',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lockABI = [
  {
    stateMutability: 'payable',
    type: 'constructor',
    inputs: [{ name: '_unlockTime', internalType: 'uint256', type: 'uint256' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'when',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawal',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'unlockTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MerkleTreeWithHistory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const merkleTreeWithHistoryABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: '_levels', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ROOT_HISTORY_SIZE',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'currentRootIndex',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'filledSubtrees',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'leaf', internalType: 'bytes32', type: 'bytes32' },
      { name: '_index', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'generateProof',
    outputs: [{ name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getLastRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '_left', internalType: 'bytes32', type: 'bytes32' },
      { name: '_right', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashLeftRight',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_root', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isKnownRoot',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'levels',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nextIndex',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'roots',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'i', internalType: 'uint256', type: 'uint256' }],
    name: 'zeros',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__.
 */
export function useLitTornadoRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"ROOT_HISTORY_SIZE"`.
 */
export function useLitTornadoRootHistorySize<
  TFunctionName extends 'ROOT_HISTORY_SIZE',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'ROOT_HISTORY_SIZE',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"commitmentIndices"`.
 */
export function useLitTornadoCommitmentIndices<
  TFunctionName extends 'commitmentIndices',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'commitmentIndices',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"commitments"`.
 */
export function useLitTornadoCommitments<
  TFunctionName extends 'commitments',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'commitments',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"currentRootIndex"`.
 */
export function useLitTornadoCurrentRootIndex<
  TFunctionName extends 'currentRootIndex',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'currentRootIndex',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"denomination"`.
 */
export function useLitTornadoDenomination<
  TFunctionName extends 'denomination',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'denomination',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"filledSubtrees"`.
 */
export function useLitTornadoFilledSubtrees<
  TFunctionName extends 'filledSubtrees',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'filledSubtrees',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"generateProof"`.
 */
export function useLitTornadoGenerateProof<
  TFunctionName extends 'generateProof',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'generateProof',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"generateProofFromCommitment"`.
 */
export function useLitTornadoGenerateProofFromCommitment<
  TFunctionName extends 'generateProofFromCommitment',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'generateProofFromCommitment',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"getLastRoot"`.
 */
export function useLitTornadoGetLastRoot<
  TFunctionName extends 'getLastRoot',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'getLastRoot',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"hashLeftRight"`.
 */
export function useLitTornadoHashLeftRight<
  TFunctionName extends 'hashLeftRight',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'hashLeftRight',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"isKnownRoot"`.
 */
export function useLitTornadoIsKnownRoot<
  TFunctionName extends 'isKnownRoot',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'isKnownRoot',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"isSpent"`.
 */
export function useLitTornadoIsSpent<
  TFunctionName extends 'isSpent',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'isSpent',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"levels"`.
 */
export function useLitTornadoLevels<
  TFunctionName extends 'levels',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'levels',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"nextIndex"`.
 */
export function useLitTornadoNextIndex<
  TFunctionName extends 'nextIndex',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'nextIndex',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"nullifierHashes"`.
 */
export function useLitTornadoNullifierHashes<
  TFunctionName extends 'nullifierHashes',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'nullifierHashes',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"roots"`.
 */
export function useLitTornadoRoots<
  TFunctionName extends 'roots',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'roots',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"verifier"`.
 */
export function useLitTornadoVerifier<
  TFunctionName extends 'verifier',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'verifier',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"zeros"`.
 */
export function useLitTornadoZeros<
  TFunctionName extends 'zeros',
  TSelectData = ReadContractResult<typeof litTornadoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: litTornadoABI,
    functionName: 'zeros',
    ...config,
  } as UseContractReadConfig<typeof litTornadoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link litTornadoABI}__.
 */
export function useLitTornadoWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof litTornadoABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof litTornadoABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof litTornadoABI, TFunctionName, TMode>({
    abi: litTornadoABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"deposit"`.
 */
export function useLitTornadoDeposit<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof litTornadoABI,
          'deposit'
        >['request']['abi'],
        'deposit',
        TMode
      > & { functionName?: 'deposit' }
    : UseContractWriteConfig<typeof litTornadoABI, 'deposit', TMode> & {
        abi?: never
        functionName?: 'deposit'
      } = {} as any,
) {
  return useContractWrite<typeof litTornadoABI, 'deposit', TMode>({
    abi: litTornadoABI,
    functionName: 'deposit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"withdraw"`.
 */
export function useLitTornadoWithdraw<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof litTornadoABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof litTornadoABI, 'withdraw', TMode> & {
        abi?: never
        functionName?: 'withdraw'
      } = {} as any,
) {
  return useContractWrite<typeof litTornadoABI, 'withdraw', TMode>({
    abi: litTornadoABI,
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link litTornadoABI}__.
 */
export function usePrepareLitTornadoWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof litTornadoABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: litTornadoABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof litTornadoABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"deposit"`.
 */
export function usePrepareLitTornadoDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof litTornadoABI, 'deposit'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: litTornadoABI,
    functionName: 'deposit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof litTornadoABI, 'deposit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link litTornadoABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePrepareLitTornadoWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof litTornadoABI, 'withdraw'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: litTornadoABI,
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof litTornadoABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link litTornadoABI}__.
 */
export function useLitTornadoEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof litTornadoABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: litTornadoABI,
    ...config,
  } as UseContractEventConfig<typeof litTornadoABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link litTornadoABI}__ and `eventName` set to `"Deposit"`.
 */
export function useLitTornadoDepositEvent(
  config: Omit<
    UseContractEventConfig<typeof litTornadoABI, 'Deposit'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: litTornadoABI,
    eventName: 'Deposit',
    ...config,
  } as UseContractEventConfig<typeof litTornadoABI, 'Deposit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link litTornadoABI}__ and `eventName` set to `"Withdrawal"`.
 */
export function useLitTornadoWithdrawalEvent(
  config: Omit<
    UseContractEventConfig<typeof litTornadoABI, 'Withdrawal'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: litTornadoABI,
    eventName: 'Withdrawal',
    ...config,
  } as UseContractEventConfig<typeof litTornadoABI, 'Withdrawal'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lockABI}__.
 */
export function useLockRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof lockABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lockABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: lockABI, ...config } as UseContractReadConfig<
    typeof lockABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lockABI}__ and `functionName` set to `"owner"`.
 */
export function useLockOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof lockABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lockABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lockABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof lockABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lockABI}__ and `functionName` set to `"unlockTime"`.
 */
export function useLockUnlockTime<
  TFunctionName extends 'unlockTime',
  TSelectData = ReadContractResult<typeof lockABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lockABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lockABI,
    functionName: 'unlockTime',
    ...config,
  } as UseContractReadConfig<typeof lockABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lockABI}__.
 */
export function useLockWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lockABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof lockABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof lockABI, TFunctionName, TMode>({
    abi: lockABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lockABI}__ and `functionName` set to `"withdraw"`.
 */
export function useLockWithdraw<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof lockABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof lockABI, 'withdraw', TMode> & {
        abi?: never
        functionName?: 'withdraw'
      } = {} as any,
) {
  return useContractWrite<typeof lockABI, 'withdraw', TMode>({
    abi: lockABI,
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lockABI}__.
 */
export function usePrepareLockWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lockABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lockABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof lockABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lockABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePrepareLockWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lockABI, 'withdraw'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lockABI,
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lockABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link lockABI}__.
 */
export function useLockEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof lockABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({ abi: lockABI, ...config } as UseContractEventConfig<
    typeof lockABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link lockABI}__ and `eventName` set to `"Withdrawal"`.
 */
export function useLockWithdrawalEvent(
  config: Omit<
    UseContractEventConfig<typeof lockABI, 'Withdrawal'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: lockABI,
    eventName: 'Withdrawal',
    ...config,
  } as UseContractEventConfig<typeof lockABI, 'Withdrawal'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__.
 */
export function useMerkleTreeWithHistoryRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"ROOT_HISTORY_SIZE"`.
 */
export function useMerkleTreeWithHistoryRootHistorySize<
  TFunctionName extends 'ROOT_HISTORY_SIZE',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'ROOT_HISTORY_SIZE',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"currentRootIndex"`.
 */
export function useMerkleTreeWithHistoryCurrentRootIndex<
  TFunctionName extends 'currentRootIndex',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'currentRootIndex',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"filledSubtrees"`.
 */
export function useMerkleTreeWithHistoryFilledSubtrees<
  TFunctionName extends 'filledSubtrees',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'filledSubtrees',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"generateProof"`.
 */
export function useMerkleTreeWithHistoryGenerateProof<
  TFunctionName extends 'generateProof',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'generateProof',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"getLastRoot"`.
 */
export function useMerkleTreeWithHistoryGetLastRoot<
  TFunctionName extends 'getLastRoot',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'getLastRoot',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"hashLeftRight"`.
 */
export function useMerkleTreeWithHistoryHashLeftRight<
  TFunctionName extends 'hashLeftRight',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'hashLeftRight',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"isKnownRoot"`.
 */
export function useMerkleTreeWithHistoryIsKnownRoot<
  TFunctionName extends 'isKnownRoot',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'isKnownRoot',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"levels"`.
 */
export function useMerkleTreeWithHistoryLevels<
  TFunctionName extends 'levels',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'levels',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"nextIndex"`.
 */
export function useMerkleTreeWithHistoryNextIndex<
  TFunctionName extends 'nextIndex',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'nextIndex',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"roots"`.
 */
export function useMerkleTreeWithHistoryRoots<
  TFunctionName extends 'roots',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'roots',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link merkleTreeWithHistoryABI}__ and `functionName` set to `"zeros"`.
 */
export function useMerkleTreeWithHistoryZeros<
  TFunctionName extends 'zeros',
  TSelectData = ReadContractResult<
    typeof merkleTreeWithHistoryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof merkleTreeWithHistoryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: merkleTreeWithHistoryABI,
    functionName: 'zeros',
    ...config,
  } as UseContractReadConfig<
    typeof merkleTreeWithHistoryABI,
    TFunctionName,
    TSelectData
  >)
}
