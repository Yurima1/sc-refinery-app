import classnames from "classnames/dedupe"

const DropdownSelect = ({ id, items, selected, onSelect, css }) => (
  <div class={classnames("mb-3", css?.main)}>
    <select
      class={classnames("form-select", css?.select)}
      id={id}
      onChange={(e) => onSelect(parseInt(e.target.value, 10))}
    >
      {items.map(([optValue, optLabel]) => (
        <option key={optValue} value={optValue} selected={selected === optValue}>
          {optLabel}
        </option>
      ))}
    </select>
  </div>
)

export default DropdownSelect
