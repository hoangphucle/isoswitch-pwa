import React from "react"
import "./Button.css"

export default function Button({ children, onClick }) {
  const createRipple = e => {
    const button = e.currentTarget
    const circle = document.createElement("span")
    circle.className = "ripple"
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    circle.style.width = circle.style.height = size + "px"
    circle.style.left = e.clientX - rect.left - size/2 + "px"
    circle.style.top = e.clientY - rect.top - size/2 + "px"
    button.appendChild(circle)
    setTimeout(()=>circle.remove(),600)
  }

  const handleClick = e => {
    createRipple(e)
    if(onClick) onClick(e)
  }

  return (
    <button className="ios-button" onClick={handleClick}>
      {children}
    </button>
  )
}
