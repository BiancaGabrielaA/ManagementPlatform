import type { Team } from "../../../api/teams.api";
import type { UserListItem } from "../../../api/users.api";

interface Props {
  team: Team;
  onMembersChanged: (teamId: number, updatedMembers: UserListItem[]) => void;
}

function TeamMembers({ team, onMembersChanged }: Props)
{
    return(
        <>
        </>
    )
}

export default TeamMembers;