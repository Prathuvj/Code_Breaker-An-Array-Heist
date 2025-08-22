# Code Breaker Game

**Developer:** Prathu Vijayvargiya  
**RA Number:** RA2211003011827

## Overview

Code Breaker is an interactive web-based puzzle game that challenges players to manipulate arrays and find hidden patterns within a time limit. The game features multiple levels with increasing difficulty, sound effects, and visual animations to create an engaging learning experience for array operations.

## Features

### Core Gameplay
- **Array Manipulation**: Insert and delete elements at specific indices
- **Pattern Search**: Find sequences of numbers within the array
- **Multi-Level Progression**: 3 levels with increasing complexity
- **Time-Based Challenges**: 60-second timer for each level

### Interactive Elements
- **Visual Feedback**: Animated cells with color-coded states
- **Sound Effects**: Audio cues for actions and events
- **Real-time Updates**: Dynamic array visualization
- **Level Progression**: Automatic advancement upon completion

### Game Mechanics
- **Level 1**: Find a 2-digit secret pattern
- **Level 2**: Find a 3-digit secret pattern  
- **Level 3**: Find a 3-digit reversed secret pattern
- **Array Size**: Fixed 10-element array with null initialization

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with animations and transitions
- **Vanilla JavaScript**: Game logic and DOM manipulation
- **Web Audio API**: Dynamic sound generation

### Key Components

#### Array Operations
```javascript
// Insert operation with bounds checking
// Delete operation with element shifting
// Pattern search with visual highlighting
```

#### Level System
- Randomly generated secret patterns
- Progressive difficulty scaling
- Completion tracking and advancement

#### Timer System
- 60-second countdown per level
- Real-time display updates
- Automatic reset on timeout

#### Audio System
- Procedural sound generation
- Context-aware audio feedback
- Cross-browser compatibility

## File Structure

```
├── index.html          # Main HTML structure
├── script.js           # Game logic and functionality
├── style.css           # Styling and animations
├── .gitignore         # Git ignore configuration
└── README.md          # Project documentation
```

## How to Play

1. **Insert Elements**: Enter an index (0-9) and value (0-9), then click "Insert"
2. **Delete Elements**: Enter an index and click "Delete" to remove an element
3. **Search Patterns**: Enter a comma-separated pattern (e.g., "1,2,3") and click "Search"
4. **Level Progression**: Find the secret pattern to advance to the next level
5. **Reset Game**: Click "Reset" to start over from Level 1

## Game Controls

| Control | Function |
|---------|----------|
| Index Input | Specify array position (0-9) |
| Value Input | Specify digit value (0-9) |
| Pattern Input | Enter search pattern (comma-separated) |
| Insert Button | Add element at specified index |
| Delete Button | Remove element at specified index |
| Search Button | Find pattern in array |
| Reset Button | Restart game from Level 1 |

## Visual Feedback

- **Green Cells**: Successfully matched pattern elements
- **Blue Cells**: Currently being searched
- **Red Cells**: Failed search attempts
- **Light Green**: Recently inserted elements
- **Animated**: Deleted elements (shrink and fade)

## Audio Feedback

- **Beep Sounds**: Successful operations
- **Buzz Sound**: Errors and failures
- **Fanfare**: Level completion and game victory

## Browser Compatibility

- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with touch support