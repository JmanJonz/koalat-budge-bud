import React from 'react'
import { Button } from '../../reusable-components/Button/Button'
import { Link } from 'react-router-dom'

export const EntryPage = () => {
  return (
    <div>
        <Button></Button>
        <nav>
            <Link to="/test">Go To Test Page</Link>
        </nav>
    </div>
  )
}
