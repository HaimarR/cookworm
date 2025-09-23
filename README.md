# 🍳 Cookworm

![GitHub repo size](https://img.shields.io/github/repo-size/HaimarR/cookworm)
![GitHub contributors](https://img.shields.io/github/contributors/HaimarR/cookworm)
![GitHub last commit](https://img.shields.io/github/last-commit/HaimarR/cookworm)
![GitHub issues](https://img.shields.io/github/issues/HaimarR/cookworm)
![GitHub pull requests](https://img.shields.io/github/issues-pr/HaimarR/cookworm)
[![Project Board](https://img.shields.io/badge/Project-Board-blue)](https://github.com/users/HaimarR/projects/1)
[![Project Status](https://img.shields.io/badge/Status-In%20Progress-yellow)](https://github.com/users/HaimarR/projects/1)
[![Epic Tracking](https://img.shields.io/badge/Epics-10-orange)](https://github.com/users/HaimarR/projects/1)

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-512BD4?logo=dotnet&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?logo=c-sharp&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?logo=postgresql&logoColor=white)

---

**Cookworm** is a social cooking app that I’m building to bring together recipes, food posts, and a bit of gamification. Right now it’s still early, but the idea is simple: a place where people can share meals, write recipes, and connect over food.

At the moment, I’m working on the basics like user accounts, profiles, and authentication. You can already sign up, log in, and update your profile. Next up, I’m focusing on letting people create posts and recipes so the feed actually has content worth exploring.

In the future, Cookworm will be more than just posting recipes. The plan is to let users manage a pantry of ingredients they already have, then match those ingredients to recipes they can actually cook. If they’re missing a few items, the app will highlight what’s missing and even generate a shopping list.

Another part I’m really excited about is the exploration side. Cookworm will have an achievements map where every time you cook a recipe from a new region, you unlock that part of the world. Over time, this will make cooking feel like a journey where you discover cultures and cuisines while earning badges and hitting streaks.

I also want verified chefs and creators to be part of the community, giving feedback and sharing healthy cooking tips. That way users aren’t just sharing food, but also learning from people with real experience. Nutrition filters and healthy tags will also be added so users can find meals that fit their diets.

The end goal is for Cookworm to make home cooking easier, healthier, and a lot more fun. Right now it’s just the foundation, but little by little it’s growing into a platform that helps people cook more, waste less, and share what they love to eat.

---

## 🚀 Tech Stack

### Frontend

- Next.js (React framework with server-side rendering and client components)
- TailwindCSS for styling
- ShadCN UI for modern UI components
- LocalStorage for token and session handling

### Backend

- ASP.NET Core Web API
- C# services and controllers for authentication, user management, and content APIs
- DTOs for structured API responses
- Entity Framework (planned for DB integration)

### Database

- SQL-based schema (Users, Recipes, Posts, Comments, Likes, Follows)
- Designed for scalability with follower counts stored in Users table for faster profile rendering

---

## ✨ Features

### ✅ Implemented

- User authentication: sign up, log in with JWT
- Basic user profile: view and edit profile details (username, bio, email, location)
- Combined login & registration page with animated transitions
- Backend API for user endpoints (`/signup`, `/login`, `/users/{id}`)
- DTOs for structured responses
- Project setup with frontend/backend separation

### 🔜 Upcoming

- Follower/following system with counts
- Content creation (posts and structured recipes)
- Engagement (likes, comments, shares)
- Pantry ingredient management with recipe matching
- Gamified exploration with world cuisine map & achievements
- Moderation & verification of chefs/creators
- Nutrition filters and health-focused tags
- Full database integration with migrations
- Deployment with Docker and CI/CD

---

## 📌 Roadmap by Epics

### Epic 1: User Accounts & Profiles

Enable people to sign up, log in, and manage their identity. Includes profile editing, avatars, following/unfollowing, and viewing other users' activity.

### Epic 2: Content Creation (Posts & Recipes)

Allow users to share food-related content such as quick posts with photos, structured recipes with steps, and optional nutrition or cultural notes.

### Epic 3: Feeds & Discovery

Provide users with personalized and recommended feeds, trending content, and powerful search tools (by tags, ingredients, or location).

### Epic 4: Interactions & Engagement

Encourage participation with likes, comments, saves, shares, and prioritized expert/creator feedback.

### Epic 5: Pantry & Ingredient Matching

Let users track ingredients in a virtual pantry, suggest recipes they can cook, and generate shopping lists for missing items.

### Epic 6: Gamification & Achievements

Introduce badges, streaks, and a world map of unlocked cuisines to motivate healthy cooking and exploration.

### Epic 7: Moderation & Verification

Ensure a safe and structured community with reporting tools, moderator actions, and verified roles for chefs and creators.

### Epic 8: Nutrition & Healthy Eating

Provide value with nutrition information, filtering options by macros, and health-focused recipe tags.

### Epic 9: Achievements Map & Social Layer

Combine gamification with social sharing, allowing users to showcase progress, unlock regions, and compare achievements.

### Epic 10: Platform Infrastructure

Build a scalable, maintainable system with secure authentication, efficient APIs, reliable image storage, and moderation tools.

---

## 👤 Author

**Haimar (Aimar Rubio Delgado)**
4th-year international student from Spain, building Cookworm as a personal full-stack project to explore scalable web development and product design.
