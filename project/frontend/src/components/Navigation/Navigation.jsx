// frontend/src/components/Navigation/Navigation.jsx
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoaded }) {
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/connections">Connections</NavLink>
      </li>
      <li>
        <NavLink to="/chats">All Chats</NavLink>
      </li>
      <li>
        <NavLink to="/game/789">Guess Me Game</NavLink>
      </li>
    </ul>
  );
}

export default Navigation;