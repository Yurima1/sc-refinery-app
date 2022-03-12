import classnames from "classnames/dedupe"

const _defaultRowClicked = () => { }

export default ({
  columns,
  items,
  view = defaultTableView(),
  onRowClicked = _defaultRowClicked,
  children
}) => (
  <div class="data-table position-relative">
    <table class="table table-hover p-0" style="table-layout: fixed">
      <ColGroup columns={columns} />
      <TableHeader columns={columns} view={view} />
      <TableBody
        columns={columns}
        items={items}
        view={view}
        onRowClicked={onRowClicked}
      />
    </table>
    {children}
  </div>
)

const viewHeaderColumn = (column) => {
  const { header } = column
  if (!header) return ""
  const { title, view } = header
  if (view === undefined) {
    return <th class={classnames(header.classnames)}>{title}</th>
  }
  if (typeof view === "function") {
    return view.call(column)
  }
  return ""
}

const viewBodyColumn = (column, item) => {
  const { body } = column
  if (!body) return ""
  const { value, view } = body
  if (typeof view === "function") {
    return view.call(column, item)
  }
  if (typeof value === "function") {
    return <td class={classnames(body.classnames)}>{value.call(column, item)}</td>
  }
  return <td class={classnames(body.classnames)}>{item[value]}</td>
}

const defaultTableView = () => ({
  headerColumn: viewHeaderColumn,
  bodyColumn: viewBodyColumn
})

const _number = val => {
    try {
      return (parseFloat(val) || 1)
    }
    catch {
      return 1
    }
}

const ColGroup = ({ columns }) => {
  const widths = columns.map(col => _number(col.width))
  const totalWidth = widths.reduce((agg, curr) => agg + curr, 0)
  const fractions = widths.map(it =>
    Math.round(it / totalWidth * 100)
  )
  return (
    <colgroup>
      {fractions.map(
        fract => <col style={{ width: `${fract}%` }} />
      )}
    </colgroup>
  )
}

const TableHeader = ({ columns, view }) => (
  <thead class="table-light">
    <tr>{
      columns.map(col => view.headerColumn(col))
    }</tr>
  </thead>
)

const TableBody = ({ columns, items, view, onRowClicked }) => (
  <tbody>
    {items.map(item =>
      <tr onClick={ev => onRowClicked(item)}>{
        columns.map(col => view.bodyColumn(col, item))
      }</tr>
    )}
  </tbody>
)
