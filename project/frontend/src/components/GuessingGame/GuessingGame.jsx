import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { categories, traits } from './categories';
import HoverClickDropdown from '../UserProfile/HoverClickDropdown';

function GuessingGame() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [answers, setAnswers] = useState({});
  const [gameStarted, setGameStarted] = useState(false);

  // Handle category selection
  const handleCategoryChange = (name, value) => {
    setSelectedCategory(value);
    setAnswers({}); // Reset answers when category changes
  };

  const handleTraitSelect = (trait, value) => {
    setAnswers((prev) => ({
      ...prev,
      [trait]: value,
    }));
  };

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted ? (
        <>
          <h3>Ready to play the Guess Me Game?</h3>
          <NavLink to="/game/789">
            <button
              onClick={startGame}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Start Guess Me Game
            </button>
          </NavLink>
        </>
      ) : (
        <>
          <h2>Select a Game Category</h2>
          <HoverClickDropdown
            label="Category"
            name="category"
            options={categories.map((cat) => ({ value: cat, label: cat }))}
            onChange={handleCategoryChange}
          />



          {selectedCategory && (
            <>
              <button>Roast Me Gently Mode</button>
              <br />
              <button>Talk-It-Out Prompt</button>

              <h3>Choose a trait guess from: {selectedCategory}</h3>
              {traits[selectedCategory]?.map((trait) => {
                const [optionA, optionB] = trait.split(' vs. ');
                return (
                  <div key={trait} style={{ marginBottom: '12px' }}>
                    <strong>{trait}</strong><br />
                    <label>
                      <input
                        type="radio"
                        name={trait}
                        value={optionA}
                        checked={answers[trait] === optionA}
                        onChange={() => handleTraitSelect(trait, optionA)}
                      />
                      {optionA}
                    </label>
                    {' '}
                    <label>
                      <input
                        type="radio"
                        name={trait}
                        value={optionB}
                        checked={answers[trait] === optionB}
                        onChange={() => handleTraitSelect(trait, optionB)}
                      />
                      {optionB}
                    </label>
                  </div>
                );
              })}
            </>
          )}

          {Object.keys(answers).length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Your Selections:</h3>
              <ul>
                {Object.entries(answers).map(([trait, value]) => (
                  <li key={trait}>
                    <strong>{trait}</strong>: {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GuessingGame;