import { stopEvent } from "../util"
import classnames from "classnames/dedupe"

const Pagination = ({ total, current, onClick }) => (
  <nav>
    <ul class="pagination pagination-sm justify-content-center">
      <li class={classnames("page-item", { disabled: current == 0 })}>
        <a
          class="page-link"
          href="#"
          onClick={stopEvent(() => onClick(current - 1))}
        >
          Previous
        </a>
      </li>
      {Array(total).fill().map((_, page) => (
        <li key={page} class={classnames("page-item", { active: page == current })}>
          <a
            class="page-link"
            href="#"
            onClick={stopEvent(() => onClick(page))}
          >
            {page + 1}
          </a>
        </li>
      ))}
      <li class={classnames("page-item", { disabled: current == total - 1 })}>
        <a
          class="page-link"
          href="#"
          onClick={stopEvent(() => onClick(current + 1))}
        >
          Next
        </a>
      </li>
    </ul>
  </nav>
)

export default Pagination
