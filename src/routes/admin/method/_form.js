import { Component } from "preact"
import Input from "../../../components/form/input"
import classnames from "classnames/dedupe"

class ValuesPerOre extends Component {
  /**
   * @constructor
   * @param {object} props
   * @param {array} props.ores
   * @param {array} props.model
   * @param {function} props.onChange
   */
  constructor({ ores, model }) {
    super()
    this.initialState = ores.reduce((agg, ore) => ({
      ...agg,
      [ore.id]: {
        ore_id: ore.id,
        efficiency: 0,
        cost: 0,
        duration: 0
      }
    }), {})
    model.forEach((item) => {
      this.initialState[item.ore_id] = item
    })
    this.state = { ...this.initialState }
  }

  setValue = (data) => {
    const { onChange } = this.props
    const item = { ...this.state[data.ore_id], ...data }
    this.setState({ [item.ore_id]: item }, () => {
      onChange(Object.values(this.state))
    })
  }

  render({ ores }, state) {
    return ores.map((ore, index) => (
      <div
        key={ore.id}
        id={`method-ore-item-${ore.id}`}
        class={classnames("row border-top pt-2 pb-2", {
          "bg-light": index % 2 == 0,
        })}
      >
        <label class="col-form-label col-2">{ore.name}</label>
        <Input
          postfix="%"
          type="number"
          min="0"
          max="100"
          step="0.01"
          id={`method-ore-efficiency-${ore.id}`}
          value={Number(state[ore.id].efficiency * 100).toFixed(2)}
          onChange={(e) =>
            this.setValue({
              ore_id: ore.id,
              efficiency: parseFloat(e.target.value) / 100,
            })
          }
          css={{ main: { col: 1, "mb-3": 0 } }}
        />
        <Input
          postfix="aUEC"
          type="number"
          min="0"
          id={`method-ore-cost-${ore.id}`}
          value={state[ore.id].cost}
          onChange={(e) =>
            this.setValue({
              ore_id: ore.id,
              cost: parseInt(e.target.value, 10),
            })
          }
          css={{ main: { col: 1, "mb-3": 0 } }}
        />
        <Input
          postfix="seconds"
          type="number"
          min="0"
          id={`method-ore-duration-${ore.id}`}
          value={state[ore.id].duration}
          onChange={(e) =>
            this.setValue({
              ore_id: ore.id,
              duration: parseInt(e.target.value, 10),
            })
          }
          css={{ main: { col: 1, "mb-3": 0 } }}
        />
      </div>
    ))
  }
}


export default class MethodForm extends Component {
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

  render ({ ores, onSave, onDelete }, state) {
    return (
      <form action="javascript:void(0)" class="col-xxl-6">
        <div>
          <Input
            label="Method Name"
            id="method-name"
            type="text"
            placeholder="method name"
            value={state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
            css={{ main: "mb-4" }}
          />
        </div>
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-2">Ore</div>
            <div class="col">Efficiency</div>
            <div class="col">Cost per Unit</div>
            <div class="col">Duration per Unit</div>
          </div>
          <ValuesPerOre
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
              onClick={() => onDelete(state)}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => onSave(state)}
          >
            Save
          </button>
        </div>
      </form>
    )
  }
}
