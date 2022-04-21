import { useEffect, useReducer } from "preact/hooks"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useAppContext } from "../../../components/app"
import UserForm from "./_form"
import constants from "../../../constants"
import { useActionReducer } from "../../../util"
import defaultActions from "../_defaultActions"


const actions = {
  ...defaultActions,

  loadSuccess: (state, { model }) =>
    ({ ...state, model, isReady: model !== undefined })

}

const loadUser = (apiConnector, dispatch, state) => () => {
  if (state.model !== null) return
  dispatch.loading()
  apiConnector
    .api("GET", `/user/${state.modelId}`)
    .fetch()
    .then((result) => result.json())
    .then((context) => {
      dispatch.loadSuccess({ model: context.json })
    })
    .catch(() => {
      dispatch.loadFailure()
    })
}

const AdminUserEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actions, {
    modelId,
    model: null,
    isReady: true,
  })

  useEffect(loadUser(apiConnector, dispatch, state), [state.model])

  const updateModel = (data) => {
    dispatch.loading()
    apiConnector
      .api("PUT", `/user/${state.modelId}`)
      .json(data)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch.loadSuccess({ model: context.json })
      })
      .catch(() => {
        dispatch.loadFailure()
      })
  }

  const deleteModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("DELETE", `/user/${model.id}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/user/")
      })
      .catch(() => {
        dispatch.loadFailure()
      })
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
