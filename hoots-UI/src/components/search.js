import Search from "antd/lib/transfer/search";
import React, { useEffect, useState } from "react";

import styled from "styled-components";
import Icon from "./icon";
import { useSelector } from "react-redux";

const Container = styled.div`
position : relative;
position: fixed;
width: 25%;
background-color: ${({theme})=> theme.bg};
z-index: 99;

`

const SearchBoxContainer = styled.div`
  justify-content: center;
  align-items: center;
  
  display: flex;
  border: 1px solid black;
  padding-left: 12px;
  border-radius: 35px;
  margin-top:10px;
  margin-bottom:10px;
  margin-left: 20px;
  background-color: white;
`

const SearchBoxField = styled.input`
    border: none;
    outline : none;
    color: black;
    text-align: left;
    font-size: 15px;
    font-weight: 500;
    padding: 12px;
    width: 100%;
    border-radius: 35px;
`

const Input = ({ input, type, placeholder }) => (
    <React.Fragment>
        <input {...input} type={type} placeholder={placeholder} autocapitalize="sentences" autocomplete="off" autocorrect="off" role="combobox" spellcheck="false" enterkeyhint="search" dir="auto" />
    </React.Fragment>
);

const SearchIcon = ["M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"]



const SearchBox = () => {
    const theme = useSelector((state) => state.theme);

    console.log(theme)

    return (
        <Container theme={theme}>
        <SearchBoxContainer theme={theme}>
            <Icon
                d={SearchIcon}
                width="18px"
                height="18px"
                fill={'rgb(113, 118, 123)'}
            />
            <SearchBoxField
                type="text"
                name="search"
                placeholder="Search"
            />
        </SearchBoxContainer>
        </Container>
    );
};

export default SearchBox;
