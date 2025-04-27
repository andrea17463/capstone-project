// src/components/LandingPage/LandingPage.jsx
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the App!</h1>
      <p>This is the landing page. Please sign in or create an account to get started.</p>
      <div>
        <Link to="/profile">Go to Profile</Link>
        <br />
        <Link to="/connections">View Connections</Link>
      </div>
    </div>
  );
};

export default LandingPage;