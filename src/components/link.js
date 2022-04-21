import { Link as StaticLink, exec, useRouter } from "preact-router"

export default function Link({
  className,
  activeClass,
  activeClassName,
  path,
  ...props
}) {
  const router = useRouter()[0]
  const matches =
    (path && exec(router.url, path, {})) ||
    exec(router.url, props.href, {})

  let inactive = props.class || className || ""
  let active = (matches && (activeClass || activeClassName)) || ""
  props.class = inactive + (inactive && active && " ") + active

  return <StaticLink {...props} />
}
