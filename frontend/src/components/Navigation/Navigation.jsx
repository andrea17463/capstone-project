// frontend/src/components/Navigation/Navigation.jsx
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const connections = useSelector((state) => state.userconnections.connections || []);
  console.log('Navigation component connections:', connections);

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
      <span>Specific Chats</span>
      <ul>
        {connections
          .filter((connection) => connection.connectionStatus === 'accepted')
          .map((connection) => {
            if (!connection.user1 || !connection.user2 || !sessionUser) return null;

            const otherUser = sessionUser.id === connection.user1.id ? connection.user2 : connection.user1;

            console.log('Inspecting Navigation component connection:', connection);
            console.log('sessionUser:', sessionUser);
            console.log('otherUser', otherUser);
            return (
              <li key={connection.id}>
                <NavLink to={`/chat/${sessionUser.id}/${otherUser.id}`}>
                  Chat with {otherUser.username || `User ${otherUser.id}`}
                </NavLink>
              </li>
            );
          })}
      </ul>
      <span>
        <NavLink to="/game/guess-me-game">Guess Me Game</NavLink>
      </span>
      <span>
      </span>
    </nav>
  );
}

export default Navigation;