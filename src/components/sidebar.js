import { Fragment } from "preact"
import { useState } from "preact/hooks"
import classnames from "classnames/dedupe"
import { FilterInput } from './filtering'
import { Icon } from "./icon"

export const Sidebar = ({ children }) => (
  <div class="sidebar bg-light p-3">
    {children}
  </div>
)

const itemFilter = (filterValue) => {
  if (filterValue && filterValue.length > 0) {
    return it => it.label.toLowerCase().includes(filterValue.toLowerCase())
  }
  return () => true
}

export const SidebarItem = ({ label, active, href, icon }) => {
  return (
    <li class="nav-item">
      <a class={classnames("nav-link", { active })} href={href}>
        {icon && <Icon cls={icon} />}
        {label}
      </a>
    </li>
  )
}

export const SidebarList = ({ filterInputId, filterInputValue="", items, children }) => {
  const [ filterValue, setFilterValue ] = useState(filterInputValue)

  return <Fragment>
    <FilterInput id={filterInputId} value={filterValue}
                 onChange={setFilterValue} debounce={0} />
    <ul class="nav nav-pills flex-column scrollarea">
      {items.filter(itemFilter(filterValue)).map((it, index) =>
        <li key={index} class="nav-item">
          <a class={classnames("nav-link", { active: it.active })} href={it.href}>
            {it.icon && <Icon cls={it.icon} />}{it.label}
          </a>
        </li>
      )}
      {children}
    </ul>
  </Fragment>
}
