import { Fragment } from "preact"
import { Icon } from "../../../components/icon"
import UserSearchInput from "../_userSearchInput"

const MiningSessionParticipants = ({ model, addParticipant, removeParticipant, onSave }) => {
  return (
    <Fragment>
      <div class="mining-session-participants-grid mt-3 mb-3">
        {model.users_invited.map((user) => (
          <button class="mining-session-participant-button btn text-nowrap text-start"
            onClick={() => removeParticipant(user)}>
            <Icon cls="x-square-fill" />
            {user.name}
          </button>
        ))}
      </div>
      <UserSearchInput
        id="mining-session-participant"
        label="Add Participant"
        onChange={addParticipant}
        clearOnChange={true}
      />
      <div class="mt-3 text-end">
        <button type="button" class="btn btn-primary" onClick={() => onSave(model)}>
          Save
        </button>
      </div>
    </Fragment>
  )
}

export default MiningSessionParticipants
