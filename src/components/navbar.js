import { Link } from "preact-router/match"
<<<<<<< HEAD
import { stopEvent, translate } from "./util"
=======
import { stopEvent } from "../util"
>>>>>>> upstream/develop
import { useAppContext } from "./app"
import constants from "../constants"

const NavLink = (props) => (
  <li class="nav-item">
    <Link className="nav-link" activeClassName="active" href={props.href}>
      {props.children}
    </Link>
  </li>
)

const Navbar = () => {
  const { login, dispatch } = useAppContext()
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          SC-REFINERY
        </a>
        <button class="navbar-toggler" type="button">
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav flex-grow-1">
            <NavLink href={constants.BASEURL + "/"}>Home</NavLink>
            {login.user?.scopes?.indexOf("*") > -1 && (
              <NavLink href={constants.BASEURL + "/admin"}>Admin</NavLink>
            )}
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a
                href="#"
                class="nav-link"
                onClick={stopEvent(() => {
                  dispatch({ type: "notificationsToggle" })
                })}
              >
                {translate("Notifications")}
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link"
                onClick={stopEvent(() =>
                  dispatch(
                    login.user !== undefined
                      ? { type: "logout" }
                      : { type: "showModal", modal: "login" }
                  )
                )}
              >
                {login.user !== undefined ? "Logout" : "Login"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
