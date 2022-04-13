const Spinner = ({ fullHeight=false, isReady, children }) => (
  (isReady)
  ? children
  : (
    <div class="d-flex justify-content-center align-items-center"
      style={fullHeight?"height:100vh":""}>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  )
)

const SpinnerOverlay = ({ isReady, children }) =>
  isReady ? (
    children
  ) : (
    <div
      class="spinner-overlay d-flex justify-content-center align-items-center position-absolute top-0 start-0 bottom-0 end-0"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  )

export default Spinner
export { SpinnerOverlay }
