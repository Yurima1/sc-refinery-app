import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useEffect, useReducer } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import OreForm from "./_form"
import { route } from "preact-router"
import constants from "../../../constants"

const handleForm = (state, action) => {
  switch (action.type) {
    case "loading": {
      return { ...state, isReady: false }
    }
    case "loadSuccess": {
      const { model } = action
      const nextState = { ...state }
      if (model !== undefined)
        nextState.model = model
      nextState.isReady = (nextState.model !== null)
      return nextState
    }
    default:
      return state
  }
}

const AdminOreEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useReducer(handleForm, {
    modelId,
    model: null,
    isReady: false,
  })

  useEffect(() => {
    if (state.model !== null) return;
    dispatch({type: "loading"})
    apiConnector
      .api("GET", `/ore/${state.modelId}`)
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

  const saveModel = (model) => {
    dispatch({ type: "loading" })
    apiConnector
      .api("PUT", `/ore/${model.id}`)
      .json(model)
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
      .api("DELETE", `/ore/${model.id}`)
      .fetch()
      .then(() => {
        route(constants.BASEURL + "/admin/ore/")
      })
      .catch(() => {})
  }

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "Ore", href: constants.BASEURL + "/admin/ore" },
          { label: state.model?.id },
        ]}
      />
      <Spinner isReady={state.isReady}>
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
