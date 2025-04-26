// frontend/src/components/Navigation/Navigation.jsx
// import * as sessionActions from '../../store/session';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      <li>
        <NavLink to="/profile">Profile</NavLink>
      </li>
      <li>
        <NavLink to="/connections">Connections</NavLink>
      </li>
      <li>
        <NavLink to="/chats">All Chats</NavLink>
      </li>
      <li>
        <NavLink to="/chat/123/456">Specific Chats</NavLink>
      </li>
      <li>
        <NavLink to="/game/789">Guess Me Game</NavLink>
      </li>
    </ul>
  );
}

export default Navigation;