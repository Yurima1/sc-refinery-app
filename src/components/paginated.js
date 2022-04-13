import { useReducer } from "preact/hooks"

const paginatedReducer = (state, action) => {
  // state = { page: number, perPage: number }
  // dispatch({ page: number })
  // dispatch({ perPage: number })
  const { page, perPage } = action
  const { totalCount } = state
  return {
    ...state,
    page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
    start: page * perPage
  }
}

export const usePaginatedState = (totalCount) => useReducer(paginatedReducer, { totalCount })
