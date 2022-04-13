import { useReducer, useState } from "preact/hooks"
import { Icon } from "./icon"
import { debounceEffect } from "../util"


export const filterReducer = (state, action) => {
  // state = { key1: filter_value, key2: filter_value }
  // dispatch({ filter: {key2: filter_value} })
  const { filter } = action
  return { ...state, ...filter }
}

export const useFilterState = () => useReducer(filterReducer, {})

export const FilterInput = ({ onChange, value, debounce=200, id="UNINITIALIZED" }) => {
  const [_value, setValue] = useState(value)
  debounceEffect(() => onChange(_value), [_value], debounce)
  return <div class="input-group input-group-sm">
    <input id={id} type="text" value={_value} class="form-control"
      placeholder="type to filter..."
      onInput={ev => setValue(ev.target.value) } />
    <button class="btn btn-secondary" type="button"
      onClick={ev => { ev.preventDefault(); ev.stopPropagation(); setValue("") }}>
      <Icon cls="x-circle-fill" />
    </button>
  </div>
}

export const FilteringTableHeader = ({ onChange, title, value }) => {
  return <th>
    <div>{title}</div>
    <FilterInput onChange={onChange} value={value} />
  </th>
}
