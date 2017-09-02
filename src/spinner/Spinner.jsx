import './Spinner.css'
import { times } from 'ramda'
import React from 'react'

export default () =>
  <div className="spinner ispinner ispinner--gray ispinner--animating">
    {times((key) => <div key={key} className="ispinner__blade"/>, 12)}
  </div>
