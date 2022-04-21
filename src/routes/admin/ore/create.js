import { route } from "preact-router"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import { useAppContext } from "../../../components/app"
import { useActionReducer } from "../../../util"
import OreForm from "./_form"
import constants from "../../../constants"
import defaultActions from "../_defaultActions"

const actions = {
  ...defaultActions,

  loadSuccess: (state, { model }) => {
    const nextState = { ...state }
    if (model !== undefined)
      nextState.model = model
    nextState.isReady = (nextState.model !== null)
    return nextState
  },
}

const AdminOreCreate = () => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actions, {
    model: null,
    validation: null,
    isReady: true,
  })

  const saveModel = (model) => {
    dispatch.loading()
    apiConnector
      .api("POST", "/ore/")
      .json(model)
      .fetch()
      .then((result) => result.json())
      .then((context) => {
        route(`${constants.BASEURL}/admin/ore/${context.json.id}`)
      })
      .catch((context) => {
        dispatch.loadFailure()
      })
  }

  return (
    <div class="m-3 flex-grow-1">
      <Breadcrumb
        items={[
          { label: "Admin", href: constants.BASEURL + "/admin" },
          { label: "Ore", href: constants.BASEURL + "/admin/ore" },
          { label: "Create" },
        ]}
      />
      <Spinner isReady={state.isReady}>
        <OreForm model={state.model} onSave={saveModel} />
      </Spinner>
    </div>
  )
}

export default AdminOreCreate
