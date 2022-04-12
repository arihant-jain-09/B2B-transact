import React from 'react'
import './Button.scss';

const Button = ({children}) => {
  return (
    <>
      <div className="button">
        <span className='button__text header-font'>{children}</span>
      </div>
    </>
  )
}

export default Button