import { Component } from "preact"
import Input from "../../../components/form/input"
import UserFriends from "./_friends"

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.initialState = { ...props.model }
    this.state = { ...this.initialState }
  }
  render({ onSave, onDelete }, model) {
    return (
      <form class="container-fluid" action="javascript:void(0)">
        <div class="row">
          <div class="col">
            <Input
              label="Email address"
              type="text"
              class="form-control"
              id="user-mail"
              placeholder="user@mail"
              value={model.mail}
              onChange={(e) => {
                console.info("input prop onChange")
                this.setState({ mail: e.target.value })
              }}
            />
            <Input
              label="Name"
              type="text"
              class="form-control"
              id="user-name"
              value={model.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              class="form-control"
              id="user-password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <Input
              label="Password Confirmation"
              type="password"
              class="form-control"
              id="user-password-confirm"
              onChange={(e) =>
                this.setState({ password_confirm: e.target.value })
              }
            />
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value={model.is_active}
                id="user-active"
                checked={model.is_active}
                onChange={(e) => this.setState({ is_active: e.target.checked })}
              />
              <label class="form-check-label" for="user-active">
                Active
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value={model.is_admin}
                id="user-is-admin"
                checked={model.is_admin}
                onChange={(e) => this.setState({ is_admin: e.target.checked })}
              />
              <label class="form-check-label" for="user-is-admin">
                Is Admin
              </label>
            </div>
          </div>
          <div class="col">
            <h5>Friends</h5>
            <UserFriends
              model={model.friends}
              onChange={(friends) => this.setState({ friends })}
            />
          </div>
        </div>
        <div class="text-end mt-3">
          {onDelete !== undefined && (
            <button
              type="submit"
              class="btn btn-danger me-2"
              onClick={() => onDelete(this.state)}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => onSave(this.state)}
          >
            Save
          </button>
        </div>
      </form>
    )
  }
}

export default UserForm
