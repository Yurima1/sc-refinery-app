import { debounceEffect } from "../../../util"
import AdminDataTable from "../_table"
import useQueryState from "../_query"
import Breadcrumb from "../../../components/breadcrumb"
import { useAppContext } from "../../../components/app"
import constants from "../../../constants"
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
    width: 0.5,
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
    width: 2,
  },
  {
    header: {
      title: "creator",
    },
    body: {
      value: "creator.name",
    },
    filterable: "creator_name",
    sortable: "creator_name",
    width: 2,
  },
  {
    header: {
      title: "users_invited_count",
      classnames: "text-ellipsis",
    },
    body: {
      value: "users_invited_count",
    },
    width: 1,
  },
  {
    header: {
      title: "entries_count",
      classnames: "text-ellipsis",
    },
    body: {
      value: "entries_count",
    },
    width: 1,
  },
  {
    header: {
      title: "yield_scu",
    },
    body: {
      value: "yield_scu",
    },
    sortable: "yield_scu",
    width: 1,
  },
  {
    header: {
      title: "yield_uec",
    },
    body: {
      value: "yield_uec",
    },
    sortable: "yield_uec",
    width: 1,
  },
  {
    header: {
      title: "created",
    },
    body: {
      value: "created",
    },
    sortable: "created",
    width: 1,
  },
  {
    header: {
      title: "updated",
    },
    body: {
      value: "updated",
    },
    sortable: "updated",
    width: 1,
  },
  {
    header: {
      title: "archived",
    },
    body: {
      value: "archived",
    },
    sortable: "archived",
    width: 1,
  },
]

const AdminMiningSessionIndex = () => {
  const { apiConnector } = useAppContext()
  const [queryState, queryDispatch] = useQueryState()

  debounceEffect(
    () => {
      apiConnector
        .api("GET", "/mining_session/?" + queryState.queryParams)
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
  console.log(queryState)

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "Mining Session", href: constants.BASEURL + "/admin/mining_session" },
        ]}
      />
      <AdminDataTable
        columns={columns}
        queryState={queryState}
        queryDispatch={queryDispatch}
        onRowClicked={(row) => route(`${constants.BASEURL}/admin/mining_session/${row.id}`)}
      />
    </div>
  )
}

export default AdminMiningSessionIndex
