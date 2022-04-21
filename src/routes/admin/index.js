import { Router } from 'preact-router'
import constants from "../../constants"
import Sidebar from "./_sidebar"
import UserIndex from "./user/index"
import UserEdit from "./user/edit"
import UserCreate from './user/create'
import StationIndex from "./station/index"
import StationEdit from "./station/edit"
import StationCreate from "./station/create"
import MethodIndex from "./method/index"
import MethodEdit from "./method/edit"
import MethodCreate from "./method/create"
import OreIndex from "./ore/index"
import OreEdit from "./ore/edit"
import OreCreate from "./ore/create"
import MiningSessionIndex from './mining_session/index'
import MiningSessionCreate from "./mining_session/create"
import MiningSessionEdit from "./mining_session/edit"


const Default = () => (
  <div class="p-3">Default</div>
)

const AdminIndex = () => {
  return (
    <div class="d-flex flex-grow-1">
      <Sidebar />
      <Router>
        <Default path={constants.BASEURL + "/admin"} />

        <UserIndex path={constants.BASEURL + "/admin/user"} />
        <UserEdit path={constants.BASEURL + "/admin/user/:modelId"} />
        <UserCreate path={constants.BASEURL + "/admin/user/create"} />

        <StationIndex path={constants.BASEURL + "/admin/station"} />
        <StationEdit path={constants.BASEURL + "/admin/station/:modelId"} />
        <StationCreate path={constants.BASEURL + "/admin/station/create"} />

        <MethodIndex path={constants.BASEURL + "/admin/method"} />
        <MethodEdit path={constants.BASEURL + "/admin/method/:modelId"} />
        <MethodCreate path={constants.BASEURL + "/admin/method/create"} />

        <OreIndex path={constants.BASEURL + "/admin/ore"} />
        <OreEdit path={constants.BASEURL + "/admin/ore/:modelId"} />
        <OreCreate path={constants.BASEURL + "/admin/ore/create"} />

        <MiningSessionIndex path={constants.BASEURL + "/admin/mining_session"} />
        <MiningSessionEdit path={constants.BASEURL + "/admin/mining_session/:modelId/:rest*"} />
        <MiningSessionCreate path={constants.BASEURL + "/admin/mining_session/create"} />
      </Router>
    </div>
  )
}

export default AdminIndex
