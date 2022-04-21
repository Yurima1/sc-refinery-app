import { useEffect, useReducer } from "preact/hooks"
import { Router } from "preact-router"
import { useAppContext } from "../../../components/app"
import { useActionReducer } from "../../../util"
import constants from "../../../constants"
import Breadcrumb from "../../../components/breadcrumb"
import Spinner from "../../../components/spinner"
import MiningSessionTabs from "./_tabs"
import MiningSessionParticipants from "./_participants"
import MiningSessionEntries from "./_entries"
import MiningSessionForm from "./_form"
import MiningSessionEntryForm from "./_entryForm"
import defaultActions from "../_defaultActions"

const actions = {
  ...defaultActions,

  loadSuccess: (state, data) => ({
    ...state,
    isReady: true,
    model: data.model,
  }),

  addParticipant: (state, data) => {
    const users_invited = [...state.model.users_invited]
    const is_participant = users_invited.some((user) => user.id === data.id)
    if (!is_participant) {
      users_invited.push(data)
    }
    const model = { ...state.model, users_invited }
    return { ...state, model }
  },

  removeParticipant: (state, data) => {
    const users_invited = state.model.users_invited.filter((user) => user.id !== data.id)
    const model = { ...state.model, users_invited }
    return { ...state, model }
  }
}

const loadMiningSession = (apiConnector, dispatch, state) => () => {
  if (state.model !== null) return
  dispatch.loading()
  apiConnector
    .api("GET", `/mining_session/${state.modelId}`)
    .fetch()
    .then((result) => result.json())
    .then((context) => {
      dispatch.loadSuccess({ model: context.json })
    })
    .catch(() => {
      dispatch.loadFailure()
    })
}

const AdminMiningSessionEdit = ({ modelId }) => {
  const { apiConnector } = useAppContext()
  const [state, dispatch] = useActionReducer(actions, {
    modelId, model: null, isReady: false,
  })

  useEffect(loadMiningSession(apiConnector, dispatch, state), [state.model])

  const onSave = (model) => {
    dispatch.loading()
    apiConnector
      .api("PUT", `/mining_session/${model.id}`)
      .json(model)
      .fetch()
      .then((response) => response.json())
      .then((context) => {
        dispatch.loadSuccess({ model: context.json })
      })
      .catch(() => {
        dispatch.loadFailure()
      })
  }

  const onEntryDelete = (entry) => {
    dispatch.loading()
    apiConnector.api("DELETE", `/mining_session/${entry.session_id}/entry/${entry.id}`)
      .fetch()
      .then(() => {
        route(`${constants.BASEURL}/admin/mining_session/${state.modelId}/`)
      })
      .catch(() => {
        dispatch.loadFailure()
      })
  }
  const onEntrySave = (entry) => {
    dispatch.loading()
    apiConnector.api(
      "PUT",
      `/mining_session/${entry.session_id}/entry/${entry.id}`
    )
      .json(entry)
      .fetch()
      .then(response => response.json())
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
            { label: `${state.model?.name} (${state.model?.id})` },
          ]}
        />
        <MiningSessionTabs model={state.model} />
        <Router>
          <MiningSessionForm
            id="tab-mining-session-base-data"
            model={state.model}
            path={constants.BASEURL + "/admin/mining_session/:modelId"}
          />
          <MiningSessionEntries
            id="tab-mining-session-entries"
            model={state.model}
            path={constants.BASEURL + "/admin/mining_session/:modelId/entry"}
          />
          <MiningSessionEntryForm
            model={state.model}
            path={
              constants.BASEURL +
              "/admin/mining_session/:modelId/entry/:entryId"
            }
            onDelete={onEntryDelete}
            onSave={onEntrySave}
          />
          <MiningSessionParticipants
            id="tab-mining-session-participants"
            model={state.model}
            path={
              constants.BASEURL + "/admin/mining_session/:modelId/participant"
            }
            addParticipant={(value) =>
              dispatch.addParticipant(value)
            }
            removeParticipant={(value) =>
              dispatch.removeParticipant(value)
            }
            onSave={onSave}
          />
          <div
            id="tab-mining-session-payout-summary"
            model={state.model}
            path={constants.BASEURL + "/admin/mining_session/:modelId/payout"}
          ></div>
        </Router>
      </Spinner>
    </div>
  )
}

export default AdminMiningSessionEdit
