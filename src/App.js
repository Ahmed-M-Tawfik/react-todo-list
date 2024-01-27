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
import { stringBlank, valueMissing, valuePresent } from "./Util";

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
  const [completedTasksPanelIsOpen, setCompletedTasksPanelIsOpen] =
    useState(false);
  const [openTasks, setOpenTasks] = useState(initialTaskData);
  const [completedTasks, setCompletedTasks] = useState([]);
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
    idOfTaskToUpdate,
    done
  ) {
    e.preventDefault();

    const newOrUpdatedTask = {
      id: valuePresent(idOfTaskToUpdate)
        ? idOfTaskToUpdate
        : crypto.randomUUID(),
      title: newTaskTitle,
      text: newTaskText,
      done: valuePresent(done) ? done : null,
    };

    let setTasksFunction = setOpenTasks;
    if (done) {
      setTasksFunction = setCompletedTasks;
    }

    if (valuePresent(idOfTaskToUpdate)) {
      setTasksFunction((tasks) =>
        tasks.map((task) =>
          task.id === idOfTaskToUpdate ? newOrUpdatedTask : task
        )
      );
    } else {
      setOpenTasks((tasks) => [...tasks, newOrUpdatedTask]);
    }

    handleCloseEditTaskPanel();
  }

  function handleOpenCompletedTasksPanel() {
    setCompletedTasksPanelIsOpen(true);
  }

  function handleCloseCompletedTasksPanel() {
    setCompletedTasksPanelIsOpen(false);
  }

  function handleSetTaskDone(idToSetDone) {
    if (valueMissing(idToSetDone)) return;

    let taskToSetDone = openTasks.find((task) => task.id === idToSetDone);
    taskToSetDone = { ...taskToSetDone, done: Date.now() };
    setCompletedTasks((tasks) => [...tasks, taskToSetDone]);

    handleDeleteOpenTask(idToSetDone);
  }

  function handleSetTaskOpen(idToSetOpen) {
    if (valueMissing(idToSetOpen)) return;

    let taskToSetOpen = completedTasks.find((task) => task.id === idToSetOpen);
    taskToSetOpen = { ...taskToSetOpen, done: null };
    setOpenTasks((tasks) => [...tasks, taskToSetOpen]);

    handleDeleteCompletedTask(idToSetOpen);
  }

  function handleMoveTask(idToMove, direction, setTasksFunction) {
    if (stringBlank(idToMove)) return;

    setTasksFunction((oldTasksList) => {
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

  function handleMoveOpenTask(idToMove, direction) {
    handleMoveTask(idToMove, direction, setOpenTasks);
  }

  function handleMoveCompletedTask(idToMove, direction) {
    handleMoveTask(idToMove, direction, setCompletedTasks);
  }

  function handleDeleteTask(idToDelete, setTasksFunction) {
    if (valueMissing(idToDelete)) return;
    setTasksFunction((tasks) =>
      tasks.filter((task) => (task.id === idToDelete ? false : true))
    );
  }

  function handleDeleteOpenTask(idToDelete) {
    handleDeleteTask(idToDelete, setOpenTasks);
  }

  function handleDeleteCompletedTask(idToDelete) {
    handleDeleteTask(idToDelete, setCompletedTasks);
  }

  function calculateCountTasksDoneThisWeek() {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 1
    );

    return completedTasks.filter((task) => {
      return task.done >= weekStart;
    }).length;
  }

  function calculateAllTasksComplete() {
    return openTasks.length === 0;
  }

  return (
    <Container className="text-center">
      <Row className="mt-4 app-title">
        <h1>What's next?</h1>
      </Row>

      {newTaskPanelIsOpen === true && (
        <>
          <EditTaskPanel
            taskToEdit={taskToEdit}
            onCreateUpdateTask={handleCreateUpdateTask}
            onCancel={handleCloseEditTaskPanel}
          />
        </>
      )}

      {newTaskPanelIsOpen === false && completedTasksPanelIsOpen === false && (
        <>
          <CenteredButton onClick={handleOpenNewTaskPanel}>
            Add new task
          </CenteredButton>
          <CenteredButton onClick={handleOpenCompletedTasksPanel}>
            View completed tasks ({calculateCountTasksDoneThisWeek()} this week)
          </CenteredButton>
          <TasksCompletedHeader
            numTasksCompleted={calculateCountTasksDoneThisWeek()}
            allComplete={calculateAllTasksComplete()}
          />
          <TaskContainer
            tasks={openTasks}
            onDeleteTask={handleDeleteOpenTask}
            onMoveTask={handleMoveOpenTask}
            onSetTaskDone={handleSetTaskDone}
            onOpenEditTaskPanel={handleOpenEditTaskPanel}
          />
        </>
      )}

      {newTaskPanelIsOpen === false && completedTasksPanelIsOpen === true && (
        <>
          <CenteredButton onClick={handleCloseCompletedTasksPanel}>
            View incomplete tasks
          </CenteredButton>
          <TasksCompletedHeader
            numTasksCompleted={calculateCountTasksDoneThisWeek()}
            allComplete={calculateAllTasksComplete()}
          />
          <TaskContainer
            tasks={completedTasks}
            onDeleteTask={handleDeleteCompletedTask}
            onMoveTask={handleMoveCompletedTask}
            onSetTaskDone={handleSetTaskOpen}
            onOpenEditTaskPanel={handleOpenEditTaskPanel}
          />
        </>
      )}
    </Container>
  );
}

function EditTaskPanel({ taskToEdit, onCreateUpdateTask, onCancel }) {
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : "");
  const [text, setText] = useState(taskToEdit ? taskToEdit.text : "");

  return (
    <Row className="m-3 justify-content-sm-center">
      <Col md={{ span: 6 }}>
        <Card className="text-bg-primary">
          <Form
            onSubmit={(e) =>
              onCreateUpdateTask(
                e,
                title,
                text,
                taskToEdit?.id,
                taskToEdit?.done
              )
            }
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

function CenteredButton({ onClick, children }) {
  return (
    <Row className="m-3 justify-content-sm-center" xs="auto">
      <Button onClick={onClick}>{children}</Button>
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
  const taskEntryRows = tasks.map((task) => (
    <TaskBlock
      task={task}
      key={task.id}
      onDeleteTask={onDeleteTask}
      onMoveTask={onMoveTask}
      onSetTaskDone={onSetTaskDone}
      onOpenEditTaskPanel={onOpenEditTaskPanel}
    />
  ));

  return <Container className="mt-4 mb-4">{taskEntryRows}</Container>;
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
