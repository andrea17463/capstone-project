// frontend/src/components/Navigation/Navigation.jsx
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // useExtractCookiesCsrfToken();

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
        <NavLink to="/chat/:user1Id/:user2Id">Specific Chats</NavLink>
      </span>
      <span>
        <NavLink to="/game/:gameId">Guess Me Game</NavLink>
      </span>
    </nav>
  );
}

export default Navigation;