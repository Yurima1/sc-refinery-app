import { Component, Fragment } from "preact"
import classnames from "classnames/dedupe"

const DropdownMenu = ({ options, viewFn, show, onOptionClicked }) => {
  const onClick = (ev, value) => {
    ev.stopPropagation()
    ev.preventDefault()
    onOptionClicked(value)
  }
  return (
    <ul
      class={classnames("dropdown-menu", { show })}
      style="max-height:50vh;overflow-y:auto;transform:translate(0, 40px);"
    >
      {options.map((optValue, index) => (
        <li key={index}>
          <a
            class="dropdown-item"
            href="#"
            onClick={(ev) => onClick(ev, optValue)}
          >
            {viewFn(optValue)}
          </a>
        </li>
      ))}
    </ul>
  )
}

const DropdownMenuWidget = ({ options, viewFn, showMenu, onToggleClicked, onOptionClicked }) => {
  const onClick = (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    onToggleClicked()
  }
  return (
    <Fragment>
      <button
        onClick={onClick}
        type="button"
        class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
      >
        <span class="visually-hidden">Toggle Dropdown</span>
      </button>
      <DropdownMenu
        options={options}
        viewFn={viewFn}
        show={showMenu}
        onOptionClicked={onOptionClicked}
      />
    </Fragment>
  )
}

class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      searchValue: null,
      value: props.value,
      options: [],
    }
  }

  onInputChanged = (ev) => {
    this.setState({
      searchValue: ev.target.value
    }, () => this.fetchOptions())
  }

  fetchOptions = () => {
    const { searchFn } = this.props
    const { searchValue } = this.state
    return searchFn(searchValue).then((options) => {
      this.setState({ options, showMenu: true })
    })
  }

  setValue = (value) => {
    const { clearOnChange, onChange } = this.props
    const state = { searchValue: null, showMenu: false }
    if (!clearOnChange) {
      state.value = value
    }
    this.setState(state, () => onChange(value))
  }

  toggleMenu = () => {
    const showMenu = !this.state.showMenu
    if (showMenu) {
      this.fetchOptions()
    }
    this.setState({ showMenu })
  }

  render({ id, label, placeholder, viewFn, css }, state) {
    return (
      <div class={classnames("mb-3", css?.main)}>
        <label for={id} class="form-label">
          {label}
        </label>
        <div class="input-group dropdown">
          <input
            autocomplete="off"
            type="text"
            class="form-control"
            id={id}
            placeholder={placeholder}
            value={state.searchValue !== null ? state.searchValue : viewFn(state.value)}
            onInput={this.onInputChanged}
          />
          <DropdownMenuWidget
            viewFn={viewFn}
            options={state.options}
            showMenu={state.showMenu}
            onToggleClicked={this.toggleMenu}
            onOptionClicked={this.setValue}
          />
        </div>
      </div>
    )
  }
}

export default SearchInput
