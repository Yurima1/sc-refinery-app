import { Fragment } from "preact"
import classnames from "classnames/dedupe"
import { LoginForm } from "./loginForm"


const Modal = ({ title, show, children }) => (
  <div class={classnames("modal", "fade", {show})}
      style={{ display: show ? "block" : "none" }} tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{title}</h5>
        </div>
        <div class="modal-body">
          {children}
        </div>
      </div>
    </div>
  </div>
)

const LoginFormModal = ({ loginFailed, dispatch }) => (
  <Modal show={true} title="Login">
    {loginFailed &&
      <div class="alert alert-danger">{loginFailed}</div>
    }
    <LoginForm onCredentialsReady={
      (credentials) => dispatch({
        type: "loginCredentialsReady", credentials
      })
    } />
  </Modal>
)

export const handleModalActions = (state, action) => {
  switch (action.type) {
    case "showModal":
      return { ...state, show: action.modal }

    case "resetModal":
      return { ...state, show: null }
  }
  return state
}

export const ModalLayer = ({ show, dispatch, ...props }) => (
  <Fragment>
    <div
      class={classnames("modal-backdrop", "fade", { show: Boolean(show)})}
      style={{ display: show ? "block" : "none" }} />
    {show === "login" &&
      <LoginFormModal {...props} dispatch={dispatch} />
    }
  </Fragment>
)
