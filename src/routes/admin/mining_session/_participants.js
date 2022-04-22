import { Icon } from "../../../components/icon"
import UserSearchInput from "../_userSearchInput"

const MiningSessionParticipants = ({ model, add, remove, onSave }) => {
  return (
    <div class="mining-session-participants">
      <div class="user-list-grid mt-3 mb-3">
        {model.users_invited.map((user) => (
          <button
            title={user.name}
            class="btn btn-danger-hover text-nowrap text-start text-ellipsis"
            onClick={() => remove(user)}>
            <Icon cls="x-square-fill" />
            {user.name}
          </button>
        ))}
      </div>
      <UserSearchInput
        id="mining-session-participant"
        label="Add Participant"
        onChange={add}
        clearOnChange={true}
      />
      <div class="mt-3 text-end">
        <button type="button" class="btn btn-primary" onClick={() => onSave(model)}>
          Save
        </button>
      </div>
    </div>
  )
}

export default MiningSessionParticipants
