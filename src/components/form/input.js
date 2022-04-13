import classnames from "classnames/dedupe"

const InputGroup = ({ prefix, postfix, children }) => {
  const isGroup = prefix !== undefined || postfix !== undefined
  if (isGroup)
    return (
      <div class="input-group">
        {prefix !== undefined && <span class="input-group-text">{prefix}</span>}
        {children}
        {postfix !== undefined && <span class="input-group-text">{postfix}</span>}
      </div>
    )
  return children
}

const Col = ({ horizontal, children }) => (
  horizontal
    ? <div class="col">{children}</div>
    : children
)

const Input = ({ label, prefix, postfix, css, horizontal, ...props }) => {

  return (
    <div class={classnames({ "mb-3": !horizontal, row: horizontal }, css?.main)}>
      {label !== undefined && (
        <label for={props.id} class={classnames("form-label", {"col-form-label": horizontal}, css?.label)}>
          {label}
        </label>
      )}
      <Col horizontal={horizontal}>
        <InputGroup prefix={prefix} postfix={postfix}>
          <input class={classnames("form-control", css?.input)} {...props} />
        </InputGroup>
      </Col>
    </div>
  )
}

export default Input
