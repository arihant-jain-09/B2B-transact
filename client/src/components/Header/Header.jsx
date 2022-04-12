import React from 'react'
import Button from '../Button/Button'
import { Link } from 'react-router-dom'
import './Header.scss'
const Header = () => {
  return (
    <>
      <div className='header'>
        <div className="header__items">
          <div className="header__items-left">
            <div className="header__items-left--logo">
              <Link to='/'>B2B</Link>
            </div>
          </div>
          <div className="header__items-middle">
            <div className="header__items-middle--item header-font">
              <Link to='/companies'>Companies</Link>
            </div>
            <div className="header__items-middle--item header-font">
              <Link to='/users'>Users</Link>
            </div>
            <div className="header__items-middle--item header-font">
              <Link to='/invoices'>Invoices</Link>
            </div>
          </div>
          <div className="header__items-right">
            <div className="header__items-right--button">
              <a href='https://github.com/arihant-jain-09/B2B-transact' target='_blank' rel='noreferrer'>
                <Button>Github</Button>
              </a>
            </div>
          </div>          
        </div>
      </div>
    </>
  )
}

export default Header