// frontend/src/components/Navigation/Navigation.jsx
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const gamePlayId = useSelector(state => state.gameplays.gamePlayId);
  const currentUser = useSelector((state) => state.session.user);
  const connectionRef = useRef(null);
  const connections = useSelector((state) => state.userconnections.connections || []);

  useEffect(() => {
    connectionRef.current = new WebSocket('ws://localhost:3001');

    connectionRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    return () => connectionRef.current?.close();
  }, []);

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
        <NavLink to="/chats">All Chats</NavLink>
      </span>
      <span>
        {connections.map((connection) => {
          if (!connection.user1 || !connection.user2) return null;
          const otherUser = currentUser.id === connection.user1.id ? connection.user2 : connection.user1;

          console.log(`Chat Link: /chat/${currentUser.id}/${otherUser.id}`);
          <NavLink to="/chat/:user1Id/:user2Id">Specific Chats</NavLink>

          return (
            <span key={connection.id}>
              <NavLink to={`/chat/${currentUser.id}/${otherUser.id}`}>
                Chat with {otherUser.username || `User ${otherUser.id}`}
              </NavLink>
            </span>
          );
        })}
      </span>
      <span>
        <NavLink to={`/game/${gamePlayId}`}>Guess Me Game</NavLink>
      </span>
      <span>
        {/* <NavLink to="/game/resume-or-create">Guess Me Game</NavLink> */}
      </span>
    </nav>
  );
}

export default Navigation;