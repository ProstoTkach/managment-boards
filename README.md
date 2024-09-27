# Task Management Boards

A simple and intuitive task management application built with React, Redux, and TypeScript. This application allows users to create boards, manage tasks (cards), and organize them into three distinct columns: "To Do," "In Progress," and "Done."

## Features

- **Create and Manage Boards**: Users can create multiple boards for different projects.
- **Task Management**: Each board contains cards that represent tasks. Users can add, edit, and delete tasks.
- **Drag and Drop Functionality**: Rearrange tasks between columns using drag-and-drop.
- **Search Functionality**: Easily find specific boards or tasks.
- **Responsive Design**: The application is designed to work on various screen sizes.

## Technologies Used

- **Frontend**: 
  - React
  - Redux (for state management)
  - TypeScript (for type safety)
  - React DnD (for drag-and-drop functionality)
  - Prettier and ESLint (for code formatting and linting)

- **Backend**:
  - Express (for API development)
  - MongoDB (for data storage)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ProstoTkach/managment-boards.git
   cd management-boards

2. Open the folder "client" and install the dependencies:
   ```bash
   npm install

3. Open the folder "server", install the dependencies and build it:
   ```bash
   npm install
   npm run build

4. Start the development server in "client" and "server":
   ```bash
   npm start
   
### Usage

1. **Create a Board**: Click on the "Add Board" button to create a new board.

2. **Add Cards**: 
   - Select a board.
   - Click the "+" button in the respective column ("To Do," "In Progress," or "Done") to add a new card.

3. **Edit or Delete Cards**: 
   - Click on a card to open its details.
   - Use the "Edit" button to update the title or description, or click "Delete" to remove the card.

4. **Drag and Drop**: 
   - Move cards between columns by clicking and dragging them to the desired column. The changes will be reflected in the state of the application.

### Features

- **Three Columns**: Each board has three columns: "To Do," "In Progress," and "Done."
- **Responsive Design**: The application is designed to be responsive and works on various screen sizes.
- **State Management**: Uses Redux for state management, ensuring a smooth and predictable state flow.
- **Type Safety**: Built with TypeScript for better type safety and development experience.

### Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Redux Toolkit**: Simplified state management for React applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Express**: Back-end framework for handling API requests.
- **MongoDB**: Database options for storing data.

### Contribution

Contributions are welcome! If you have suggestions for improvements or features, please open an issue or submit a pull request.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgements

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React DnD](https://react-dnd.github.io/react-dnd/about)
- [TypeScript](https://www.typescriptlang.org/)
