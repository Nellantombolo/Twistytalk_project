TwistyTalk – AI Pronunciation Trainer,
Team Members: Ornella Ntombolo & Rachel Kabwiza,
Project Name: TwistyTalk

1. Project Description
TwistyTalk is a web application that generates AI-created tongue twisters to help users practice articulation, pronunciation, and fluency. Users can generate a twister, record their voice, listen back, and receive AI-based feedback. The system uses the Gemini API for text generation and scoring and is built with React. Deployment is handled through Firebase Hosting.

2. How to Run the Project Locally
Requirements:
Install Node.js from: https://nodejs.org

Steps:
- Clone or download this repository.
- Open a terminal inside the project folder.
- Run the following commands:
npm install
npm run dev

- A local development URL (such as http://localhost:5173/) will appear.
- Open the link in your browser to run the app.

3. Environment Variables
To use the Gemini API and Firebase, create a file named .env in the root of the project.

Steps:

- Create .env.

- Copy the variables from .env.example.

- Insert your own keys.

Example:

VITE_GEMINI_API_KEY=your_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

4. Live Deployment
The hosted version of the application is available at:
https://twistytalk.web.app/

5. Usage Instructions
- Select a difficulty level.

- Generate a tongue twister.

- Record your audio.

- View your AI-generated score and feedback.

- Repeat with different difficulty or speed levels if desired.

6. Dependencies
- React
- Vite
- Gemini API
- Firebase
- MediaRecorder Web API
- Jest
All dependencies are listed in package.json.

7. Repository Structure
twistytalk/
│
├── src/               (React source code: components, services, hooks)
├── tests/             (Unit tests)
├── public/            (Public-facing assets)
│
├── README.md          (Project overview and setup)
├── DESIGN.md          (Architecture and design explanations)
├── package.json       (Dependencies and scripts)
├── .gitignore         (Ignored files)
└── .env.example       (Environment variable template)

8. Notes for Graders
API features require a Gemini key added to the .env file.

A live hosted version is available for quick testing.

The repository is organized according to project guidelines.

9. License
This project is for academic use in CS 2450 – Software Engineering.

