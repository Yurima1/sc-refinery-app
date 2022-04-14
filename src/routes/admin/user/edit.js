import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useEffect, useReducer } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import UserForm from "./_form"
import constants from "../../../constants"


const handleForm = (state, action) => {
  switch (action.type) {
    case "loading": {
      return { ...state, isReady: false }
    }
    case "loadSuccess": {
      return {...state, model: action.model, isReady: true }
    }
    default:
      return state
  }
}

const AdminUserEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useReducer(handleForm, {
    modelId,
    model: null,
    isReady: false,
  })

  useEffect(() => {
    if (state.isReady) return
    apiConnector
      .api("GET", `/user/${state.modelId}`)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch({ type: "loadSuccess", model: context.json })
      })
      .catch(() => {})
  }, [state.isReady])

  const updateModel = (data) => {
    dispatch({ type: "loading" })
    apiConnector
      .api("PUT", `/user/${state.modelId}`)
      .json(data)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch({ type: "loadSuccess", model: context.json })
      })
      .catch(() => {})
  }

  const deleteModel = (model) => {
    dispatch({ type: "loading" })
    apiConnector
      .api("DELETE", `/user/${model.id}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/user/")
      })
      .catch(() => {})
  }

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "User", href: constants.BASEURL + "/admin/user" },
          { label: state.model?.id },
        ]}
      />
      <Spinner isReady={state.isReady}>
        <UserForm
          model={state.model}
          onSave={updateModel}
          onDelete={deleteModel}
        />
      </Spinner>
    </div>
  )
}

export default AdminUserEdit
