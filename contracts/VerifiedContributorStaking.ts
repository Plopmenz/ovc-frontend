export const VerifiedContributorStakingContract = {
  address: "0x97bd9fc828beab8acf457a3e9e14bc52a5f55f8d",
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_rewardToken",
          type: "address",
          internalType: "contract IERC20MintBurnable",
        },
        {
          name: "_stakeNFT",
          type: "address",
          internalType: "contract IERC721",
        },
        {
          name: "_tokensPerSecond",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "claim",
      inputs: [{ name: "_tokenId", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "claimable",
      inputs: [{ name: "_tokenId", type: "uint256", internalType: "uint256" }],
      outputs: [
        {
          name: "claimableTokens",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "renounceOwnership",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "rewardToken",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract IERC20MintBurnable",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "setStakingEnd",
      inputs: [
        { name: "_stakingOver", type: "uint64", internalType: "uint64" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "stake",
      inputs: [{ name: "_tokenId", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "stakeNFT",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract IERC721" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "tokensPerSecond",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "transferOwnership",
      inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "unstake",
      inputs: [{ name: "_tokenId", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "event",
      name: "NFTStaked",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "NFTUnstaked",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          name: "previousOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "newOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "TokensClaimed",
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "tokens",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    { type: "error", name: "NFTAlreadyStaked", inputs: [] },
    { type: "error", name: "NFTNotStaked", inputs: [] },
    { type: "error", name: "NotYourNFT", inputs: [] },
    { type: "error", name: "Overflow", inputs: [] },
    {
      type: "error",
      name: "OwnableInvalidOwner",
      inputs: [{ name: "owner", type: "address", internalType: "address" }],
    },
    {
      type: "error",
      name: "OwnableUnauthorizedAccount",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
    },
    { type: "error", name: "StakingEndMustBeInTheFuture", inputs: [] },
  ],
} as const
