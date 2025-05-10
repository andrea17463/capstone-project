// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { restoreCsrf } from './utils/csrf';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserConnections from './components/UserConnections/UserConnections';
// import ChatMessages from './components/ChatMessages/ChatMessages';
// import GamePlay from './components/GamePlay/GamePlay';
import GuessingGame from './components/GuessingGame/GuessingGame';
import ConnectionProfile from './components/ConnectionProfile/ConnectionProfile';
import ChatBox from './components/ChatBox/ChatBox';
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

// function ChatBox() {
//   const { user1Id, user2Id } = useParams();
//   return <ChatMessages user1Id={user1Id} user2Id={user2Id} />;
// }

function GameWrapper() {
  const { gamePlayId } = useParams();
  return gamePlayId ? <GuessingGame gamePlayId={gamePlayId} /> : <div>Game not found</div>;
}

function ChatMessagesIntro() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const connections = useSelector((state) => state.userconnections.connections || []);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchAllConnections(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  return (
    <div>
      <h2>Select a chat from your connections to start messaging</h2>
      {connections.length === 0 ? (
        <p>No connections yet.</p>
      ) : (
        <ul>
          {Array.isArray(connections) &&
            connections.filter(Boolean).map((connection) => {
              const otherUserId =
                currentUser.id === connection.user_1_id
                  ? connection.user_2_id
                  : connection.user_1_id;

              return (
                <li key={connection.id}>
                  <NavLink to={`/chat/${currentUser.id}/${otherUserId}`}>
                    Chat with user {otherUserId}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

// function GuessMeStart() {
//   return (
//     <div>
//       <h2>Start or Resume a Game</h2>
//       <p>This is where users will choose to resume a saved game or start a new one.</p>
//     </div>
//   );
// }

function ChatBoxWrapper() {
  const { user1Id, user2Id } = useParams();
  return <ChatBox user1Id={user1Id} user2Id={user2Id} />
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
      // { path: '/chat/:user1Id/:user2Id', element: <ChatBox /> },
      { path: '/chat/:user1Id/:user2Id', element: <ChatBoxWrapper /> },
      { path: '/game/:gamePlayId', element: <GameWrapper /> }
      ,
      // { path: '/game/:gamePlayId', element: <GuessingGame /> }
      // { path: '/game', element: <div>No game selected</div> }
      // { path: '/game/resume-or-create', element: <GuessMeStart /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;