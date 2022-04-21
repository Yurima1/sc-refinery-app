import { useRouter } from "preact-router"
import Link from "../../components/link"
import { Icon } from "../../components/icon"
import { Sidebar } from "../../components/sidebar"
import constants from "../../constants"

const SidebarItem = ({ label, href, path, icon }) => (
  <li class="nav-item">
    <Link href={href} path={`${href}/:rest*`} class="nav-link" activeClass="active">
      <Icon cls={icon} />
      {label}
    </Link>
  </li>
)

const AdminSidebar = () => {
  return (
    <Sidebar>
      <ul class="nav nav-pills flex-column scrollarea">
        <SidebarItem
          label="User"
          href={constants.BASEURL + "/admin/user"}
          icon="person-fill"
        />
        <SidebarItem
          label="Ore"
          href={constants.BASEURL + "/admin/ore"}
          icon="bucket-fill"
        />
        <SidebarItem
          label="Station"
          href={constants.BASEURL + "/admin/station"}
          icon="geo-fill"
        />
        <SidebarItem
          label="Method"
          href={constants.BASEURL + "/admin/method"}
          icon="funnel-fill"
        />
        <SidebarItem
          label="MiningSession"
          href={constants.BASEURL + "/admin/mining_session"}
          icon="people-fill"
        />
      </ul>
    </Sidebar>
  )
}

export default AdminSidebar
