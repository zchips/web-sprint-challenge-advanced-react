import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // State variables
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  // Helper to calculate the coordinates
  function getXY(index) {
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1
    return { x, y }
  }

  // Helper to get the coordinates message
  function getXYMessage() {
    const { x, y } = getXY(index)
    return `Coordinates (${x}, ${y})`
  }

  // Helper to reset all states
  function reset() {
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  // Helper to get the next index based on direction
  function getNextIndex(direction) {
    const { x, y } = getXY(index)
    switch (direction) {
      case 'left':
        return x > 1 ? index - 1 : index
      case 'up':
        return y > 1 ? index - 3 : index
      case 'right':
        return x < 3 ? index + 1 : index
      case 'down':
        return y < 3 ? index + 3 : index
      default:
        return index
    }
  }

  // Event handler for move buttons
  function move(evt) {
    const direction = evt.target.id
    const nextIndex = getNextIndex(direction)
    if (nextIndex !== index) {
      setIndex(nextIndex)
      setSteps(steps + 1)
      setMessage('')
    } else {
      setMessage(`You can't go ${direction}`)
    }
  }

  // Event handler for input change
  function onChange(evt) {
    setEmail(evt.target.value)
  }

  // Event handler for form submit
  async function onSubmit(evt) {
    evt.preventDefault()
    const { x, y } = getXY(index)
    const payload = { x, y, steps, email }

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (response.status === 200) {
        setMessage(data.message)
      } else {
        setMessage(data.message)
      }
      setEmail('')  // Reset the email input
    } catch (error) {
      setMessage('An unexpected error occurred')
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
