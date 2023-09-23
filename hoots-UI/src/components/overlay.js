import React, { useEffect, useState } from "react";

import styled from "styled-components";

const OverlayContainer = styled.div`
    height: 100vh;
    width: 100vw;
    position: absolute;
    background: black;
    z-index: 10;
    opacity: 0.5;   
`


const Overlay = () => {

  useEffect(() => {

  }, []);

  return (
    <OverlayContainer>
    </OverlayContainer>
  );
};

export default Overlay;
