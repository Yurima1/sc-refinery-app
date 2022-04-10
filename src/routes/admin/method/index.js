import { debounceEffect } from "../../../components/util"
import AdminDataTable from "../_table"
import useQueryState from "../_query"
import Breadcrumb from "../../../components/breadcrumb"
import { useAppContext } from "../../../components/app"
import { route } from "preact-router"
import { translate } from "../../../components/util"

const columns = [
  {
    header: {
      title: "id",
    },
    body: {
      value: "id",
    },
    width: 0.5,
    sortable: "id",
  },
  {
    header: {
      title: "name",
    },
    body: {
      value: "name",
    },
    width: 6,
    filterable: "name",
    sortable: "name",
  },
  {
    header: {
      title: "created",
    },
    body: {
      value: "created",
    },
    width: 2,
    sortable: "created",
  },
  {
    header: {
      title: "updated",
    },
    body: {
      value: "updated",
    },
    width: 2,
    sortable: "updated",
  },
]

export default (props) => {
  const { apiConnector } = useAppContext()
  const [queryState, queryDispatch] = useQueryState()

  debounceEffect(
    () => {
      apiConnector
        .api("GET", "/method/?" + queryState.queryParams)
        .fetch()
        .then((result) => result.json())
        .then((context) => {
          queryDispatch("querySuccess", context.json)
        })
        .catch(() => {})
    },
    [queryState.queryParams],
    300
  )

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/app/admin" },
          { label: "Method", href: "/app/admin/method" },
        ]}
      />
      <AdminDataTable
        columns={columns}
        queryState={queryState}
        queryDispatch={queryDispatch}
        onRowClicked={(row) => route(`/app/admin/method/${row.id}`)}
      />
      <div class="text-end">
        <a
          href="/app/admin/method/create"
          type="button"
          class="btn btn-primary"
        >
          {translate("Create")}
        </a>
      </div>
    </div>
  )
}
