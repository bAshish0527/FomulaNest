# FormulaNest Project Overview

## Purpose
FormulaNest is a web-based learning portal for classes 6-10. It provides formulas by subject, practice quizzes, and a parent view. It can run locally as a PWA.

## Key Pages
- index.html: Home page and entry point.
- dashboard.html: Class selection and shortcuts.
- notes.html: Notes and formulas per class/subject; quiz and calculator live here.
- practice.html: All class quizzes list; opens quiz directly.
- parent.html: Parent view with recent activity and quiz results.
- login.html: Profile page layout.
- ai.html: AI chat interface (OpenRouter).

## Client Logic
- script.js holds all class formulas, quiz pools, calculator, and UI behaviors.
- Notes are rendered by class and subject in the notes renderer.
- Practice links use notes.html?class=X&quiz=1 to auto-start quizzes.

## Server
- server.py serves static files and provides APIs.
- /api/approval/request for login approval flow.
- /api/approval/{id}/status|yes|no for approval updates.
- /api/chat for AI chat via OpenRouter.

## AI Chat
- Requires OPENROUTER_API_KEY environment variable.
- Default model: meta-llama/llama-3.1-8b-instruct.

## PWA
- sw.js provides offline caching for core assets.
- If pages look outdated, refresh or update cache-buster versions.

## Common Issues
- LAN IP changes after Wi-Fi changes; use the new IP.
- Server must be running for local access.
- Embedded browsers can block WhatsApp Web.
