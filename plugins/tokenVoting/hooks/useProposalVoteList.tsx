import { useState, useEffect } from "react";
import { getAbiItem } from "viem";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import {
  Proposal,
  VoteCastEvent,
  VoteCastResponse,
} from "@/plugins/tokenVoting/utils/types";
import { usePublicClient } from "wagmi";
import { defaultChain } from "@/config/wagmi-config";
import { deployment } from "@/ovc-indexer/contracts/deployment";

const event = getAbiItem({ abi: TokenVotingAbi, name: "VoteCast" });

export function useProposalVoteList(
  proposalId: string,
  proposal: Proposal | null
) {
  const publicClient = usePublicClient({ chainId: defaultChain.id });
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;
    else if (!publicClient) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address:
        deployment.departments.departmentDaos.departmentFactory.departmentOwner
          .tokenVoting,
      event: event as any,
      args: {
        proposalId,
      } as any,
      fromBlock: proposal.parameters.snapshotBlock,
      toBlock: "latest", // TODO: Make this variable between 'latest' and proposal last block
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);
    if (newLogs.length > proposalLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs();
  }, [proposalId, proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}
