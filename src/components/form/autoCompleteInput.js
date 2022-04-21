import { Fragment } from "preact"
import { useReducer, useEffect } from 'preact/hooks'
import classnames from "classnames/dedupe"

const autoCompleteHandler = (state, action) => {
  switch (action.type) {
    case "toggleMenu":
      return { ...state, showMenu: !state.showMenu }
    case "menuItemClicked":
      return { ...state, showMenu: false, value: action.value }
    case "setValue":
      return { ...state, showMenu: false, value: action.value }
    default:
      return state
  }
}


const DropdownMenu = ({ options, show, dispatch }) => {
  const onClickDispatch = (ev, value) => {
    ev.stopPropagation()
    ev.preventDefault()
    dispatch({ type: "menuItemClicked", value })
  }
  return <ul class={classnames("dropdown-menu", {show})}
      style="max-height:50vh;overflow-y:auto">
    {options.map(optValue => (
      <li key={optValue}><a class="dropdown-item" href="#"
             onClick={(ev) => onClickDispatch(ev, optValue)}
      >{optValue}</a></li>
    ))}
  </ul>
}

const DropdownMenuWidget = ({ options, showMenu, dispatch }) => {
  const onClickDispatch = (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    dispatch({ type: "toggleMenu" })
  }
  return <Fragment>
    <button
      onClick={onClickDispatch}
      type="button"
      class="btn btn-secondary dropdown-toggle dropdown-toggle-split">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <DropdownMenu
      options={options}
      show={showMenu}
      dispatch={dispatch}
    />
  </Fragment>
}

const AutoCompleteInput = ({
    id="ERROR-ID-MISSING",
    label="ERROR-LABEL-MISSING",
    placeholder="Type to search...",
    options=[],
    value="",
    onChange=()=>{}
  }) => {
    const dataListId = `${id}-completion-list`
    const [ state, dispatch ] = useReducer(autoCompleteHandler, {
      showMenu: false,
      value
    })
    const onInputChanged = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      dispatch({ type: "setValue", value: ev.target.value })
    }
    useEffect(
      () => state.value && state.value != value && onChange(state.value),
      [ state.value ]
    )

    return (<div>
      <label for={id} class="form-label">{label}</label>
      <div class="input-group dropdown">
        <input type="text" class="form-control"
          list={dataListId}
          id={id}
          placeholder={placeholder}
          value={state.value}
          onChange={onInputChanged}
        />
        <DropdownMenuWidget
          options={options}
          showMenu={state.showMenu}
          dispatch={dispatch}
        />
      </div>
      <datalist id={dataListId}>
        {options.map(optValue => (
          <option key={optValue} value={optValue} />
        ))}
      </datalist>
    </div>)
}

export default AutoCompleteInput
