export const Icon = ({ cls }) => (
  <i class={"ms-1 me-1 bi bi-" + cls} />
)

export const IconSort = ({ value }) => (
  <Icon cls={
      (value === true)
        ? "sort-down-alt"
        : (value === false)
          ? "sort-down"
          : ""} />
)
