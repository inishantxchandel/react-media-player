# Media Player Project

This project is a custom audio/video player built using Next.js, with a focus on modularity, custom hooks, and TypeScript.

## Tech Stack

- **NextJs, TailwindCSS**

## Functionalities

### Player Controls
- **Play/Pause:** Allows users to toggle between playing and pausing media playback.
- **Previous/Next:** Enables navigation between media files in the playlist.
- **Volume Control:** Allows users to adjust the volume of the media playback.
- **Minimize/Full Screen:** Provides options to switch between a minimized player and full-screen mode.
- **10 Seconds Forward/Backward:** Allows users to skip forward or backward by 10 seconds.
- **Play Speed Control:** Allows users to adjust the playback speed within the range of 0.5x to 4x, with intervals of 0.25x.
- **Progress Bar:** Indicates the current progress of media playback and allows users to seek to any position by clicking on the progress bar.
- **Loading State Overlay:** Displays a loading state overlay when media is buffering.
- **Keyboard Accessibility:** Provides keyboard shortcuts for controlling playback and adjusting settings:
  - Spacebar: Toggle Play/Pause
  - Up/Down Arrow: Volume Control
  - Right/Left Arrow: 10-second Forward/Backward
  - M: Mute
  - F: Full Screen
  - Esc: Exit Full Screen
  - W: Minimize
  - N: Play Next Media
  - P: Play Previous Media
- **Automatic Controls Hiding:** Automatically hides controls when not in use, enhancing the viewing experience.

### Additional Features
- **Modularity:** The project is structured with modular components for easy maintenance and scalability.
- **Custom Hooks:** Utilizes custom hooks to encapsulate media playback logic, enhancing reusability and maintainability.
- **TypeScript:** Implemented using TypeScript for type safety and improved developer experience.
- **Responsive Design:** Supports responsive design, ensuring optimal viewing experience across different devices.
- **UI Polishing:** While the current UI is functional, there's room for improvement in terms of polishing and enhancing the user interface. Future iterations could focus on refining the UI to provide a more seamless and visually appealing experience.
- **Modal Media Player:** In future iterations, a modal media player feature could be implemented, allowing users to preview media in a modal window before playing it in full-screen mode. This feature would enhance user engagement and provide a more intuitive browsing experience.
- **Global State Management:** Although not currently implemented due to the project's requirements, future expansion could include global state management solutions like Redux, Zustand, or React Context to manage application state efficiently as the project grows.

## Instructions for Use

1. Clone the repository from GitHub.
2. Install dependencies using `npm install` or `yarn install`.
3. Start the development server using `npm run dev` or `yarn dev`.
4. Access the application in your browser at the provided URL.

## Submission Details

- **GitHub Repository:** [Repo](#)

- **Live Demo:** [Media Player](https://react-media-player-sage.vercel.app/)

## Notes

- The project includes at least five media URLs to test the previous/next functionality.
- Static data is maintained within the application for evaluation purposes.

For any questions or further clarification, please reach out. Thank you for considering this submission. We look forward to your feedback.

---
**Submitted by:** Nishant Chandel
