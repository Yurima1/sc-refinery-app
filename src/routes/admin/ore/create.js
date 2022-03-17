import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useEffect, useReducer } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import OreForm from "./_form"
import { route } from "preact-router"

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
    case "loadFailed": {
      const { response } = action
      validation = response.invalid || []
      return { ...state, validation, isReady: true }
    }
    default:
      return state
  }
}

export default (props) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useReducer(handleForm, {
    model: null,
    validation: null,
    isReady: true,
  })

  const saveModel = (model) => {
    dispatch({ type: "loading" })
    apiConnector
      .api("POST", "/ore/")
      .json(model)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        route(`/app/admin/ore/${context.json.id}`)
      })
      .catch((context) => {
        dispatch({
          type: "loadFailed",
          response: context.json
        })
      })
  }

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/app/admin" },
          { label: "Ore", href: "/app/admin/ore" },
          { label: "Create" },
        ]}
      />
      <Spinner isReady={state.isReady}>
        <OreForm
          model={state.model}
          onSave={saveModel} />
      </Spinner>
    </div>
  )
}
