import { Fragment } from "preact"
import { useAppContext } from "./app"
import Expire from "./expire"
import Offcanvas from "./offcanvas"
import classnames from "classnames/dedupe"
import { isArray } from "lodash"


const ToastBase = ({ header, body, css, created }) => (
  <div
    class={classnames("toast fade show", css?.main)}
    style="width:450px"
  >
    <div class={classnames("toast-header", css?.header)}>
      <strong class="me-auto">
        {header}
      </strong>
      <small>{created.fromNow()}</small>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
      />
    </div>
    <div class="toast-body bg-white">
      {body}
    </div>
  </div>
)

const ToastWarning = (props) => (
  <ToastBase
    {...props}
    css={{main: "border-warning", header: "bg-warning text-white"}}
  />
)

const ToastError = (props) => (
  <ToastBase
    {...props}
    css={{ main: "border-danger", header: "bg-danger text-white" }}
  />
)

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

const ValidationResult = ({ info }) => {
  if (typeof(info) === "string") {
    return info
  }
  const { invalid } = info
  if (typeof(invalid) === "string") {
    return invalid
  }
  if (isArray(info.invalid)) {
    return (
      <ul>
        {info.invalid.map(({ path, message }) => (
          <li>
            <span class="text-danger">{path}</span> {message}
          </li>
        ))}
      </ul>
    )
  }
  return <pre>{ JSON.stringify(info, null, 2)}</pre>
}

const NotificationToast = ({ status, statusText, created, body }) => {
  if (status == 400) {
    return <ToastWarning
      header="Invalid data"
      body={<ValidationResult info={safeJsonParse(body)} />}
      created={created}
    />
  }
  if (status == 401 || status == 403) {
    return <ToastError
      header="Unauthorized"
      body="You don't have permissions for this content"
    />
  }
  return (
    <ToastError
      header="Server Error"
      body={<pre>{props.body}</pre>}
      created={created}
    />
  )
}

const NotificationCard = ({ status, statusText, created, body }) => (
  <div class="card mb-2">
    <div class="card-body">
      <h5 class="card-title">
        Request failed: {status} {statusText}
      </h5>
      <h6 class="card-subtitle mb-2 text-muted">{created.format()}</h6>
      <pre className="card-text">{body}</pre>
    </div>
  </div>
)

export const Notifications = ({ items = [], showAll = false }) => {
  const {dispatch} = useAppContext()
  return (
    <Fragment>
      <Offcanvas
        onClose={() => dispatch({ type: "notificationsToggle" })}
        position="end"
        show={showAll}
      >
        {items.map((it, index) => (
          <NotificationCard key={index} {...it} />
        ))}
      </Offcanvas>
      <div class="toast-container position-absolute bottom-0 end-0 p-3">
        {items.map((it, index) => (
          <Expire key={index} duration={10}>
            <NotificationToast {...it} />
          </Expire>
        ))}
      </div>
    </Fragment>
  )
}
