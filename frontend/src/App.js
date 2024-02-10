import React from 'react';
import './App.scss';
import { Router, Location } from '@reach/router';
import { AnimatePresence } from 'framer-motion';
import ContextProvider from './globalState/state';
import Navbar from './components/Navbar/Navbar';
import Layout from './components/Layout/Layout';
import Main from './components/Main/Main';
import Profile from './components/Main/Profile/Profile';
import Messaging from './components/Main/Messaging/Messaging';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PrivateTeacherRoute from './components/PrivateTeacherRoute/PrivateTeacherRoute';
import AccountSettings from './components/Main/AccountSettings/AccountSettings';
import ParentList from './components/Main/Parents/ParentList/ParentList';
import ViewNavigation from './components/ViewNavigation/ViewNavigation';
import MotionContainer from './components/MotionContainer/MotionContainer';
import ParentProfile from './components/Main/Parents/ParentProfile/ParentProfile';
import ViewTeacher from './components/Home/ViewTeacher/ViewTeacher';
import LoadingWrapper from './components/LoadingWrapper/LoadingWrapper';
import FlashMessage from './components/FlashMessage/FlashMessage';

function App() {
  const routeVariants = {
    initial: {
      opacity: 0,
      x: '-10vw',
      scale: 0.96,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: '10vw',
      scale: 0.96,
    },
  };

  const headerVariants = {
    initial: {
      opacity: 1,
    },
    in: {
      opacity: 1,
    },
    out: {
      opacity: 1,
    },
  };

  const routeTransition = {
    duration: 0.9,
    type: 'tween',
    ease: 'easeInOut',
  };

  return (
    <ContextProvider>
      <div className="App">
        <Location>
          {({ location }) => (
            <Layout>
              <Navbar location={location} />
              <LoadingWrapper>
                <Main>
                  <FlashMessage />
                  <AnimatePresence exitBeforeEnter>
                    <Header
                      location={location}
                      key={location.key}
                      variants={headerVariants}
                      initialAnimation={'initial'}
                      inAnimation={'in'}
                      outAnimation={'out'}
                      transition={routeTransition}
                    />
                  </AnimatePresence>
                  <AnimatePresence exitBeforeEnter initial={false}>
                    <MotionContainer
                      location={location}
                      variants={routeVariants}
                      initialAnimation={'initial'}
                      inAnimation={'in'}
                      outAnimation={'out'}
                      transition={routeTransition}
                      key={location.key}
                    >
                      <ViewNavigation location={location} />
                      <Router location={location}>
                        <Home path="/" />
                        <ViewTeacher path="/teachers/:id" />
                        <PrivateRoute as={Profile} path="/profile" />
                        <PrivateTeacherRoute as={Parents} path="/parents">
                          <ParentList path="/" />
                          <ParentProfile path=":id" />
                        </PrivateTeacherRoute>
                        <PrivateRoute as={Messaging} path="/messaging" />
                        <PrivateRoute as={Appointments} path="/appointments" />
                        <PrivateRoute as={AccountSettings} path="/settings" />
                        <Authentication
                          path="/authentication"
                          location={location}
                        />
                        <FourOhFour path="/404" default />
                      </Router>
                    </MotionContainer>
                  </AnimatePresence>
                </Main>
              </LoadingWrapper>
            </Layout>
          )}
        </Location>
      </div>
    </ContextProvider>
  );
}

export default App;
