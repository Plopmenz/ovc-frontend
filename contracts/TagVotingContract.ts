export const TagVotingContract = {
  abi: [
    {
      type: "function",
      name: "UPDATE_VOTING_SETTINGS_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "UPGRADE_PLUGIN_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "canExecute",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "canVote",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
        { name: "_voter", type: "address", internalType: "address" },
        {
          name: "_voteOption",
          type: "uint8",
          internalType: "enum IMajorityVoting.VoteOption",
        },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "createProposal",
      inputs: [
        { name: "_metadata", type: "bytes", internalType: "bytes" },
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
          name: "_allowFailureMap",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_startDate", type: "uint64", internalType: "uint64" },
        { name: "_endDate", type: "uint64", internalType: "uint64" },
        {
          name: "_voteOption",
          type: "uint8",
          internalType: "enum IMajorityVoting.VoteOption",
        },
        { name: "_tryEarlyExecution", type: "bool", internalType: "bool" },
      ],
      outputs: [
        { name: "proposalId", type: "uint256", internalType: "uint256" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "dao",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract IDAO" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "execute",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getProposal",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [
        { name: "open", type: "bool", internalType: "bool" },
        { name: "executed", type: "bool", internalType: "bool" },
        {
          name: "parameters",
          type: "tuple",
          internalType: "struct MajorityVotingBase.ProposalParameters",
          components: [
            {
              name: "votingMode",
              type: "uint8",
              internalType: "enum MajorityVotingBase.VotingMode",
            },
            {
              name: "supportThreshold",
              type: "uint32",
              internalType: "uint32",
            },
            { name: "startDate", type: "uint64", internalType: "uint64" },
            { name: "endDate", type: "uint64", internalType: "uint64" },
            {
              name: "snapshotBlock",
              type: "uint64",
              internalType: "uint64",
            },
            {
              name: "minVotingPower",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
        {
          name: "tally",
          type: "tuple",
          internalType: "struct MajorityVotingBase.Tally",
          components: [
            { name: "abstain", type: "uint256", internalType: "uint256" },
            { name: "yes", type: "uint256", internalType: "uint256" },
            { name: "no", type: "uint256", internalType: "uint256" },
          ],
        },
        {
          name: "actions",
          type: "tuple[]",
          internalType: "struct IDAO.Action[]",
          components: [
            { name: "to", type: "address", internalType: "address" },
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
        },
        {
          name: "allowFailureMap",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getVoteOption",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
        { name: "_voter", type: "address", internalType: "address" },
      ],
      outputs: [
        {
          name: "",
          type: "uint8",
          internalType: "enum IMajorityVoting.VoteOption",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "implementation",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "initialize",
      inputs: [
        { name: "_dao", type: "address", internalType: "contract IDAO" },
        {
          name: "_votingSettings",
          type: "tuple",
          internalType: "struct MajorityVotingBase.VotingSettings",
          components: [
            {
              name: "votingMode",
              type: "uint8",
              internalType: "enum MajorityVotingBase.VotingMode",
            },
            {
              name: "supportThreshold",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "minParticipation",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "minDuration",
              type: "uint64",
              internalType: "uint64",
            },
            {
              name: "minProposerVotingPower",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
        {
          name: "_tagManager",
          type: "address",
          internalType: "contract ITagManagerExtended",
        },
        { name: "_tag", type: "bytes32", internalType: "bytes32" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "isMember",
      inputs: [{ name: "_account", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isMinParticipationReached",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isSupportThresholdReached",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isSupportThresholdReachedEarly",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "minDuration",
      inputs: [],
      outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "minParticipation",
      inputs: [],
      outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "minProposerVotingPower",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "pluginType",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint8",
          internalType: "enum IPlugin.PluginType",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "proposalCount",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "protocolVersion",
      inputs: [],
      outputs: [{ name: "", type: "uint8[3]", internalType: "uint8[3]" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "proxiableUUID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "supportThreshold",
      inputs: [],
      outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
      stateMutability: "view",
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
      type: "function",
      name: "tag",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "tagManager",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract ITagManagerExtended",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "totalVotingPower",
      inputs: [
        { name: "_blockNumber", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "updateVotingSettings",
      inputs: [
        {
          name: "_votingSettings",
          type: "tuple",
          internalType: "struct MajorityVotingBase.VotingSettings",
          components: [
            {
              name: "votingMode",
              type: "uint8",
              internalType: "enum MajorityVotingBase.VotingMode",
            },
            {
              name: "supportThreshold",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "minParticipation",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "minDuration",
              type: "uint64",
              internalType: "uint64",
            },
            {
              name: "minProposerVotingPower",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "upgradeTo",
      inputs: [
        {
          name: "newImplementation",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "upgradeToAndCall",
      inputs: [
        {
          name: "newImplementation",
          type: "address",
          internalType: "address",
        },
        { name: "data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "function",
      name: "vote",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
        {
          name: "_voteOption",
          type: "uint8",
          internalType: "enum IMajorityVoting.VoteOption",
        },
        { name: "_tryEarlyExecution", type: "bool", internalType: "bool" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "votingMode",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint8",
          internalType: "enum MajorityVotingBase.VotingMode",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "AdminChanged",
      inputs: [
        {
          name: "previousAdmin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "newAdmin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "BeaconUpgraded",
      inputs: [
        {
          name: "beacon",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Initialized",
      inputs: [
        {
          name: "version",
          type: "uint8",
          indexed: false,
          internalType: "uint8",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "MembersAdded",
      inputs: [
        {
          name: "members",
          type: "address[]",
          indexed: false,
          internalType: "address[]",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "MembersRemoved",
      inputs: [
        {
          name: "members",
          type: "address[]",
          indexed: false,
          internalType: "address[]",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "MembershipContractAnnounced",
      inputs: [
        {
          name: "definingContract",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ProposalCreated",
      inputs: [
        {
          name: "proposalId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "creator",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "startDate",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
        {
          name: "endDate",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
        {
          name: "metadata",
          type: "bytes",
          indexed: false,
          internalType: "bytes",
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
          name: "allowFailureMap",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ProposalExecuted",
      inputs: [
        {
          name: "proposalId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Upgraded",
      inputs: [
        {
          name: "implementation",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "VoteCast",
      inputs: [
        {
          name: "proposalId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "voter",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "voteOption",
          type: "uint8",
          indexed: false,
          internalType: "enum IMajorityVoting.VoteOption",
        },
        {
          name: "votingPower",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "VotingSettingsUpdated",
      inputs: [
        {
          name: "votingMode",
          type: "uint8",
          indexed: false,
          internalType: "enum MajorityVotingBase.VotingMode",
        },
        {
          name: "supportThreshold",
          type: "uint32",
          indexed: false,
          internalType: "uint32",
        },
        {
          name: "minParticipation",
          type: "uint32",
          indexed: false,
          internalType: "uint32",
        },
        {
          name: "minDuration",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
        {
          name: "minProposerVotingPower",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "DaoUnauthorized",
      inputs: [
        { name: "dao", type: "address", internalType: "address" },
        { name: "where", type: "address", internalType: "address" },
        { name: "who", type: "address", internalType: "address" },
        { name: "permissionId", type: "bytes32", internalType: "bytes32" },
      ],
    },
    {
      type: "error",
      name: "DateOutOfBounds",
      inputs: [
        { name: "limit", type: "uint64", internalType: "uint64" },
        { name: "actual", type: "uint64", internalType: "uint64" },
      ],
    },
    {
      type: "error",
      name: "MinDurationOutOfBounds",
      inputs: [
        { name: "limit", type: "uint64", internalType: "uint64" },
        { name: "actual", type: "uint64", internalType: "uint64" },
      ],
    },
    {
      type: "error",
      name: "ProposalCreationForbidden",
      inputs: [{ name: "sender", type: "address", internalType: "address" }],
    },
    {
      type: "error",
      name: "ProposalExecutionForbidden",
      inputs: [
        { name: "proposalId", type: "uint256", internalType: "uint256" },
      ],
    },
    {
      type: "error",
      name: "RatioOutOfBounds",
      inputs: [
        { name: "limit", type: "uint256", internalType: "uint256" },
        { name: "actual", type: "uint256", internalType: "uint256" },
      ],
    },
    {
      type: "error",
      name: "VoteCastForbidden",
      inputs: [
        { name: "proposalId", type: "uint256", internalType: "uint256" },
        { name: "account", type: "address", internalType: "address" },
        {
          name: "voteOption",
          type: "uint8",
          internalType: "enum IMajorityVoting.VoteOption",
        },
      ],
    },
  ],
} as const
