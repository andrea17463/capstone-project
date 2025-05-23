// frontend/src/components/HoverClickDropdown/HoverClickDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import './HoverDropdown.css';

function HoverClickDropdown({ label, name, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
  }, [isOpen, focusedIndex]);

  const handleSelect = (value) => {
    let newSelected;
    if (selected.includes(value)) {
      newSelected = selected.filter((item) => item !== value);
    } else {
      newSelected = [...selected, value];
    }
    setSelected(newSelected);
    onChange(name, newSelected);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
        break;
      case 'Tab':
        setIsOpen(true);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className="dropdown-label"
        tabIndex="0"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
      >
        {label}: {selected.length > 0 ? selected.join(', ') : 'Select'}
      </div>

      {isOpen && (
        <div className="dropdown-content" role="menu">
          {options.map((option, index) => {
            const isSelected = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className={`dropdown-item ${focusedIndex === index ? 'focused' : ''} ${isSelected ? 'selected' : ''}`}
                tabIndex="0"
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % options.length;
                    setFocusedIndex(nextIndex);
                    itemRefs.current[nextIndex].focus();
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = index === 0 ? options.length - 1 : index - 1;
                    setFocusedIndex(prevIndex);
                    itemRefs.current[prevIndex].focus();
                  } else if (e.key === 'Enter') {
                    handleSelect(option.value);
                  } else if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
                role="menuitem"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  style={{ marginRight: '0.5em' }}
                />
                {option.label}
              </div>
            );
          })}
        </div>
      )}

      {selected.map((value) => (
        <input key={value} type="hidden" name={`${name}[]`} value={value} />
      ))}
    </div>
  );
}

export default HoverClickDropdown;