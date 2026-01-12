# 🎮 Expanded Prompt for AI Game Builder

## Project Title

**Modern Classic Ludo – Custom Modes & Enhanced Experience**

---

## Objective

Build a premium design **classic Ludo game** with modern UI/UX and multiple gameplay **modes** (not rule changes), using **React + TypeScript + Tailwind CSS** with animation libraries for smooth interactions.
The core rules of Ludo remain intact — only **starting conditions, win conditions, and presentation** are modified.

---

## Core Requirements

### 1. Game Structure

* Must always support **exactly 4 players** (no more, no less).
* Players can be:

  * Human vs Human
  * Human vs AI (optional enhancement)

---

## 2. Game Modes (User Selectable)

Before starting a match, the user must choose a **game mode**:

### Mode A — *One Token Out*

* Each player starts with **1 token already outside** the base.
* Other tokens follow normal Ludo entry rules.
* Purpose: faster-paced games and quicker early interactions.

---

### Mode B — *First Token Home Wins*

* The **first player to get any one token home** wins.
* Remaining rankings are decided by:

  * Second token home → 2nd place
  * Third → 3rd place
  * Fourth → 4th place
* Perfect for short, competitive sessions.

---

## 3. Assets Integration

### Dice

* Use **6 PNG dice images** for faces (1–6).
* Dice roll should:

  * Animate between images
  * End on the final value

### Sounds

Use sound assets from the provided **sound folder**:

* Dice roll
* Token move
* Token kill
* Celebration / victory
* UI click
  Each sound must be:
* Optional (mute toggle)
* Synced to animations

---

## 4. UI / UX Goals

### Visual Style

* Modern but inspired by **classic Ludo board**
* Clean layout using **Tailwind CSS**
* Responsive for:

  * Desktop
  * Tablet
  * Mobile

### Animations

Use animation libraries such as:

* Framer Motion
* GSAP
* Or similar

Animate:

* Dice roll
* Token movement
* Token kills
* Victory screen
* Mode selection transitions

---

## 5. Game Flow

1. User opens app
2. Chooses:

   * Game mode
   * Sound on/off
3. Game loads board
4. Gameplay begins
5. End screen shows:

   * Winner
   * Rankings
   * Option to replay or change mode

---

## 6. Technical Stack

* **Frontend**:

  * React
  * TypeScript
  * Tailwind CSS

* **Animation**:

  * Framer Motion / GSAP

* **Audio**:

  * HTML5 Audio API or Web Audio API

* **State Management**:

  * React Context or Zustand / Redux (optional)

---

# ✨ Extra Feature Suggestions (Highly Recommended)

These are optional but would **massively improve** the experience:

---

## 1. Game Themes

Let users choose:

* Classic board
* Neon / cyber
* Kids mode
* Dark mode

Themes only affect **visuals**, not rules.

---

## 2. Smart Highlights

* Glow on:

  * Current player
  * Movable tokens
  * Killable enemy tokens

Improves clarity and reduces confusion.

---

## 3. Match Statistics

After each game show:

* Total rolls
* Total kills
* Fastest token home
* MVP token

---

## 4. Accessibility Options

* Large text mode
* High contrast mode
* Sound captions (“Dice rolled: 6”)

---

## 6. Replay & Highlights

* Store last match
* Let players:

  * Replay the game
  * Watch only kills
  * Watch final winning move

---

# 🧠 Design Philosophy for the Builder

> This project is not about changing Ludo rules.
> It is about **changing how players experience Ludo** — faster starts, new win conditions, better visuals, better sound, and smoother interactions.

The game should feel:

* Familiar
* But fresh
* Competitive
* And modern
