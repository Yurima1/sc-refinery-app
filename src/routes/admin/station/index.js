import { debounceEffect } from "../../../components/util"
import AdminDataTable from "../_table"
import useQueryState from "../_query"
import Breadcrumb from "../../../components/breadcrumb"
import { useAppContext } from "../../../components/app"
import { route } from "preact-router"

const columns = [
  {
    header: {
      title: "id",
    },
    body: {
      value: "id",
    },
    sortable: "id",
    width: 0.5
  },
  {
    header: {
      title: "name",
    },
    body: {
      value: "name",
    },
    filterable: "name",
    sortable: "name",
    width: 5
  },
  {
    header: {
      title: "created",
    },
    body: {
      value: "created",
    },
    sortable: "created",
    width: 2
  },
  {
    header: {
      title: "updated",
    },
    body: {
      value: "updated",
    },
    sortable: "updated",
    width: 2
  },
]

export default (props) => {
  const { apiConnector } = useAppContext()
  const [queryState, queryDispatch] = useQueryState()

  debounceEffect(
    () => {
      apiConnector
        .api("GET", "/station/?" + queryState.queryParams)
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
          { label: "Station", href: "/app/admin/station" },
        ]}
      />
      <AdminDataTable
        columns={columns}
        queryState={queryState}
        queryDispatch={queryDispatch}
        onRowClicked={(row) => route(`/app/admin/station/${row.id}`)}
      />
      <div class="text-end">
        <a
          href="/app/admin/station/create"
          type="button"
          class="btn btn-primary"
        >
           {translate("Create")}
        </a>
      </div>
    </div>
  )
}
