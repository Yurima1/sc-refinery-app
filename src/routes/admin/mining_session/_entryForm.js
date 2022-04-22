import { Component } from "preact"
import isNil from "lodash/isNil"
import { useAppContext } from "../../../components/app"
import Input from "../../../components/form/input"
import UserSearchInput from "../_userSearchInput"
import SearchInput from "../../../components/form/searchInput"
import { formatDuration, parseDuration } from "../../../util"

const viewFn = (it) => (isNil(it) ? "" : `${it.name} (${it.id})`)

class MiningSessionEntryForm extends Component {
  constructor(props) {
    super(props)
    this.state = this.initState(props.model)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.initState(nextProps.model))
  }

  initState(entry) {
    if (isNil(entry))
      return {
        user: null,
        station: null,
        method: null,
        ore: null,
        quantity: 0,
        duration: 0,
      }
    return entry
  }

  render({ onDelete, onSave }, model) {
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
          value={model.user}
          onChange={(user) => this.setState({ user })}
        />
        <SearchInput
          id="mining-session-entry-station"
          label="Station"
          value={model.station}
          placeholder="type to search station by name..."
          searchFn={searchFn("station")}
          viewFn={viewFn}
          onChange={(station) => this.setState({ station })}
        />
        <SearchInput
          id="mining-session-entry-method"
          label="Method"
          value={model.method}
          placeholder="type to search method by name..."
          searchFn={searchFn("method")}
          viewFn={viewFn}
          onChange={(method) => this.setState({ method })}
        />
        <SearchInput
          id="mining-session-entry-ore"
          label="Ore"
          value={model.ore}
          placeholder="type to search ore by name..."
          searchFn={searchFn("ore")}
          viewFn={viewFn}
          onChange={(ore) => this.setState({ ore })}
        />
        <Input
          label="Quantity"
          id="mining-session-entry-quantity"
          type="number"
          min="0"
          value={model.quantity}
          onInput={(e) =>
            this.setState({ quantity: parseInt(e.target.value, 10) })
          }
        />
        <Input
          label="Duration"
          id="mining-session-entry-duration"
          value={formatDuration(model.duration)}
          onChange={(e) =>
            this.setState({ duration: parseDuration(e.target.value) })
          }
        />
        {model.created !== undefined && (
          <Input
            label="Created"
            id="mining-session-entry-created"
            type="text"
            value={model.created}
            disabled={true}
          />
        )}
        {model.updated !== undefined && (
          <Input
            label="Updated"
            id="mining-session-entry-updated"
            type="text"
            value={model.updated}
            disabled={true}
          />
        )}
        <div class="text-end">
          {!isNil(onDelete) && (
            <button
              type="button"
              class="flex-grow-0 btn btn-danger me-2"
              onClick={() => onDelete(model)}
            >
              Delete
            </button>
          )}
          {!isNil(onSave) && (
            <button
              type="button"
              class="flex-grow-0 btn btn-primary"
              onClick={() => onSave(model)}
            >
              Save
            </button>
          )}
        </div>
      </form>
    )
  }
}

export default MiningSessionEntryForm
