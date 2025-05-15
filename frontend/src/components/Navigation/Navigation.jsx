// frontend/src/components/Navigation/Navigation.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const connections = useSelector((state) => state.userConnections.connections || []);
  const [showSpecificChats, setShowSpecificChats] = useState(true);
  const location = useLocation();


  console.log('Navigation component connections:', connections);

  useEffect(() => {
    if (location.pathname !== '/chats') {
      setShowSpecificChats(false);
    }
  }, [location]);
  useEffect(() => {
  setShowSpecificChats(location.pathname === '/chats');
}, [location.pathname]);

  return (
    <nav className="navigation">
      <span>
        <NavLink to="/">Home</NavLink>
      </span>

      {isLoaded && (
        <>
          <span>
            <ProfileButton user={sessionUser} />
          </span>
          <span>
            <NavLink to="/profile">Profile</NavLink>
          </span>
        </>
      )}
      <span>
        <NavLink to="/connections">Connections</NavLink>
      </span>
      <span>
        <NavLink to="/chats" onClick={() => setShowSpecificChats(!showSpecificChats)}>
          All Chats
        </NavLink>
        {/* <NavLink to="/chats">
          All Chats
        </NavLink> */}
      </span>

      {/* {showSpecificChats && ( */}
      {showSpecificChats && sessionUser && (
      // sessionUser && (
        <>
          <span>Specific Chats</span>
          <ul>
            {
              (() => {
                const seenUserIds = new Set();
                return connections.map((connection) => {
                  const { user1, user2 } = connection;
                  if (!user1 || !user2) return null;

                  const otherUser = sessionUser.id === user1.id ? user2 : user1;

                  console.log('Navigation.jsx sessionUser:', sessionUser);

                  if (!otherUser?.id || !otherUser?.username) {
                    console.warn('Missing user info in connection:', connection);
                    return null;
                  }

                  if (seenUserIds.has(otherUser.id)) return null;
                  seenUserIds.add(otherUser.id);

                  return (
                    <li key={connection.id}>
                      <NavLink to={`/chat/${sessionUser.id}/${otherUser.id}`}>
                        Chat with {otherUser.username}
                      </NavLink>
                    </li>
                  );
                });
              })()
            }
          </ul>
        </>
      )}
      )}
      <span>
        <NavLink to="/guess-me-game">Guess Me Game</NavLink>
      </span>
      {/* <span>
        <NavLink to="/game-play">Game Play</NavLink>
      </span> */}
    </nav>
  );
}

export default Navigation;