<<<<<<< HEAD
import { debounceEffect, translate } from "../../../components/util"
=======
import { debounceEffect } from "../../../util"
>>>>>>> upstream/develop
import AdminDataTable from "../_table"
import useQueryState from "../_query"
import Breadcrumb from "../../../components/breadcrumb"
import { useAppContext } from "../../../components/app"
import { route } from "preact-router"
import constants from "../../../constants"

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
    width: 4,
  },
  {
    header: {
      title: "sell_price",
    },
    body: {
      value: "sell_price",
    },
    sortable: "sell_price",
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
]

const AdminOreIndex = () => {
  const { apiConnector } = useAppContext()
  const [queryState, queryDispatch] = useQueryState()

  debounceEffect(
    () => {
      queryDispatch("loading", {})
      apiConnector
        .api("GET", "/ore/?" + queryState.queryParams)
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
<<<<<<< HEAD
          { label: translate("Admin"), href: "/app/admin" },
          { label: translate("Ore"), href: "/app/admin/ore" },
=======
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "Ore", href: constants.BASEURL + "/admin/ore" },
>>>>>>> upstream/develop
        ]}
      />
      <AdminDataTable
        columns={columns}
        queryState={queryState}
        queryDispatch={queryDispatch}
        onRowClicked={(row) =>
          route(`${constants.BASEURL}/admin/ore/${row.id}`)
        }
      />
      <div class="text-end">
<<<<<<< HEAD
        <a href="/app/admin/ore/create" type="button" class="btn btn-primary">
          {translate("Create")}
=======
        <a
          href={constants.BASEURL + "/admin/ore/create"}
          type="button"
          class="btn btn-primary"
        >
          Create
>>>>>>> upstream/develop
        </a>
      </div>
    </div>
  )
}

export default AdminOreIndex
