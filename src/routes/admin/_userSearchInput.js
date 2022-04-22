import { useAppContext } from "../../components/app"
import SearchInput from "../../components/form/searchInput"
import isNil from "lodash/isNil"

const userView = (user) => isNil(user) ? "" : `${user.name} (${user.id})`

const UserSearchInput = (props) => {
  const { apiConnector } = useAppContext()
  const searchUsersFn = (name) =>
    apiConnector
      .api("GET", `/user/?filter=name:${name || ""}&limit=-1&sort=name:asc`)
      .fetch()
      .then((result) => result.json())
      .then((context) =>
        (context.json.items || []).map((it) => ({ id: it.id, name: it.name }))
    )

  return <SearchInput
    placeholder="type to search user by name..."
    searchFn={searchUsersFn}
    viewFn={userView}
    {...props}
  />
}

export default UserSearchInput
