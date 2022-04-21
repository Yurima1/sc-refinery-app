import { Link } from "preact-router/match"

import constants from "../../../constants"
import { Icon } from "../../../components/icon"

const MiningSessionTabs = ({ model }) => {
  return (
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <Link
          href={`${constants.BASEURL}/admin/mining_session/${model.id}`}
          class="nav-link"
          activeClassName="active"
        >
          Base data
        </Link>
      </li>
      <li class="nav-item">
        <Link
          href={`${constants.BASEURL}/admin/mining_session/${model.id}/entry`}
          class="nav-link"
          activeClassName="active"
        >
          <Icon cls="list-ul" />
          Entries
        </Link>
      </li>
      <li class="nav-item">
        <Link
          href={`${constants.BASEURL}/admin/mining_session/${model.id}/participant`}
          class="nav-link"
          activeClassName="active"
        >
          <Icon cls="people-fill" />
          Participants
        </Link>
      </li>
      <li class="nav-item">
        <Link
          href={`${constants.BASEURL}/admin/mining_session/${model.id}/payout`}
          class="nav-link"
          activeClassName="active"
        >
          <Icon cls="currency-exchange" />
          Payout Summary
        </Link>
      </li>
    </ul>
  )
}

export default MiningSessionTabs
