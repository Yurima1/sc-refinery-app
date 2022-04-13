import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useEffect, useReducer } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import StationForm from "./_form"
import { route } from "preact-router"
import constants from "../../../constants"

const handleForm = (state, action) => {
  switch (action.type) {
    case "loading": {
      return { ...state, isReady: false }
    }
    case "loadSuccess": {
      const { model, ores } = action
      const nextState = { ...state }
      if (model !== undefined)
        nextState.model = model
      if (ores !== undefined)
        nextState.ores = ores
      nextState.isReady = (nextState.ores !== null && nextState.model !== null)
      return nextState
    }
    default:
      return state
  }
}

const AdminStationEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useReducer(handleForm, {
    modelId,
    model: null,
    ores: null,
    isReady: false,
  })

  useEffect(() => {
    if (state.model !== null) return;
    dispatch({type: "loading"})
    apiConnector
      .api("GET", `/station/${modelId}`)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch({
          type: "loadSuccess",
          model: context.json
        })
      })
      .catch(() => {})
  }, [state.model])

  useEffect(() => {
    if (state.ores !== null) return;
    dispatch({ type: "loading" })
    apiConnector
      .api("GET", "/ore/?limit=-1")
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch({ type: "loadSuccess", ores: context.json.items })
      })
      .catch(() => {})
  }, [state.ores])

  const saveModel = (model) => {
    dispatch({ type: "loading" })
    apiConnector
      .api("PUT", `/station/${model.id}`)
      .json(model)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        dispatch({ type: "loadSuccess", model: context.json })
      })
      .catch(() => {})
  }

  const deleteModel = (modelId) => {
    dispatch({ type: "loading" })
    apiConnector
      .api("DELETE", `/station/${modelId}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/station/")
      })
      .catch(() => {})
  }

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "Station", href: constants.BASEURL + "/admin/station" },
          { label: state.model?.id },
        ]}
      />
      <Spinner isReady={state.isReady}>
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
