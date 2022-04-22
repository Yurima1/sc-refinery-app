import { useEffect } from "preact/hooks"
import { useAppContext } from "../../../components/app"
import { useActionReducer } from "../../../util"
import constants from "../../../constants"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import MiningSessionEntryForm from "./_entryForm"
import defaultActions from "../_defaultActions"
import isNil from "lodash/isNil"

const actions = {
  ...defaultActions,

  loadSuccess: (state, data) => {
    return {
      ...state,
      isReady: true,
      session: { id: data.id, name: data.name },
      model: data.entries.find((entry) => entry.id === state.entryId),
    }
  }
}

const load = (apiConnector, dispatch, state) => () => {
  if (state.model !== null) return
  dispatch.loading()
  apiConnector
    .api("GET", `/mining_session/${state.modelId}`)
    .fetch()
    .then((result) => result.json())
    .then((context) => {
      dispatch.loadSuccess(context.json)
    })
    .catch(() => {
      dispatch.loadFailure()
    })
}

const AdminMiningSessionEntryEdit = ({ modelId, entryId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actions, {
    modelId: parseInt(modelId, 10),
    entryId: parseInt(entryId, 10) || null,
    session: null,
    model: null,
    isReady: false,
  })

  useEffect(load(apiConnector, dispatch, state), [state.modelId, state.entryId])

  const entryDelete = (entry) => {
    dispatch.loading()
    apiConnector
      .api("DELETE", `/mining_session/${state.session.id}/entry/${entry.id}`)
      .fetch()
      .then(() => {
        route(`${constants.BASEURL}/admin/mining_session/${state.session.id}/`)
      })
      .catch(() => {
        dispatch.loadFailure()
      })
  }

  const entryUpdate = (entry) => {
    dispatch.loading()
    apiConnector
      .api("PUT", `/mining_session/${state.session.id}/entry/${entry.id}`)
      .json(entry)
      .fetch()
      .then((response) => response.json())
      .then((context) => {
        dispatch.loadSuccess({ model: context.json })
      })
      .catch(() => {
        dispatch.loadFailure()
      })
  }

  const entryCreate = (entry) => {
    dispatch.loading()
    apiConnector
      .api("POST", `/mining_session/${state.session.id}/entry`)
      .json(entry)
      .fetch()
      .then((response) => response.json())
      .then((context) => {
        dispatch.loadSuccess({ model: context.json })
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
            {
              label: "Mining Session",
              href: constants.BASEURL + "/admin/mining_session",
            },
            {
              label: `${state.session?.name} (${state.session?.id})`,
              href: `${constants.BASEURL}/admin/mining_session/${state.session?.id}`,
            },
            { label: isNil(state.entryId) ? "Create entry" : state.entryId },
          ]}
        />
        <MiningSessionEntryForm
          model={state.model}
          onDelete={isNil(state.entryId) ? null : entryDelete}
          onSave={isNil(state.entryId) ? entryCreate : entryUpdate}
        />
      </Spinner>
    </div>
  )
}

export default AdminMiningSessionEntryEdit
