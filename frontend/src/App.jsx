// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import { NavLink, Navigate } from 'react-router-dom';
import { restoreCsrf } from './utils/csrf';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserConnections from './components/UserConnections/UserConnections';
import GuessingGame from './components/GuessingGame/GuessingGame';
import ConnectionProfile from './components/ConnectionProfile/ConnectionProfile';
import Chat from './components/Chat/Chat';
// import GamePlay from './components/GamePlay/GamePlay';
import { fetchAllConnections } from './store/user-connections';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    restoreCsrf();
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
  const isLoaded = useSelector((state) => state.session.isLoaded);
  const connections = useSelector((state) => state.userConnections.connections || []);
  console.log("Connections in ChatMessagesIntro:", connections);

  useEffect(() => {
    if (sessionUser?.id) {
      console.log("Fetching connections in App component for:", sessionUser.id);
      dispatch(fetchAllConnections(sessionUser.id));
    }
  }, [dispatch, sessionUser?.id]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!sessionUser) return <Navigate to="/" />;

  return (
    <div>
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
                    <NavLink to={`/chat/${sessionUser.id}/${otherUser.id}`}>
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
      { path: '/profile', element: <UserProfile /> },
      { path: '/profile/:userId', element: <ConnectionProfile /> },
      { path: '/connections', element: <UserConnections /> },
      { path: '/chats', element: <ChatMessagesIntro /> },
      { path: '/chat/:user1Id/:user2Id', element: <Chat /> },
      { path: '/game/:gamePlayId', element: <GameWrapper /> },
      // { path: '/game-play', element: <GamePlay /> },
      { path: '/guess-me-game', element: <GuessingGame /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;