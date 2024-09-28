import express from "express";
import cors from "cors";
import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

// Connecting to MongoDB
const mongoURI = "mongodb+srv://danieltkachenko093:HvpwNZWwPW7QApSi@cluster0.xvtsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Local database

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
    seedDatabase();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Interface for a card
interface Card {
  _id: string;
  index: string;
  title: string;
  description: string;
}

// Interface for a board
interface Board extends Document {
  _id: string;
  name: string;
  todo: Card[];
  inProgress: Card[];
  done: Card[];
}

// Schema for a card
const CardSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  index: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Schema for a board
const BoardSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  todo: [CardSchema],
  inProgress: [CardSchema],
  done: [CardSchema],
});

// Board model
const BoardModel = mongoose.model<Board>("Board", BoardSchema);

const initialBoards: Partial<Board>[] = [
  {
    _id: uuidv4(),
    name: "Board 1",
    todo: [
      {
        _id: uuidv4(),
        index: "0",
        title: "Task 1",
        description: "Description for Task 1",
      },
      {
        _id: uuidv4(),
        index: "1",
        title: "Task 2",
        description: "Description for Task 2",
      },
    ],
    inProgress: [
      {
        _id: uuidv4(),
        index: "0",
        title: "Task 3",
        description: "Description for Task 3",
      },
    ],
    done: [
      {
        _id: uuidv4(),
        index: "0",
        title: "Task 4",
        description: "Description for Task 4",
      },
    ],
  },
  {
    _id: uuidv4(),
    name: "Board 2",
    todo: [],
    inProgress: [],
    done: [],
  },
];
// Function to seed the database
async function seedDatabase() {
  try {
    const existingBoards = await BoardModel.find();
    if (existingBoards.length === 0) {
      await BoardModel.insertMany(initialBoards);
      console.log("Database seeded with initial boards");
    } else {
      console.log("Database already contains boards, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Endpoint to get all boards
app.get("/api/boards", async (req, res) => {
  try {
    const boards = await BoardModel.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
});

// Endpoint to add a new board
app.post("/api/boards", async (req, res) => {
  const { _id, name } = req.body;
  const newBoard = new BoardModel({
    _id,
    name,
    todo: [],
    inProgress: [],
    done: [],
  });

  try {
    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(400).json({ message: "Error creating board" + error });
  }
});

// Endpoint to delete a board
app.delete("/api/boards/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    await BoardModel.findByIdAndDelete(_id);
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(404).send("Board not found" + error);
  }
});

// Helper function to add a card to the appropriate column
const addCardToColumn = (board: Board, columnNumber: string, newCard: Card) => {
  switch (columnNumber) {
    case "1": // To Do
      board.todo.push(newCard);
      break;
    case "2": // In Progress
      board.inProgress.push(newCard);
      break;
    case "3": // Done
      board.done.push(newCard);
      break;
    default:
      throw new Error("Invalid column number");
  }
};

// Endpoint to add a card to a column
app.post("/api/boards/:columnNumber", async (req, res) => {
  const { columnNumber } = req.params;
  const { boardId, index, title, description } = req.body;
  try {
    const board = await BoardModel.findById(boardId);
    if (!board || !["1", "2", "3"].includes(columnNumber)) {
      return res.status(404).send("Board not found or invalid column number");
    }

    const newCard: Card = {
      _id: uuidv4(),
      index,
      title,
      description,
    };

    addCardToColumn(board, columnNumber, newCard);

    await board.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error adding card:", error); 
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to update a card
app.put("/api/boards/:columnNumber/:cardId", async (req, res) => {
  const { columnNumber, cardId } = req.params;
  const { boardId, title, description } = req.body;

  try {
    const board = await BoardModel.findById(boardId);
    if (!board || !["1", "2", "3"].includes(columnNumber)) {
      return res.status(404).send("Board not found or invalid column number");
    }

    let card: Card | undefined;
    switch (columnNumber) {
      case "1":
        card = board.todo.find((c) => c._id === cardId);
        break;
      case "2":
        card = board.inProgress.find((c) => c._id === cardId);
        break;
      case "3":
        card = board.done.find((c) => c._id === cardId);
        break;
    }

    if (card) {
      card.title = title;
      card.description = description;
      await board.save(); 
      res.json(card);
    } else {
      res.status(404).send("Card not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
});

// Endpoint to delete a card
app.delete("/api/boards/:boardId/:columnNumber/:cardId", async (req, res) => {
  const { boardId, columnNumber, cardId } = req.params;

  try {
    const board = await BoardModel.findById(boardId);
    if (!board || !["1", "2", "3"].includes(columnNumber)) {
      return res.status(404).send("Board not found or invalid column number");
    }

    switch (columnNumber) {
      case "1":
        board.todo = board.todo.filter((card) => card._id !== cardId);
        break;
      case "2":
        board.inProgress = board.inProgress.filter(
          (card) => card._id !== cardId,
        );
        break;
      case "3":
        board.done = board.done.filter((card) => card._id !== cardId);
        break;
    }

    await board.save(); 
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
});

// Endpoint for moving a card between columns
app.put(
  "/api/boards/from/:fromColumn/to/:toColumn/:cardId",
  async (req, res) => {
    const { fromColumn, toColumn, cardId } = req.params;
    const { boardId, toIndex } = req.body;

    try {
      const board = await BoardModel.findById(boardId);
      if (!board) {
        return res.status(404).send("Board not found");
      }

      let cardToMove;

      switch (fromColumn) {
        case "1": // To Do
          cardToMove = board.todo.find((card) => card._id === cardId);
          board.todo = board.todo.filter((card) => card._id !== cardId);
          break;
        case "2": // In Progress
          cardToMove = board.inProgress.find((card) => card._id === cardId);
          board.inProgress = board.inProgress.filter(
            (card) => card._id !== cardId,
          );
          break;
        case "3": // Done
          cardToMove = board.done.find((card) => card._id === cardId);
          board.done = board.done.filter((card) => card._id !== cardId);
          break;
        default:
          return res.status(400).send("Invalid fromColumn value");
      }

      if (!cardToMove) {
        return res.status(404).send("Card not found in the specified column");
      }
      switch (toColumn) {
        case "1": // To Do
          board.todo.splice(toIndex, 0, cardToMove);
          break;
        case "2": // In Progress
          board.inProgress.splice(toIndex, 0, cardToMove);
          break;
        case "3": // Done
          board.done.splice(toIndex, 0, cardToMove);
          break;
        default:
          return res.status(400).send("Invalid toColumn value");
      }

      await board.save(); 
      res.status(200).json(cardToMove); 
    } catch (error) {
      res.status(500).json({ message: "Internal server error" + error });
    }
  },
);

// Starting the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
