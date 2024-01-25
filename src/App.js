import "./index.css";

import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faArrowUp,
  faArrowDown,
  faCheck,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

const initialTaskData = [
  {
    id: 0,
    title: "Buy some groceries",
    text: "Buy salad, olive oil, and Greek yogurt for a nice and healthy snack!",
    done: null,
  },
  {
    id: 1,
    title: "Plan weekend getaway",
    text: "Research and plan a relaxing weekend getaway to recharge, whether it's a stay in the countryside, or a hop over to Continental Europe!",
    done: null,
  },
  {
    id: 2,
    title: "Read a book",
    text: "Pick up a new book or finish that one you've been meaning to read.",
    done: null, //Date.now(),
  },
  {
    id: 5,
    title: "A long task",
    text: "Some really long task with lots of steps:\n- Step 1\n- Step 2\n- Step 3",
    done: null,
  },
  {
    id: 3,
    title: "Exercise",
    text: "Go for a jog, do some yoga, or try a new workout routine to stay active.",
    done: null,
  },
  {
    id: 4,
    title: "Learn something new",
    text: "Explore a new language, skill, or hobby to keep your mind engaged.",
    done: null,
  },
];

export default function App() {
  const [newTaskPanelIsOpen, setNewTaskPanelIsOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTaskData);
  const [taskToEdit, setTaskToEdit] = useState(null);

  function handleOpenNewTaskPanel() {
    handleOpenEditTaskPanel(null);
  }

  function handleOpenEditTaskPanel(taskSelectedForEditing) {
    setTaskToEdit(taskSelectedForEditing);
    setNewTaskPanelIsOpen(true);
  }

  function handleCloseEditTaskPanel() {
    setTaskToEdit(null);
    setNewTaskPanelIsOpen(false);
  }

  function handleCreateUpdateTask(
    e,
    newTaskTitle,
    newTaskText,
    idOfTaskToUpdate
  ) {
    e.preventDefault();

    const newOrUpdatedTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      text: newTaskText,
      done: null,
    };

    if (idOfTaskToUpdate) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === idOfTaskToUpdate ? newOrUpdatedTask : task
        )
      );
    } else {
      setTasks((tasks) => [...tasks, newOrUpdatedTask]);
    }

    handleCloseEditTaskPanel();
  }

  function handleSetTaskDone(idToSetDone) {
    if (idToSetDone === null) return;

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === idToSetDone ? { ...task, done: Date.now() } : task
      )
    );
  }

  function handleMoveTask(idToMove, direction) {
    if (idToMove === null || !direction?.trim()) return;

    setTasks((oldTasksList) => {
      const newTasksList = oldTasksList.slice();
      const indexOfTaskToMove = newTasksList.findIndex(
        ({ id }) => id === idToMove
      );

      if (direction === "up" && indexOfTaskToMove > 0) {
        const temp = newTasksList[indexOfTaskToMove - 1];
        newTasksList[indexOfTaskToMove - 1] = newTasksList[indexOfTaskToMove];
        newTasksList[indexOfTaskToMove] = temp;
      } else if (
        direction === "down" &&
        indexOfTaskToMove < newTasksList.length - 1
      ) {
        const temp = newTasksList[indexOfTaskToMove + 1];
        newTasksList[indexOfTaskToMove + 1] = newTasksList[indexOfTaskToMove];
        newTasksList[indexOfTaskToMove] = temp;
      }

      return newTasksList;
    });
  }

  function handleDeleteTask(idToDelete) {
    if (idToDelete === null) return;
    setTasks((tasks) =>
      tasks.filter((task) => (task.id === idToDelete ? false : true))
    );
  }

  function calculateCountTasksDoneThisWeek() {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 1
    );

    return tasks.filter((task) => {
      return task.done >= weekStart;
    }).length;
  }

  function calculateAllTasksComplete() {
    return tasks.filter((tasks) => !tasks.done).length === 0;
  }

  return (
    <Container className="text-center">
      <Row className="mt-4 app-title">
        <h1>What's next?</h1>
      </Row>

      {newTaskPanelIsOpen === true && (
        <>
          <NewTaskPanel
            taskToEdit={taskToEdit}
            onCreateUpdateTask={handleCreateUpdateTask}
            onCancel={handleCloseEditTaskPanel}
          />
        </>
      )}

      {newTaskPanelIsOpen === false && (
        <>
          <NewTaskButton onOpenNewTask={handleOpenNewTaskPanel} />
          <TasksCompletedHeader
            numTasksCompleted={calculateCountTasksDoneThisWeek()}
            allComplete={calculateAllTasksComplete()}
          />
          <TaskContainer
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onSetTaskDone={handleSetTaskDone}
            onOpenEditTaskPanel={handleOpenEditTaskPanel}
          />
        </>
      )}
    </Container>
  );
}

