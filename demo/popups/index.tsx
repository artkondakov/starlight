import React, { FunctionComponent } from "react";
import { PopupProps } from "./index.types";

export const Popup: FunctionComponent<PopupProps> = ({
  title,
  text,
  button,
  onClose
}) => {
    return (
        <div style={{position: 'absolute', width: '300px', top: '30%', left: '50%', marginLeft: '-150px', background: 'white', border: '5px solid black', padding: '20px' }}>
          <h3 style={{marginBottom: '15px'}}>{title}</h3>
          <p>{text}</p>
          <button>{button}</button>
          <button style={{position: 'absolute', top: '10px', right: '10px'}} onClick={onClose}>❌</button>
        </div>
    );
};
