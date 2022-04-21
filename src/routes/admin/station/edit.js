import { route } from "preact-router"
import { useEffect, useReducer } from "preact/hooks"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useAppContext } from "../../../components/app"
import StationForm from "./_form"
import constants from "../../../constants"
import defaultActions from "../_defaultActions"
import { useActionReducer } from "../../../util"


const actions = {
  ...defaultActions,

  loadSuccess: (state, {model, ores}) => {
    const nextState = { ...state }
    if (model !== undefined) nextState.model = model
    if (ores !== undefined) nextState.ores = ores
    nextState.isReady =
      nextState.ores !== null && nextState.model !== null
    return nextState
  }
}

const loadStation = (apiConnector, dispatch, state) => () => {
  if (state.model !== null) return
  dispatch.loading()
  apiConnector
    .api("GET", `/station/${state.modelId}`)
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

const AdminStationEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actions, {
    modelId,
    model: null,
    ores: null,
    isReady: false,
  })

  useEffect(loadStation(apiConnector, dispatch, state), [state.model])
  useEffect(loadOres(apiConnector, dispatch, state), [state.ores])

  const saveModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("PUT", `/station/${model.id}`)
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

  const deleteModel = (modelId) => {
    dispatch.loading()
    apiConnector
      .api("DELETE", `/station/${modelId}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/station/")
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
            { label: "Station", href: constants.BASEURL + "/admin/station" },
            { label: `${state.model?.name} (${state.model?.id})` },
          ]}
        />
        <StationForm
          ores={state.ores}
          model={state.model}
          onSave={saveModel}
          onDelete={deleteModel}
        />
      </Spinner>
    </div>
  )
}

export default AdminStationEdit
