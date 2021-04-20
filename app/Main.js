import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import About from "./components/About";
import CreatePost from "./components/CreatePost";
import Footer from "./components/Footer";
import Gust from "./components/Gust";
import Header from "./components/Header";
import Home from "./components/Home";
import Terms from "./components/Terms";
import Axios from "axios";
import ViewCreatePost from "./components/ViewCreatePost";
import FlashMessage from "./components/FlashMessage";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import Profile from "./components/Profile";
import EditPage from "./components/EditPage";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import { CSSTransition } from "react-transition-group";
Axios.defaults.baseURL = "http://localhost:8082/";

function App() {
  const initialState = {
    login: Boolean(localStorage.getItem("token")),
    flashMessage: [],
    user: {
      username: localStorage.getItem("username"),
      avatar: localStorage.getItem("avatar"),
      token: localStorage.getItem("token")
    },
    isSearch: false
  };
  const [state, dispatch] = useImmerReducer(reducerFn, initialState);

  function reducerFn(draft, action) {
    switch (action.type) {
      case "login":
        draft.login = true;
        draft.user = action.data;
        break;
      case "logOut":
        draft.login = false;
        draft.user = {
          username: "",
          token: "",
          avatar: ""
        };
        break;
      case "addFlashMessage":
        draft.flashMessage.push(action.value);
        break;
      case "openSreach":
        draft.isSearch = true;
        break;
      case "closeSearch":
        draft.isSearch = false;
        break;
      default:
        return draft;
    }
  }
  useEffect(() => {
    if (state.login) {
      localStorage.setItem("token", state.user.token);
      localStorage.setItem("username", state.user.username);
      localStorage.setItem("avatar", state.user.avatar);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
    }
  }, [state.login]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage />
          <Header login={state.login} />
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route exact path="/post/:id">
              <ViewCreatePost />
            </Route>
            <Route exact path="/post/:id/edit">
              <EditPage />
            </Route>
            <Route exact path="/">
              {state.login ? <Home /> : <Gust />}
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition
            in={state.isSearch}
            timeout={200}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>

          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
ReactDOM.render(<App />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
