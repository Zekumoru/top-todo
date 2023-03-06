import { collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getUserId, isUserSignedIn } from "./firebase-utils";
import KeedoStorage from "./KeedoStorage";
import TodoRenderer from "./TodoRenderer/TodoRenderer";

let todos = KeedoStorage.loadTodos();
let unsubscribeSnapshot = null;

const getUserTodosPath = () => `users/${getUserId()}/todos`;
const getTodoDocPath = (id) => doc(getFirestore(), getUserTodosPath(), id);

if (todos === undefined) {
  ({ todos } = KeedoStorage.populate());
  KeedoStorage.todos = todos;
  KeedoStorage.saveTodos();
}

const onTodosChange = (type, todo) => {
  if (type === 'added') {
    todos.push(todo);
  }
  
  todoRenderer.removeCardById(todo.id);
  
  if (type === 'removed') {
    todos = todos.filter((t) => t.id !== todo.id);
    return;
  }

  // type === 'modified'
  const modifiedTodoIndex = todos.findIndex((t) => t.id === todo.id);
  todos[modifiedTodoIndex] = todo;
  todoRenderer.renderTodo(todo);
};

const addTodo = (todo) => {
  if (!isUserSignedIn()) {
    onTodosChange('added', todo);
    KeedoStorage.saveTodos();
    return;
  }
  
  setDoc(getTodoDocPath(todo.id), {
    ...todo,
    timestamp: serverTimestamp(),
    createdByUserId: getUserId(),
  });
};

const loadTodos = () => {
  if (!isUserSignedIn()) {
    todos = KeedoStorage.loadTodos();
    KeedoStorage.todos = todos;
    return;
  }

  if (typeof unsubscribeSnapshot === 'function') {
    unsubscribeSnapshot();
  }

  todos = [];
  unsubscribeSnapshot = onSnapshot(collection(getFirestore(), getUserTodosPath()), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const todo = change.doc.data();
      onTodosChange(change.type, todo);
    })
  });
};

const updateTodo = (todo, fields) => {
  if (!isUserSignedIn()) {
    const updatedTodo = {
      ...todo,
      ...fields,
    };
    onTodosChange('modified', updatedTodo);
    KeedoStorage.saveTodos();
    return;
  }
  
  updateDoc(getTodoDocPath(todo.id), fields);
}

const deleteTodo = (todo) => {
  if (!isUserSignedIn()) {
    onTodosChange('removed', todo);
    KeedoStorage.todos = todos; // needed otherwise saveTodos below will save the old array
    KeedoStorage.saveTodos();
    return;
  }

  deleteDoc(getTodoDocPath(todo.id));
};

const getTodos = () => todos;

const todoRenderer = new TodoRenderer(document.querySelector('.todos'), getTodos());

export { addTodo, getTodos, loadTodos, updateTodo, deleteTodo, todoRenderer };