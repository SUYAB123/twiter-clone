import React, { useEffect, useState } from "react";

import styled from "styled-components";

const FooterContainer = styled.div`
    height: 4vh;
    margin-top: 6px;
    display: flex;
    width:100%;
    justify-content: center;
    gap: 10px;
    font-size: 12px;
    color: grey;
`


const Footer = () => {

  useEffect(() => {

  }, []);

  return (
    <FooterContainer>
        <div>About</div>
        <div>Help Center</div>
        <div>Blog</div>
        <div>Status</div>
        <div>Jobs</div>
        <div>Terms</div>
        <div>Privacy Policy</div>
        <div>Cookies</div>
        <div>Ads Info</div>
        <div>Brand</div>
        <div>Apps</div>
        <div>Advertise</div>
        <div>Marketing</div>
        <div>Businesses</div>
        <div>Developers</div>
        <div>Directory</div>
        <div>Settings</div>
        <div>© 2023 Hoots</div>
    </FooterContainer>
  );
};

export default Footer;
