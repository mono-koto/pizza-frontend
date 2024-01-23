export default [
  {
    type: "constructor",
    inputs: [
      {
        name: "_impl",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "create",
    inputs: [
      {
        name: "_payees",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_shares",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "pizza",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "create",
    inputs: [
      {
        name: "_payees",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_shares",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "_salt",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "pizza",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createAndRelease",
    inputs: [
      {
        name: "_payees",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_shares",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "_salt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_bounty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_bountyTokens",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_bountyReceiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "pizza",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "predict",
    inputs: [
      {
        name: "_payees",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_shares",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "_bounty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_salt",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "PizzaCreated",
    inputs: [
      {
        name: "pizza",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ERC1167FailedCreateClone",
    inputs: [],
  },
] as const;
