import { Component } from "preact"
import Input from "../../../components/form/input"

class Efficiencies extends Component {
  /**
   * @constructor
   * @param {object} props
   * @param {array} props.model
   * @param {function} props.onChange
   */
  constructor({ model }) {
    super()
    const efficiencyBonusPerOreId = model.reduce(
      (agg, item) => ({ ...agg, [item.ore_id]: item.efficiency_bonus }),
      {}
    )
    this.initialState = efficiencyBonusPerOreId
    this.state = { ...this.initialState }
  }

  setValue = (ore_id, value) => {
    this.setState({ [ore_id]: parseFloat(value) / 100 }, () => {
      const { onChange } = this.props
      onChange(
        Object.keys(this.state).map((ore_id) => ({
          ore_id: parseInt(ore_id, 10),
          efficiency_bonus: this.state[ore_id],
        }))
      )
    })
  }

  render({ ores }, state) {
    return ores.map((ore, index) => (
      <Input
        key={ore.id}
        label={ore.name}
        postfix="%"
        type="number"
        min="-100"
        max="100"
        step="1"
        id={`station-efficiency-bonus-${index}`}
        value={Math.round((state[ore.id] || 0) * 100)}
        onInput={(e) => this.setValue(ore.id, e.target.value)}
        horizontal={true}
        css={{
          label: "col-2",
          main: {
            "bg-light": index % 2 == 0,
            "border-top": true,
            "pt-2": true,
            "pb-2": true,
          },
        }}
      />
    ))
  }
}

class StationForm extends Component {
  /**
   * @param {object} props
   * @param {object} props.model
   * @param {array} props.ores
   * @param {function} props.onSave
   */
  constructor(props) {
    super()
    this.initialState = { ...props.model }
    this.state = { ...this.initialState }
  }

  render({ ores, onSave, onDelete }, state) {
    return (
      <form action="javascript:void(0)">
        <div>
          <Input
            label={translate("Station Name")}
            id="station-name"
            type="text"
            placeholder={translate("station name")}
            value={state.name}
            onInput={(e) => this.setState({ name: e.target.value })}
            css={{ main: "mb-4" }}
          />
        </div>
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-2">{translate("Ore")}</div>
            <div class="col">{translate("Efficiency bonus")}</div>
          </div>
          <Efficiencies
            ores={ores}
            model={state.efficiencies}
            onChange={(efficiencies) => this.setState({ efficiencies })}
          />
        </div>
        <div class="text-end mt-3">
          {onDelete !== undefined && (
            <button
              type="submit"
              class="btn btn-danger me-2"
              onClick={() => onDelete(state.id)}
            >
               {translate("Delete")}
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

export default StationForm
