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
        internalType: "contract IPizza",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createDeterministic",
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
        name: "_nonce",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "pizza",
        type: "address",
        internalType: "contract IPizza",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pizzas",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
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
        name: "_nonce",
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
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ERC1167FailedCreateClone",
    inputs: [],
  },
] as const;
