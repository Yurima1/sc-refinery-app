import { route } from "preact-router"
import { useEffect, useReducer } from "preact/hooks"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useAppContext } from "../../../components/app"
import StationForm from "./_form"
import constants from "../../../constants"
import { useActionReducer } from "../../../util"
import defaultActions from "../_defaultActions"

const actions = {
  ...defaultActions,

  loadSuccess: (state, { model, ores }) => {
    const nextState = { ...state }
    if (model !== undefined) nextState.model = model
    if (ores !== undefined) nextState.ores = ores
    nextState.isReady = nextState.ores !== null && nextState.model !== null
    return nextState
  },
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

const AdminStationCreate = () => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actions, {
    model: {
      id: null,
      name: null,
      efficiencies: []
    },
    ores: null,
    isReady: false,
  })

  useEffect(loadOres(apiConnector, dispatch, state), [state.ores])

  const saveModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("POST", "/station/")
      .json(model)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        route(`${constants.BASEURL}/admin/station/${context.json.id}`)
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
