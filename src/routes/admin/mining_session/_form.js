import Input from "../../../components/form/input"
import UserSearchInput from "../_userSearchInput"

const MiningSessionForm = ({ model, onDelete }) => {
  return (
    <form class="mt-3 mb-3" action="javascript:void(0)">
      <Input
        label="Name"
        id="mining-session-name"
        type="text"
        placeholder="mining-session name"
        value={model.name}
        onChange={(e) => this.setState({ name: e.target.value })}
      />
      <UserSearchInput
        id="mining-session-creator"
        label="Creator"
        value={model.creator}
      />
      <Input
        label="Created"
        id="mining-session-created"
        type="text"
        value={model.created}
        disabled={true}
      />
      <Input
        label="Updated"
        id="mining-session-updated"
        type="text"
        value={model.updated}
        disabled={true}
      />
      <div class="text-end">
        {onDelete !== undefined && (
          <button type="button" class="btn btn-danger me-2">
            Delete
          </button>
        )}
        <button type="button" class="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  )
}

export default MiningSessionForm
