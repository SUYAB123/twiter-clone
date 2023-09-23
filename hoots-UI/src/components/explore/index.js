import React from "react";
import { useSelector } from "react-redux";
import { ProfileCorner, Header } from "../styles/common";

const Explore = () => {
  const theme = useSelector((state) => state.theme);
  return (
    <ProfileCorner border={theme.border}>
      <Header color={theme.color} border={theme.border}>
        <h2>Explore</h2>
      </Header>
      <h2 style={{ textAlign: "center", color: theme.color }}>Coming soon!</h2>
    </ProfileCorner>
  );
};

export default Explore;
