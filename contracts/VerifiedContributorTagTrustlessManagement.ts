export const VerifiedContributorTagTrustlessManagementContract = {
  address: "0xaade91009c71614ce2bb09fe4bb56bf415c2cdc4",
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_tagManager",
          type: "address",
          internalType: "contract ITagManager",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "asDAO",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        {
          name: "_actions",
          type: "tuple[]",
          internalType: "struct IDAO.Action[]",
          components: [
            { name: "to", type: "address", internalType: "address" },
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
        },
        {
          name: "_failureMap",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "returnValues",
          type: "bytes[]",
          internalType: "bytes[]",
        },
        { name: "failureMap", type: "uint256", internalType: "uint256" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "changeFullAccess",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        {
          name: "_permissionChecker",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "changeFunctionAccess",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        { name: "_zone", type: "address", internalType: "address" },
        {
          name: "_functionSelector",
          type: "bytes4",
          internalType: "bytes4",
        },
        {
          name: "_permissionChecker",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "changeFunctionBlacklist",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        { name: "_zone", type: "address", internalType: "address" },
        {
          name: "_functionSelector",
          type: "bytes4",
          internalType: "bytes4",
        },
        {
          name: "_permissionChecker",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "changeZoneAccess",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        { name: "_zone", type: "address", internalType: "address" },
        {
          name: "_permissionChecker",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "changeZoneBlacklist",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        { name: "_zone", type: "address", internalType: "address" },
        {
          name: "_permissionChecker",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "hasRole",
      inputs: [
        { name: "_account", type: "address", internalType: "address" },
        { name: "_tag", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isAllowed",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        {
          name: "_actions",
          type: "tuple[]",
          internalType: "struct IDAO.Action[]",
          components: [
            { name: "to", type: "address", internalType: "address" },
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
        },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "setAdmin",
      inputs: [
        {
          name: "_dao",
          type: "address",
          internalType: "contract IDAO",
        },
        { name: "_admin", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [
        { name: "_interfaceId", type: "bytes4", internalType: "bytes4" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "AdminSet",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "admin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Execution",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "role",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "sender",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "actions",
          type: "tuple[]",
          indexed: false,
          internalType: "struct IDAO.Action[]",
          components: [
            { name: "to", type: "address", internalType: "address" },
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
        },
        {
          name: "returnValues",
          type: "bytes[]",
          indexed: false,
          internalType: "bytes[]",
        },
        {
          name: "failureMap",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "FullAccessChanged",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "role",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "permissionChecker",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "FunctionAccessChanged",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "role",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "zone",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "functionSelector",
          type: "bytes4",
          indexed: false,
          internalType: "bytes4",
        },
        {
          name: "permissionChecker",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "FunctionBlacklistChanged",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "role",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "zone",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "functionSelector",
          type: "bytes4",
          indexed: false,
          internalType: "bytes4",
        },
        {
          name: "permissionChecker",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ZoneAccessChanged",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "role",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "zone",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "permissionChecker",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ZoneBlacklistChanged",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "role",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "zone",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "permissionChecker",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    { type: "error", name: "AccessDenied", inputs: [] },
    { type: "error", name: "SenderDoesNotHaveRole", inputs: [] },
    { type: "error", name: "SenderIsNotAdmin", inputs: [] },
  ],
} as const
