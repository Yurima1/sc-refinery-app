import { Component } from "preact"
import Input from "../../../components/form/input"


export default class OreForm extends Component {
  /**
   * @param {object} props
   * @param {object} props.model
   * @param {function} props.onSave
   */
  constructor(props) {
    super()
    this.initialState = { ...props.model }
    this.state = { ...this.initialState }
  }

  render({ onSave, onDelete }, state) {
    return (
      <form action="javascript:void(0)">
        <div>
          <Input
            label={translate("Ore Name")}
            id="ore-name"
            type="text"
            placeholder={translate("ore name")}
            value={state.name}
            onInput={(e) => this.setState({ name: e.target.value })}
            css={{ main: "mb-4" }}
          />
        </div>
        <div class="d-flex justify-content-between mt-3">
          {onDelete !== undefined && (
            <button
              type="submit"
              class="btn btn-danger"
              onClick={() => onDelete(state.id)}
            >
              {translate("Delete"]}
            </button>
          )}
          {onSave !== undefined && (
            <button
              type="submit"
              class="btn btn-primary"
              onClick={() => onSave(state)}
            >
              {translate("Save")}
            </button>
          )}
        </div>
      </form>
    )
  }
}
