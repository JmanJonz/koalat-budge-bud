import React from 'react'
import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../../../atoms'
import { CurrentUserFlag } from '../../reusable-components/current-user-flag/current-user-flag'

export const MenuPage = () => {
  const currentUser = useAtomValue(currentUserAtom);

  const menuStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333'
  };

  const linkContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const linkStyle = {
    display: 'block',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  return (
    <div style={menuStyle}>
      <CurrentUserFlag username={currentUser?.username || ""} />
      <h1 style={titleStyle}>Budget Buddy Menu</h1>
      <img 
        src="/512ktbudgebudiconlogo.png" 
        alt="logo" 
        style={{ display: 'block', margin: '0 auto 40px', width: '100px', height: '100px' }}
      />
      
      <div style={linkContainerStyle}>
        <Link 
          style={linkStyle} 
          to={"/"}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          📝 Track Transaction
        </Link>

        <Link 
          style={linkStyle} 
          to={"/transaction-list"}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          📋 Transaction History
        </Link>

        <Link 
          style={linkStyle} 
          to={"/dashboard"}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          📊 Dashboard & Analytics
        </Link>

        <Link 
          style={linkStyle} 
          to={"/category-manager"}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          🏷️ Manage Categories
        </Link>

        <Link 
          style={linkStyle} 
          to={"/household-manager"}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          🏠 Household Manager
        </Link>

        <Link 
          style={linkStyle} 
          to={"/login-page"}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          🔐 Account
        </Link>
      </div>
    </div>
  )
}
