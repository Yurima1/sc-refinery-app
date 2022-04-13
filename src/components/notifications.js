import { Fragment } from "preact"
import { useAppContext } from "./app"
import Expire from "./expire"
import Offcanvas from "./offcanvas"

const NotificationToast = ({ status, statusText, created, body }) => (
  <div
    class="toast fade show "
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    style="width:450px"
  >
    <div class="toast-header">
      <strong class="me-auto">
        Request failed: {status} {statusText}
      </strong>
      <small>{created.fromNow()}</small>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
      />
    </div>
    <div class="toast-body">
      <pre>{body}</pre>
    </div>
  </div>
)

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