function NewTaskPanel({ taskToEdit, onCreateUpdateTask, onCancel }) {
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : "");
  const [text, setText] = useState(taskToEdit ? taskToEdit.text : "");

  return (
    <Row className="m-3 justify-content-sm-center">
      <Col md={{ span: 6 }}>
        <Card className="text-bg-primary">
          <Form
            onSubmit={(e) => onCreateUpdateTask(e, title, text, taskToEdit?.id)}
          >
            <Card.Body>
              <Form.Group className="mb-3" controlId="formAddTask">
                <Form.Control
                  className="mb-3 text-bg-primary"
                  type="text"
                  placeholder="What's next?"
                  size="lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Form.Control
                  className="mb-3 text-bg-primary"
                  as="textarea"
                  rows={3}
                  placeholder="A bit more detail..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Form.Group>
              <Button
                className={`text-bg-${!taskToEdit ? "success" : "warning"}`}
                type="submit"
              >
                {!taskToEdit ? "Add" : "Update"}
              </Button>
              <Button className="text-bg-danger" onClick={onCancel}>
                Cancel
              </Button>
            </Card.Body>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

function NewTaskButton({ onOpenNewTask }) {
  return (
    <Row className="m-3 justify-content-sm-center" xs="auto">
      <Button onClick={onOpenNewTask}>Add new task</Button>
    </Row>
  );
}

function TasksCompletedHeader({ numTasksCompleted, allComplete }) {
  let message = `Tasks completed this week: ${numTasksCompleted}`;
  if (numTasksCompleted === 0 && allComplete) {
    message = `No tasks added yet`;
  } else if (numTasksCompleted === 0) {
    message = `Time to get started!`;
  } else if (allComplete) {
    message = `All tasks complete! (${numTasksCompleted}/${numTasksCompleted}!)`;
  }

  return (
    <Row>
      <h5>{message}</h5>
    </Row>
  );
}

function TaskContainer({
  tasks,
  onDeleteTask,
  onMoveTask,
  onSetTaskDone,
  onOpenEditTaskPanel,
}) {
  const taskEntryRows = tasks.map(
    (task) =>
      task.done === null && (
        <TaskBlock
          task={task}
          key={task.id}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onSetTaskDone={onSetTaskDone}
          onOpenEditTaskPanel={onOpenEditTaskPanel}
        />
      )
  );

  return <Container className="mt-4">{taskEntryRows}</Container>;
}

function TaskBlock({
  task,
  onDeleteTask,
  onMoveTask,
  onSetTaskDone,
  onOpenEditTaskPanel,
}) {
  return (
    <Row className="mt-3 align-items-center justify-content-sm-center">
      <Col xs="auto">
        <Button variant="warning" onClick={() => onOpenEditTaskPanel(task)}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </Button>
      </Col>
      <Col xs="auto">
        <Row>
          <Col>
            <Button
              variant="secondary"
              onClick={() => onMoveTask(task.id, "up")}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </Button>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col>
            <Button
              variant="secondary"
              onClick={() => onMoveTask(task.id, "down")}
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </Button>
          </Col>
        </Row>
      </Col>
      <Col md={{ span: 6 }}>
        <TaskContent task={task} />
      </Col>
      <Col xs="auto">
        <Button variant="success" onClick={() => onSetTaskDone(task.id)}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
      </Col>
      <Col xs="auto">
        <Button variant="danger" onClick={() => onDeleteTask(task.id)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </Col>
    </Row>
  );
}

function TaskContent({ task }) {
  return (
    <Card className="text-bg-primary">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text style={{ whiteSpace: "pre-line" }}>{task.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}
