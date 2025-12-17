import React from 'react'

export default function Notification({type='info', children}){
  return (
    <div className={`notification ${type}`}>
      {children}
    </div>
  )
}
