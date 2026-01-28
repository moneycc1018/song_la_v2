# Song La v2

A music discovery and quiz application built with Next.js, allowing users to play a guessing game.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better-Auth](https://better-auth.com/) (Google Provider)
- **Styling:** Tailwind CSS & Shadcn UI
- **Testing:** Playwright

## 🎮 Features Guide

### 🔐 Login

You can access the application in two ways:

1. **Google Sign-In:** Click the Google button to authenticate with your account and access personalized features.
2. **Guest Mode:** Click the "Login as Guest" button to directly enter the Playground and explore with existing library data.

### 🎧 Playground

The Playground is the central hub for testing your music knowledge.

#### **Setting Up a Session**

Before starting, you can filter the pool of songs:

- **Select Artists:** Filter by specific artists in the library.

- **Select Tags:** Filter tracks by existing categories.

- **Select/Remove All:** Quickly toggle all available filters.

> Note: You must select at least one artist or tag to start.

#### **Playing the Game**

1. Click the **"Start"** button to begin the session.
2. The game will fetch tracks matching your criteria.
3. **Guess the Song:** Listen or recall the track.
4. **Reveal Answer:** Click **"Answer"** to show the Track Name, Album, and other details.
5. **Next Track:** Click **"Next"** to proceed to the next song in the queue.
