import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useEffect, useReducer } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import StationForm from "./_form"
import constants from "../../../constants"
import { route } from "preact-router"

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
    case "loadFailed": {
      return { ...state, isReady: true }
    }
    default:
      return state
  }
}

const AdminStationCreate = () => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useReducer(handleForm, {
    model: {
      id: null,
      name: null,
      efficiency: []
    },
    ores: null,
    isReady: false,
  })

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
      .api("POST", "/station/")
      .json(model)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        console.log("station save model", context.json)
        route(`${constants.BASEURL}/admin/station/${context.json.id}`)
      })
      .catch((context) => {
        dispatch({type: "loadFailed", response: context.json})
      })
  }

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "Station", href: constants.BASEURL + "/admin/station" },
          { label: "Create" },
        ]}
      />
      <Spinner isReady={state.isReady}>
        <StationForm ores={state.ores} model={state.model} onSave={saveModel} />
      </Spinner>
    </div>
  )
}

export default AdminStationCreate
