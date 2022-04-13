import {
  filterableToQuery,
  sortableToQuery,
  usvEncode,
} from "../../util"
import { sortableReducer } from "../../components/sorting"
import { filterReducer } from "../../components/filtering"
import { useReducer } from "preact/hooks"

const handleQueryState = (state, action) => {
  switch (action.type) {
    case "sort": {
      const sort = sortableReducer(state.sort, action)
      const nextState = { ...state, sort }
      return { ...nextState, queryParams: queryParams(nextState) }
    }
    case "filter": {
      const filter = filterReducer(state.filter, action)
      const nextState = { ...state, filter, page: 0 }
      return { ...nextState, queryParams: queryParams(nextState) }
    }
    case "page": {
      const nextState = {
        ...state,
        page: action.page
      }
      return { ...nextState, queryParams: queryParams(nextState) }
    }
    case "loading": {
      return {...state, status: "loading"}
    }
    case "querySuccess": {
      return {
        ...state,
        status: "ready",
        items: action.items,
        totalCount: action.total_count,
        totalPages: Math.ceil(action.total_count / state.perPage)
      }
    }
  }
  return state
}

const queryParams = ({ page, perPage, sort, filter }) => {
  const limit = perPage
  const offset = perPage * page
  sort = sortableToQuery(sort)
  filter = filterableToQuery(filter)
  return usvEncode({ offset, limit, sort, filter })
}

export default () => {
  const initState = {
    status: "init",
    page: 0,
    perPage: 20,
    sort: {},
    filter: {},
    items: [],
    totalCount: 0,
    totalPages: 0,
    queryParams: ""
  }
  initState.queryParams = queryParams(initState)
  const [state, dispatch] = useReducer(handleQueryState, initState)
  return [state, (type, data) => dispatch({ type, ...data })]
}
