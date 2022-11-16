import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
//  import { Avatar, IconButton } from '@mui/material'
// import { useState , useEffect} from 'react' 


import './InfoBar.css';

 function InfoBar  ({ room })  {



return(
  <div className="infoBar">
    <div className="leftInnerContainer">
    
    <img alt="Online Icon" src={onlineIcon}/>
     
      <h3 style={{color:"white"}}>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
)
};

export default InfoBar;

