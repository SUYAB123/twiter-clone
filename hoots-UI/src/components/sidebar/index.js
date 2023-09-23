import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { SideBarBox, Header, Users, UserFlex, Button, TrendingFlex, StickContainer, Container } from "../styles/sidebar";
import Loading from "../loading";
import { SET_UPDATE } from "../../redux/actions";
import SearchBox from "../search";

const URL = process.env.REACT_APP_SERVER_URL;

const SideBar = () => {
  const [whoFollow, setWhoFollow] = useState(null);
  const [isFollowDisabled, setFollowDisabled] = useState(false);

  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const userId = user.id;
  const refresh = useSelector((state) => state.update.refresh);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${URL}/feed/who-follow?userId=${userId}`);
        setWhoFollow(res.data.whoFollow);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [refresh]);

  const handleFollow = async (e, idx) => {
    e.preventDefault();
    setFollowDisabled(true);
    await axios.post(
      `${URL}/follow`,
      {
        followedId: whoFollow[idx].id,
        followerId: userId,
      },
    );
    const res = await axios.get(`${URL}/feed/who-follow?userId=${userId}`);
    setWhoFollow(res.data.whoFollow);
    setFollowDisabled(false);
    dispatch({ type: SET_UPDATE });
  };

  if (!whoFollow) return <Loading />;

  return (
    <>
      <SearchBox />
      <Container>
      <SideBarBox tweetHov={theme.tweetHov}>
        <Header color={theme.color} border={theme.border}>
          <h2>What's happening</h2>
        </Header>
        
          <TrendingFlex color={theme.color} border={theme.border}>
            <div>
              <p>Trending in India</p>
              <h3>
                #कल_भारत_बंद_है
              </h3>
              <p>34.2K Posts</p>
            </div>
            
          </TrendingFlex>
          <TrendingFlex color={theme.color} border={theme.border}>
            <div>
              <p>Travel · Trending</p>
              <h3>
              रेलवे स्टेशन
              </h3>
              <p>38.1K Posts</p>
            </div>
            
          </TrendingFlex>
          <TrendingFlex color={theme.color} border={theme.border}>
            <div>
              <p>Science · Trending</p>
              <h3>
                Chandrayaan-3
              </h3>
              <p>32.3K Posts</p>
            </div>
            
          </TrendingFlex>
          <TrendingFlex color={theme.color} border={theme.border}>
            <div>
              <p>Travel · Trending</p>
              <h3>
              Indian Railways
              </h3>
              <p>4,284 Posts</p>
            </div>
            
          </TrendingFlex>
          <TrendingFlex color={theme.color} border={theme.border}>
            <div>
              <p>Trending</p>
              <h3>
              पूर्व विदेश मंत्री
              </h3>
              <p>7,776 Posts</p>
            </div>
            
          </TrendingFlex>
        
      </SideBarBox>
      <StickContainer>
      <SideBarBox tweetHov={theme.tweetHov}>
        <Header color={theme.color} border={theme.border}>
          <h2>Who to follow</h2>
        </Header>
        <Users>
          {!whoFollow.length && (
            <p style={{ textAlign: "center", color: theme.color }}>
              No more users left to follow
            </p>
          )}
          {whoFollow.map((user, idx) => (
            <Link to={`/profile/${user.username}`} key={user.id}>
              <UserFlex color={theme.color} border={theme.border}>
                <img src={user.avatar} />
                <div>
                  <h3>
                    {user.firstname} {user.lastname}
                  </h3>
                  <p>@{user.username}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Button
                    onClick={(e) => handleFollow(e, idx)}
                    disabled={isFollowDisabled}
                  >
                    Follow
                  </Button>
                </div>
              </UserFlex>
            </Link>
          ))}
        </Users>
      </SideBarBox>
      </StickContainer>
  </Container>
    </>
  );
};

export default SideBar;
