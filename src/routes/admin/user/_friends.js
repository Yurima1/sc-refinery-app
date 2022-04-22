import { useState, useEffect } from "preact/hooks"
import { Icon } from "../../../components/icon"
import UserSearchInput from "../_userSearchInput"


const UserFriends = ({ model, onChange }) => {
  const [state, setState] = useState(model)

  const add = (user) => {
    const list = [...state]
    const is_included = list.some((it) => it.id === user.id)
    if (!is_included)
      list.push(user)
    setState(list)
  }

  const remove = (user) => {
    const list = state.filter((it) => it.id !== user.id)
    setState(list)
  }

  useEffect(() => { onChange(state) }, [state])

  return (
    <div class="user-friends">
      <div class="user-list-grid mt-3 mb-3">
        {model?.map((user) => (
          <button
            title={user.name}
            class="btn btn-danger-hover text-nowrap text-start text-ellipsis"
            onClick={() => remove(user)}
          >
            <Icon cls="x-square-fill" />
            {user.name}
          </button>
        ))}
      </div>
      <UserSearchInput
        id="mining-session-participant"
        label="Add friend"
        onChange={add}
        clearOnChange={true}
      />
    </div>
  )
}

export default UserFriends
