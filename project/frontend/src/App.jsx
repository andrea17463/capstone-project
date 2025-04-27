// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserConnections from './components/UserConnections/UserConnections';
import ChatMessages from './components/ChatMessages/ChatMessages';
// import GamePlay from './components/GamePlay/GamePlay';
import GuessingGame from './components/GuessingGame/GuessingGame';
import * as sessionActions from './store/session';
import { useParams } from 'react-router-dom';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

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
      { path: '/connections', element: <UserConnections /> },
      { path: '/chats', element: <ChatMessagesIntro /> },
      // { path: '/chat/:user1Id/:user2Id', element: <ChatBox /> },
      { path: '/chat/123/456', element: <ChatBox /> },
      // { path: '/game/:gameId', element: <GameWrapper /> }
      { path: '/game/789', element: <GuessingGame /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;