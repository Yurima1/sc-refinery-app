import { debounceEffect } from "../../../util"
import AdminDataTable from "../_table"
import useQueryState from "../_query"
import Breadcrumb from "../../../components/breadcrumb"
import { useAppContext } from "../../../components/app"
import { route } from "preact-router"
import constants from "../../../constants"
import { Icon } from "../../../components/icon"

// TODO: what was I going to this for?
// const scopeMaxLength = 20

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
      classnames: "text-ellipsis"
    },
    width: 4,
    filterable: "name",
    sortable: "name",
  },
  {
    header: {
      title: "mail",
    },
    body: {
      value: "mail",
    },
    width: 6,
    filterable: "mail",
    sortable: "mail",
  },
  {
    header: {
      title: "is_admin",
    },
    body: {
      value: (row) => row.is_admin ? <Icon cls="check-square-fill"/> : "",
    },
    width: 4,
  },
  {
    header: {
      title: "created",
    },
    body: {
      value: "created",
    },
    width: 4,
    sortable: "created",
  },
  {
    header: {
      title: "updated",
    },
    body: {
      value: "updated",
    },
    width: 4,
    sortable: "updated",
  },
  {
    header: {
      title: "last_login",
    },
    body: {
      value: "last_login",
    },
    width: 4,
    sortable: "last_login",
  },
]

const AdminUserIndex = () => {
  const { apiConnector } = useAppContext()
  const [queryState, queryDispatch] = useQueryState()

  debounceEffect(
    () => {
      apiConnector
        .api("GET", "/user/?" + queryState.queryParams)
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
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "User" }
        ]}
      />
      <AdminDataTable
        columns={columns}
        queryState={queryState}
        queryDispatch={queryDispatch}
        onRowClicked={(row) => route(`${constants.BASEURL}/admin/user/${row.id}`)}
      />
      <div class="text-end">
        <a href={constants.BASEURL + "/admin/user/create"} type="button" class="btn btn-primary">
          Create
        </a>
      </div>
    </div>
  )
}

export default AdminUserIndex
