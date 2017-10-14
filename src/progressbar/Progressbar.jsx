import './Progressbar.css'

import React from 'react'

export default function Progressbar({ duration }) {
  return (
    <div className='progressbar' style={{ animationDuration: `${duration / 1000}s` }}/>
  )
}
