import { route } from "preact-router"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useEffect } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import OreForm from "./_form"
import constants from "../../../constants"
import { useActionReducer } from "../../../util"
import defaultActions from "../_defaultActions"

const actionHandlers = {
  ...defaultActions,

  loadSuccess: (state, { model }) => (
    { ...state, model, isReady: model !== undefined }
  ),
}

const loadOre = (apiConnector, dispatch, state) => () => {
  if (state.model !== null) return
  dispatch.loading()
  apiConnector
    .api("GET", `/ore/${state.modelId}`)
    .fetch()
    .then((result) => result.json())
    .then((context) => {
      dispatch.loadSuccess({ model: context.json })
    })
    .catch(() => {
      dispatch.loadFailure()
    })
}

const AdminOreEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actionHandlers, {
    modelId,
    model: null,
    isReady: false,
  })

  useEffect(loadOre(apiConnector, dispatch, state), [state.model])

  const saveModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("PUT", `/ore/${model.id}`)
      .json(model)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch.loadSuccess({ model: context.json })
      })
      .catch(() => { dispatch.loadFailure() })
  }

  const deleteModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("DELETE", `/ore/${model.id}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/ore/")
      })
      .catch(() => { dispatch.loadFailure() })
  }

  return (
    <div class="m-3 flex-grow-1">
      <Spinner isReady={state.isReady}>
        <Breadcrumb
          items={[
            { label: "Admin", href: constants.BASEURL + "/admin" },
            { label: "Ore", href: constants.BASEURL + "/admin/ore" },
            { label: `${state.model?.name} (${state.model?.id})` },
          ]}
        />
        <OreForm
          model={state.model}
          onSave={saveModel}
          onDelete={deleteModel}
        />
      </Spinner>
    </div>
  )
}

export default AdminOreEdit
