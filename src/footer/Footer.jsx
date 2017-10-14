import './Footer.css'
import React from 'react'

export default function Footer() {
  return (
    <footer className='footer'>
      <div>
        <span className='footer__title'>View it on&nbsp;</span>
        <a className='footer__link' href="https://github.com/kettuniko/rolling-gallery">Github</a>
      </div>
      <div>
        <span className='footer__title'>Image copyrights&nbsp;</span>
        <a className='footer__link' href="https://imgur.com/">imgur.com</a>
      </div>
    </footer>
  )
}
