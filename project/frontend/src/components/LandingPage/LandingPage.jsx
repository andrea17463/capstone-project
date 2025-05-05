// src/components/LandingPage/LandingPage.jsx
import './LandingPage.css';
import { Link } from 'react-router-dom';
import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';

const LandingPage = () => {
  useExtractCookiesCsrfToken();
  return (
    <div>
      <h1>Welcome to the App!</h1>
      <br />
      <p>This is the landing page. Please sign in or create an account to get started.</p>
      <div className="auth-buttons">
        <button className="btn-signup">Sign up</button>
        <button className="btn-login">Log in</button>
      </div>
      <div>
        <Link to="/profile">Go to Profile</Link>
        <br />
        <Link to="/connections">View Connections</Link>
      </div>
    </div>
  );
};

export default LandingPage;