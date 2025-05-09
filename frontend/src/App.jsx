// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import { restoreCsrf } from './utils/csrf';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserConnections from './components/UserConnections/UserConnections';
import ChatMessages from './components/ChatMessages/ChatMessages';
// import GamePlay from './components/GamePlay/GamePlay';
import GuessingGame from './components/GuessingGame/GuessingGame';
import ConnectionProfile from './components/ConnectionProfile/ConnectionProfile';
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

function ChatBox() {
  const { user1Id, user2Id } = useParams();
  return <ChatMessages user1Id={user1Id} user2Id={user2Id} />;
}

// function GameWrapper() {
//   const { gameId } = useParams();
//   return gameId ? <GamePlay gameId={gameId} /> : <div>Game not found</div>;
// }
function GameWrapper() {
  const { gameId } = useParams();
  return gameId ? <GuessingGame gameId={gameId} /> : <div>Game not found</div>;
}

function ChatMessagesIntro() {
  return (
    <div>
      <h2>Select a chat from connections to start messaging</h2>
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
      { path: '/chat/:user1Id/:user2Id', element: <ChatBox /> },
      { path: '/game/:gameId', element: <GameWrapper /> }
      // { path: '/game/:gameId', element: <GuessingGame /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;