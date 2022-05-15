import React from "react";

var textFieldStyles = {
  width: '200px',
  height: '20px',
  border: '3px solid brown',
  
}

export default function TextField(props) {
    return (<input style={textFieldStyles} {...props} />)
}