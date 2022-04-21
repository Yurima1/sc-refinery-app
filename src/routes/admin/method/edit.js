import { route } from "preact-router"
import { useEffect, useReducer } from "preact/hooks"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useAppContext } from "../../../components/app"
import MethodForm from "./_form"
import constants from "../../../constants"
import { useActionReducer } from "../../../util"
import defaultActions from "../_defaultActions"

const actionHandlers = {
  ...defaultActions,

  loadSuccess: (state, { model, ores }) => {
    const nextState = { ...state }
    if (model !== undefined) nextState.model = model
    if (ores !== undefined) nextState.ores = ores
    nextState.isReady = nextState.ores !== null && nextState.model !== null
    return nextState
  },
}

const loadMethod = (apiConnector, dispatch, state) => () => {
  if (state.model !== null) return;
  dispatch.loading()
  apiConnector
    .api("GET", `/method/${state.modelId}`)
    .fetch()
    .then((result) => result.json())
    .then((context) => {
      dispatch.loadSuccess({ model: context.json })
    })
    .catch(() => {
      dispatch.loadFailure()
    })
}

const loadOres = (apiConnector, dispatch, state) => () => {
  if (state.ores !== null) return
  dispatch.loading()
  apiConnector
    .api("GET", "/ore/?limit=-1")
    .fetch()
    .then((result) => result.json())
    .then((context) => {
      dispatch.loadSuccess({ ores: context.json.items })
    })
    .catch(() => {
      dispatch.loadFailure()
    })
}

const AdminMethodEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(
    actionHandlers,
    {
      modelId,
      model: null,
      ores: null,
      isReady: false,
    }
  )

  useEffect(loadMethod(apiConnector, dispatch, state), [state.model])
  useEffect(loadOres(apiConnector, dispatch, state), [state.ores])

  const updateModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("PUT", `/method/${model.id}`)
      .json(model)
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
      .api("DELETE", `/method/${model.id}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/method/")
      })
      .catch(() => {
        dispatch.loadFailure()
      })
  }

  return (
    <div class="m-3 flex-grow-1">
      <Spinner isReady={state.isReady}>
        <Breadcrumb
          items={[
            { label: "Admin", href: constants.BASEURL + "/admin" },
            { label: "Method", href: constants.BASEURL + "/admin/method" },
            { label: `${state.model?.name} (${state.model?.id})` },
          ]}
        />
        <MethodForm
          ores={state.ores}
          model={state.model}
          onSave={updateModel}
          onDelete={deleteModel}
        />
      </Spinner>
    </div>
  )
}

export default AdminMethodEdit
