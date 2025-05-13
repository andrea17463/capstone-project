// src/components/LandingPage/LandingPage.jsx
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';

const LandingPage = () => {
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();

  return (
    <div>
      <h1>Welcome to the App!</h1>
      <br />
      {!user && (
        <>
          <p>Please sign in or create an account to get started.</p>
          <div className="auth-buttons">
            <button className="btn-signup" onClick={() => setModalContent(<SignupFormModal />)}>
              Sign up
            </button>
            <button className="btn-login" onClick={() => setModalContent(<LoginFormModal />)}>
              Log in
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