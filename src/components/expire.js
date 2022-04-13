import { Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'


const Expire = ({ duration, children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, duration * 1000);
  }, [ duration ]);

  if (visible)
    return <Fragment>{children}</Fragment>
}

export default Expire
