// src/components/LandingPage/LandingPage.jsx
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import { login } from '../../store/session';

const LandingPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();

  const handleDemoLogin = () => {
    dispatch(login({ credential: 'demo@user.io', password: 'password' }));
  };

  return (
    <div>
      <h1>Welcome to the App!</h1>
      <br />
      {!user && (
        <>
          <p>Please log in or sign up to create a profile.</p>
          <div className="auth-buttons">
            <button className="btn-signup" onClick={() => setModalContent(<SignupFormModal />)}>
              Sign up
            </button>
            <button className="btn-login" onClick={() => setModalContent(<LoginFormModal />)}>
              Log in
            </button>
            <button className="btn-demo" onClick={handleDemoLogin}>
              Demo Login
            </button>
          </div>
        </>
      )}
      <div>
        <Link to="/profile">Go to Profile</Link>
        <br />
        <Link to="/connections">View Connections</Link>
      </div>
    </div>
  );
};

export default LandingPage;