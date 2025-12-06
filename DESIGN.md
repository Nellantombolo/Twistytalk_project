Team members: Ornella Ntombolo & Rachel Kabwiza
Project name: TwistyTalk

1. System Architecture

TwistyTalk is a web-based application designed to provide real-time pronunciation training through interactive tongue twisters. The system is implemented using a client-side architecture with React as the primary frontend framework. The application is deployed using Firebase Hosting, allowing users to access the system through a standard web browser without requiring local installation.
The core logic of the system is divided into modular service layers that handle AI communication, audio recording, scoring, and personalized feedback. The application integrates with the Gemini API to perform three main AI-driven tasks: generating tongue twisters, evaluating pronunciation from recorded audio, and producing personalized improvement tips.
Audio input is captured using the browser’s MediaRecorder API. The recorded audio is converted into a base64 format before being transmitted to the Gemini API for evaluation. The AI response is then processed and rendered dynamically in the user interface. This separation between the user interface, service logic, and AI processing ensures modularity, maintainability, and scalability.

2. Major Components
   
The system is organized into the following core components and modules:
- TwisterService
This module communicates with the Gemini API to generate tongue twisters based on selected difficulty levels. It handles all processing related to AI text generation and error handling for failed requests.

- RatingService
This module sends both the recorded audio and reference text to the Gemini API to receive a pronunciation score and feedback. It is responsible for validating audio input and managing errors related to silent or corrupted recordings.

- ProTipService
This component generates personalized pronunciation improvement tips based on detected mispronunciations returned by the AI evaluation.

- Recorder Module
The Recorder module manages microphone access using the MediaRecorder API. It handles recording control, audio buffering, base64 conversion, and permission validation.

- UI Components
The user interface consists of multiple React components that manage difficulty selection, text display, recording controls, text-to-speech playback, and result presentation. All components update dynamically in response to AI feedback.


3. Design Decisions

React was selected as the frontend framework due to its component-based architecture, which enables clean separation of concerns and efficient state management. This made it easier to maintain responsiveness and real-time UI updates.
The Gemini API was chosen for its ability to perform both text generation and speech evaluation within a single AI platform. This simplified external dependencies and enabled consistent feedback generation.
A modular service-based design was used instead of a monolithic structure. This decision improved code readability, testing efficiency, and long-term scalability.
Firebase Hosting was selected for deployment due to its simple integration with React, fast global content delivery, and minimal configuration requirements.

4. Challenges

One of the primary challenges faced during development was managing browser microphone permissions and handling cases where users deny access. Another major challenge involved validating audio quality and ensuring corrupted or silent recordings were correctly rejected by the system.
Handling asynchronous API communication with consistent real-time UI updates also presented difficulties, particularly in managing loading states and preventing user actions during recording or playback.
Ensuring system stability during network interruptions and API failures required implementing robust error handling across all service layers.

5. What Was Learned

This project strengthened understanding of API integration, client-side audio processing, and modular software design. Significant experience was gained in managing asynchronous workflows, handling real-time feedback loops, and developing AI-powered web applications.
The team also developed practical experience with React state management, browser media APIs, cloud deployment, and automated testing using Jest.

6. Future Improvements

Future enhancements to TwistyTalk could include user account creation, progress tracking, and historical pronunciation statistics. Additional improvements could include support for multiple accents, expanded phonetic analysis, and multilingual pronunciation training.
Further optimization of the pronunciation scoring algorithm and improved AI feedback accuracy would significantly enhance educational value. Mobile optimization and accessibility improvements would also broaden the system’s usability.
