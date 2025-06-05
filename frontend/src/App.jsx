// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import { NavLink, Navigate } from 'react-router-dom';
import { restoreCSRF } from './store/csrf';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserConnections from './components/UserConnections/UserConnections';
import GuessingGame from './components/GuessingGame/GuessingGame';
import ConnectionProfile from './components/ConnectionProfile/ConnectionProfile';
import Chat from './components/Chat/Chat';
import GamePlay from './components/GamePlay/GamePlay';
import { fetchAllConnections } from './store/user-connections';
import * as sessionActions from './store/session';
import ProtectedRoute from "./utils/ProtectedRoute";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    restoreCSRF();
  }, []);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

function GameWrapper() {
  const { gamePlayId } = useParams();
  return gamePlayId ? <GuessingGame gamePlayId={gamePlayId} /> : <div>Game not found</div>;
}

function ChatMessagesIntro() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  // const isLoaded = useSelector((state) => state.session.isLoaded);
  const connections = useSelector((state) => state.userConnections.connections || []);

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(fetchAllConnections(sessionUser.id));
    }
  }, [dispatch, sessionUser?.id]);

  // if (!isLoaded) return <h3 style={{ color: 'white', padding: '0 20px', boxSizing: 'border-box' }}>Select a chat from your connections to start messaging.</h3>;
  if (!sessionUser) return <Navigate to="/" />;

  const containerStyle = {
    border: '2px solid #ccc',
    borderRadius: '12px',
    padding: '2rem',
    margin: '0 auto',
    maxWidth: '800px',
    boxShadow: '0 0 10px white'
  };

  return (
    <div style={containerStyle}>
      <h2>Select a chat from your connections to start messaging</h2>
      {connections.length === 0 ? (
        <p>No connections yet.</p>
      ) : (
        <ul>
          {Array.isArray(connections) &&
            connections
              // .filter((connection) => connection.connectionStatus === 'accepted')
              .map((connection) => {
                const { user1, user2 } = connection;
                if (!user1 || !user2) return null;

                const otherUser = sessionUser.id === user1.id ? user2 : user1;

                if (!otherUser?.id || !otherUser?.username) {
                  console.warn('Missing user info in connection:', connection);
                  return null;
                }

                return (
                  <li key={connection.id}>
                    <NavLink to={`/chat-messages/${sessionUser.id}/${otherUser.id}`}>
                      Chat with {otherUser.username}
                    </NavLink>
                  </li>
                );
              })}
        </ul>
      )}
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        path: '/profile', element: (
          <ProtectedRoute> <UserProfile /> </ProtectedRoute>
        ),
      },
      {
        path: '/connection-profile/:userId', element: (
          <ProtectedRoute> <ConnectionProfile /> </ProtectedRoute>
        ),
      },
      {
        path: '/connections', element: (
          <ProtectedRoute> <UserConnections /> </ProtectedRoute>
        ),
      },
      { path: '/chat-messages', element: <ChatMessagesIntro /> },
      {
        path: '/chat-messages/:user1Id/:user2Id', element: (
          <ProtectedRoute> <Chat /> </ProtectedRoute>
        ),
      },
      { path: '/game/:gamePlayId', element: <GameWrapper /> },
      { path: '/game-play', element: <GamePlay /> },
      {
        path: '/guess-me-game', element: (
          <ProtectedRoute> <GuessingGame /> </ProtectedRoute>
        ),
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;