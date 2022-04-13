import { stopEvent } from "../../../util"
import { useState, useEffect } from "preact/hooks"
import Input from "../../../components/form/input"

const resources = [
  "user",
  "user_perm",
  "user_session",
  "station",
  "method",
  "ore",
  "mining_session",
  "mining_session_entry",
]

const actions = ["*", "index", "create", "update", "remove", "read"]

const UserPermsForm = ({ scopes = [], onChange }) => {
  const [state, setState] = useState(scopes)
  const hasStar = state.indexOf("*") > -1

  const toggleScope = (scope) => {
    const idx = state.indexOf(scope)
    if (idx > -1) setState(state.filter((it) => it !== scope))
    else setState([...state, scope])
  }
  useEffect(() => onChange(state), [state, onChange])

  return (
    <div class="d-flex justify-content-between">
      <div>
        <strong>Admin</strong>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value={state.indexOf("*") > -1}
            id={`user-scope-admin`}
            checked={state.indexOf("*") > -1}
            onChange={stopEvent(() => toggleScope("*"))}
          />
          <label class="form-check-label" for={`user-scope-admin`}>
            Admin
          </label>
        </div>
      </div>
      {resources.map((resource, resource_key) => (
        <div key={`${resource}${resource_key}`}>
          <strong>{resource}</strong>
          {actions.map((action, action_key) => (
            <div class="form-check" key={`${action}${action_key}`}>
              <input
                class="form-check-input"
                type="checkbox"
                value={state.indexOf(`${resource}.${action}`) > -1}
                id={`user-scope-${resource}-${action}`}
                checked={state.indexOf(`${resource}.${action}`) > -1}
                onChange={stopEvent(() =>
                  toggleScope(`${resource}.${action}`)
                )}
                disabled={hasStar}
              />
              <label
                class="form-check-label"
                for={`user-scope-${resource}-${action}`}
              >
                {action}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const UserForm = ({ model, onSave }) => {
  const [state, setState] = useState({
    model
  })
  const updateModel = (data) => setState({
    ...state,
    model: {...state.model, ...data}
  })

  return (
    <form action="javascript:void(0)">
      <div>
        <Input
          label="Email address"
          type="text"
          class="form-control"
          id="user-mail"
          placeholder="user@mail"
          value={state.model.mail}
          onChange={(e) => updateModel({ mail: e.target.value })}
        />
        <Input
          label="Name"
          type="text"
          class="form-control"
          id="user-name"
          value={state.model.name}
          onChange={(e) => updateModel({ name: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          class="form-control"
          id="user-password"
          onChange={(e) => updateModel({ password: e.target.value })}
        />
        <Input
          label="Password Confirmation"
          type="password"
          class="form-control"
          id="user-password-confirm"
          onChange={(e) => updateModel({ password_confirm: e.target.value })}
        />
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value={state.model.is_active}
            id="user-active"
            checked={state.model.is_active}
            onChange={(e) => updateModel({ is_active: e.target.checked })}
          />
          <label class="form-check-label" for="user-active">
            Active
          </label>
        </div>
      </div>
      <UserPermsForm
        scopes={state.scopes}
        onChange={(val) => updateModel({ scopes: val })}
      />
      <div class="d-flex justify-content-between mt-3">
        <button type="submit" class="btn btn-danger">
          Delete
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => onSave(state.model)}
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default UserForm
