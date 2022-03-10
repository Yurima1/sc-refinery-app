import DataTable from "../../components/dataTable"
import { SortingTableHeader } from "../../components/sorting"
import { FilteringTableHeader, FilterInput } from "../../components/filtering"

const bodyViewJson = (item) => (
  <td class="border-top">
    <pre class="m-0">{JSON.stringify(item)}</pre>
  </td>
)

const bodyViewSelect = (column) => {
  if (column.body.view === "json") {
    column.body = { ...column.body, view: bodyViewJson }
  }
  return column
}

const headerViewSelect = (column, queryState, queryDispatch) => {
  const sortValue = queryState.sort[column.sortable]
  const filterValue = queryState.filter[column.filterable]
  const queryDispatchSort = () =>
    queryDispatch("sort", { sort: column.sortable })
  const queryDispatchFilter = (value) =>
    queryDispatch("filter", { filter: { [column.filterable]: value } })
  if (column.sortable !== undefined && column.filterable !== undefined) {
    column.header.view = () => (
      <SortingTableHeader
        onClick={queryDispatchSort}
        title={column.header.title}
        value={sortValue}
      >
        <FilterInput onChange={queryDispatchFilter} value={filterValue} />
      </SortingTableHeader>
    )
  }
  else if (column.sortable !== undefined) {
    const sortValue = queryState.sort[column.sortable]
    column.header.view = () => (
      <SortingTableHeader
        onClick={queryDispatchSort}
        title={column.header.title}
        value={sortValue}
      />
    )
  }
  else if (column.filterable !== undefined) {
    const filterValue = queryState.filter[column.filterable]
    column.header.view = () => (
      <FilteringTableHeader
        onChange={queryDispatchFilter}
        title={column.header.title}
        value={filterValue}
      />
    )
  }
  return column
}

const columnViewSelect = (columns, queryState, queryDispatch) =>
  columns.map((column) =>
    bodyViewSelect(headerViewSelect({ ...column }, queryState, queryDispatch))
  )

export default ({ columns, queryState, queryDispatch, onRowClicked }) => (
  <DataTable
    columns={columnViewSelect(columns, queryState, queryDispatch)}
    items={queryState.items}
    onRowClicked={onRowClicked}
  />
)
