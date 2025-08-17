AI Chatbot - Frontend
A modern, responsive AI chatbot interface built with vanilla JavaScript. Features a clean dark theme UI with real-time messaging capabilities.
🚀 Live Demo
Frontend: (https://ai-chatbot-workiva.vercel.app/) Backend API: Deployed on Vercel with secure environment variables
✨ Features

💬 Real-time Chat Interface - Instant messaging with AI responses
🎨 Modern Dark Theme - Professional UI design with smooth animations
📱 Fully Responsive - Works seamlessly on desktop, tablet, and mobile
🗂️ Chat Session Management - Multiple conversation support with history
⚡ Fast Performance - Vanilla JavaScript, no heavy frameworks
🔐 Secure API Integration - Environment variables for API key protection
🎯 User-Friendly - Intuitive interface with loading states and error handling

🛠️ Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript
Backend: Node.js/Express (separate repository)
Deployment: Vercel
AI Integration: OpenAI API
Storage: In-memory session management

🎯 Quick Start
Option 1: View Live Demo
Simply visit the live demo link above - no setup required!
Option 2: Run Locally

Clone the repository
bashgit clone https://github.com/Martimic10/ai-chatbot.git
cd ai-chatbot

Serve the files
bash# Option A: Python
python -m http.server 8000

# Option B: Node.js
npx serve .

# Option C: PHP
php -S localhost:8000

Open in browser
http://localhost:8000


Note: The backend is deployed separately on Vercel, so the live API integration works immediately.
📁 Project Structure
ai-chatbot/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling system
├── app.js             # Core JavaScript functionality
└── README.md          # Project documentation
🔧 Key Features Implemented
Frontend Architecture

Modular JavaScript: Clean separation of concerns with state management
Event-driven UI: Responsive to user interactions with real-time updates
Error Handling: Comprehensive error states and user feedback
Loading States: Visual indicators for better UX

UI/UX Design

ChatGPT-inspired Interface: Modern, familiar design patterns
Responsive Layout: CSS Grid and Flexbox for all screen sizes
Smooth Animations: CSS transitions and loading animations
Accessibility: Proper contrast ratios and semantic HTML

Performance Optimizations

Vanilla JavaScript: No framework overhead, fast load times
Efficient DOM Manipulation: Minimal reflows and repaints
Optimized CSS: Modern properties with fallbacks

🌐 API Integration
The frontend connects to a secure backend API deployed on Vercel:

Endpoint: POST /api/chat
Authentication: Secure API key management via environment variables
Request Format: JSON with message history for context
Response Handling: Real-time streaming with error recovery

🎨 Design Decisions

Dark Theme: Modern, professional appearance reducing eye strain
Message Bubbles: Clear visual distinction between user and AI responses
Sidebar Navigation: Easy access to chat history and new conversations
Mobile-First: Responsive design ensuring great experience on all devices

🚀 Deployment
This project is deployed using modern best practices:

Frontend: Static hosting on Vercel with automatic deployments
Backend: Serverless functions with secure environment variables
CI/CD: Automatic deployment on git push
Security: No sensitive data in client-side code

🔍 Browser Compatibility

✅ Chrome 60+
✅ Firefox 55+
✅ Safari 12+
✅ Edge 79+

💡 Technical Highlights

State Management: Clean, predictable state handling without external libraries
Error Boundaries: Graceful handling of network and API errors
Memory Efficiency: Optimized for long chat sessions
Code Quality: Modern ES6+ JavaScript with consistent styling
