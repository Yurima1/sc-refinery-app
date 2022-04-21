export default {
  loading: (state, data) => ({ ...state, isReady: false }),
  loadFailure: (state, data) => ({ ...state, isReady: true }),
}
