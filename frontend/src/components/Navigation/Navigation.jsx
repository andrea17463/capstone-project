// frontend/src/components/Navigation/Navigation.jsx
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const connections = useSelector((state) => state.userConnections.connections || []);
  const location = useLocation();
  const navigate = useNavigate();

  const [showSpecificChats, setShowSpecificChats] = useState(location.pathname === '/chats');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('Navigation.jsx connections:', connections);

  const handleAllChatsClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/chats') {
      navigate('/chats');
      setShowSpecificChats(true);
    } else {
      setShowSpecificChats(prev => !prev);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        {sidebarOpen ? '☰' : '☰'}
      </button>

      <nav className={`navigation ${sidebarOpen ? 'open' : 'closed'}`}>
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
          <a href="/chats" onClick={handleAllChatsClick}>
            All Chats
          </a>
        </span>

        {showSpecificChats && sessionUser && (
          <>
            <span>Specific Chats</span>
            <ul>
              {(() => {
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
              })()}
            </ul>
          </>
        )}

        <span>
          <NavLink to="/guess-me-game">Guess Me Game</NavLink>
        </span>
        {/* <span>
          <NavLink to="/game-play">Game Play</NavLink>
        </span> */}
      </nav>
    </>
  );
}

export default Navigation;