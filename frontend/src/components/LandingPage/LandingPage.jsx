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
    <div className="landing-page-wrapper">
      <div>
        <Link to="/profile">Go to Profile</Link>
        <br />
        <Link to="/connections">View Connections</Link>
        <h3>Welcome to Two Way — Where Real Connections Begin with a Game</h3>
        <h4>This isn&apos;t dating.</h4>
        <h4>This isn&apos;t networking.</h4>
        <h4>This is something better — casual, meaningful meetups with people.</h4>
        <h4>We match you with someone based on what you&apos;re actually looking for:</h4>
        <h4>Someone to vent to</h4>
        <h4>A lunch buddy</h4>
        <h4>A partner for exploring new spots</h4>
        <h4>A meme/text pal for random thoughts</h4>
        <h4>Someone to join you for hobbies or classes</h4>
        <h4>A walking/fresh air friend</h4>
        <h4>A gaming or binge-watching buddy</h4>
        <h4>An accountability partner (gym, goals, life, etc.)</h4>
        <h4>Someone to celebrate small wins with</h4>
        <h4>Or just someone to be there when life feels a little too quiet</h4>
        <h4>Break the Ice with the &quot;Guess Me&quot; Game</h4>
        <h4>No awkward intros. No pressure.</h4>
        <h4>Instead, jump into a lighthearted guessing game that brings out your personality.</h4>
        <h4>Pick a card deck and take turns guessing each other&apos;s traits across fun themes such as:</h4>
        <h4>Personality and Traits</h4>
        <h4>Food and Drink Favorites</h4>
        <h4>Music, Movies, and TV Shows</h4>
        <h4>Travel and Adventure</h4>
        <h4>Conversation Style and Humor</h4>
        <h4>Mindset and Lifestyle</h4>
        <h4>Feeling spicy? Turn on &quot;Roast Me Gently&quot; mode and let the friendly banter fly.</h4>
        <h4>Chat Before You Meet</h4>
        <h4>Once matched, message each other to figure out if you want to meet.</h4>
        <h4>Click &quot;Want to meet&quot; when you&apos;re ready — or &quot;End Meeting&quot; if it doesn&apos;t work out. No hard feelings.</h4>
        <h4>After the Hangout: You Decide</h4>
        <h4>The meetup ends with two simple options:</h4>
        <h4>Meet Again — because the first impression was great.</h4>
        <h4>End Meeting — no pressure, no awkward goodbyes.</h4>
        <h4>Why It Works</h4>
        <h4>Low-pressure by design — No expectations, just human connection.</h4>
        <h4>Bonding through a game — Fun questions and guesswork reveal more than small talk ever could.</h4>
        <h4>Real-life, real-time — It&apos;s not just online; it&apos;s about showing up in the real world.</h4>
        <h4>Mutual intent — Every match is based on shared goals and interests.</h4>
        <h4>Ready to Meet Someone New — Just for the Fun of It?</h4>
        <h4>Join a growing community of people redefining how we connect.</h4>
        <h4>Because friendship should be fun, spontaneous, and easy — just like our meetups.</h4>
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
      </div>
    </div>
  );
};

export default LandingPage;