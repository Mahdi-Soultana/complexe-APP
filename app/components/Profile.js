import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [profile, setProfile] = useState({
    profileUsername: "",
    profileAvatar:
      "https://gravatar.com/avatar/37954b283d8386d9cc857f7523cd6208?s=128",
    isFollowing: false,
    counts: {
      postCount: 0,
      followerCount: 0,
      followingCount: 0
    }
  });
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function getProfile() {
      try {
        const { data } = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token
          },
          { cancelToken: ourRequest.token }
        );
        setProfile(data);
      } catch (e) {
        console.log(e);
      }
    })();
    return () => {
      ourRequest.cancel("You Have Navigate Before Loading !");
    };
  }, []);

  return (
    <Page title="Your Profile">
      <h2>
        <img className="avatar-small" src={profile.profileAvatar} />{" "}
        {profile.profileUsername || "..."}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profile.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profile.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profile.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
}

export default Profile;
