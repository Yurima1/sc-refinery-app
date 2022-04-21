import { useAppContext } from "../../../components/app"
import Input from "../../../components/form/input"
import UserSearchInput from "../_userSearchInput"
import SearchInput from "../../../components/form/searchInput"

const viewFn = (it) => `${it.name} (${it.id})`

const MiningSessionEntryForm = ({ model, entryId, onDelete, onSave }) => {
  const entry = model.entries.find((it) => it.id == entryId)
  const { apiConnector } = useAppContext()
  const searchFn = (type) => (name) =>
    apiConnector
      .api("GET", `/${type}/?filter=name:${name || ""}&limit=-1&sort=name:asc`)
      .fetch()
      .then((result) => result.json())
      .then((context) =>
        (context.json.items || []).map((it) => ({ id: it.id, name: it.name }))
    )

  return (
    <form class="mt-3 mb-3" action="javascript:void(0)">
      <UserSearchInput
        id="mining-session-entry-user"
        label="User"
        value={entry.user}
      />
      <SearchInput
        id="mining-session-entry-station"
        label="Station"
        value={entry.station}
        placeholder="type to search station by name..."
        searchFn={searchFn("station")}
        viewFn={viewFn}
      />
      <SearchInput
        id="mining-session-entry-method"
        label="Method"
        value={entry.method}
        placeholder="type to search method by name..."
        searchFn={searchFn("method")}
        viewFn={viewFn}
      />
      <SearchInput
        id="mining-session-entry-ore"
        label="Ore"
        value={entry.ore}
        placeholder="type to search ore by name..."
        searchFn={searchFn("ore")}
        viewFn={viewFn}
      />
      <Input
        label="Quantity"
        id="mining-session-entry-quantity"
        type="number"
        min="0"
        value={entry.quantity}
      />
      <Input
        label="Duration"
        id="mining-session-entry-duration"
        value={entry.duration}
      />
      <Input
        label="Created"
        id="mining-session-entry-created"
        type="text"
        value={entry.created}
        disabled={true}
      />
      <Input
        label="Updated"
        id="mining-session-entry-updated"
        type="text"
        value={entry.updated}
        disabled={true}
      />
      <div class="text-end">
        {onDelete !== undefined && (
          <button type="button" class="flex-grow-0 btn btn-danger me-2"
          onClick={() => onDelete(entry)}>
            Delete
          </button>
        )}
        {onSave !== undefined && (
          <button type="button" class="flex-grow-0 btn btn-primary"
          onClick={() => onSave(entry)}>
            Save
          </button>
        )}
      </div>
    </form>
  )
}

export default MiningSessionEntryForm
