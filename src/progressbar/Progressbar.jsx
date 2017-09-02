import './Progressbar.css'

import React from 'react'

export default ({ duration }) =>
  <div className="progressbar" style={{ animationDuration: `${duration / 1000}s` }}/>
