import React, { useState} from 'react'

 

const Square = props => {

  const [width, setWidth] = useState(props.size)
  const [height, setHeight] = useState(props.size)
  const [position, setPosition] = useState(props.size)
  const [left, setLeft] = useState(props.size)
  const [top, setTop] = useState(props.size)
  let style = {}

  props.alive ? style.backgroundColor = '#000' : style.backgroundColor = 'yellow'
  

  return (
    <div className="square" style={style} ></div>
  )

  

}


export default Square