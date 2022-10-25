import writingTodoImg from '../images/writing-todo.png';
import todoModalImg from '../images/todo-modal.png';
import checkingTodoImg from '../images/checking-todo.png';
import todoCardImg from '../images/todo-card.png';
import editingTodoImg from '../images/editing-todo.png';
import sidebarMenuImg from '../images/sidebar-menu.png';
import projectListImg from '../images/project-list.png';
import projectModalImg from '../images/project-modal.png';
import sortingProjectImg from '../images/sorting-project.png';

export default function () {
  const tutorial = Object.assign(document.createElement('div'), {
    className: 'tutorial-panel',
  });
  tutorial.innerHTML = `
    <div class="tutorial-content">
      <section>
        <div class="header">
          <div class="heading">Welcome to Keedo!</div>
          <div class="logo-icon"></div>
        </div>
        <p>Before you start, let us have a brief tutorial.</p>
      </section>
      <section>
        <div class="sub-heading">Writing your first todo!</div>
        <p>Type in the <span class="mono">Write to do...</span> bar and press <span class="mono">Enter</span> to immediately create a todo for today.</p>
        <img src="${writingTodoImg}" alt="Writing first todo">
        <p>While writing a todo, you will notice the right arrow <span class="mdi mdi-arrow-right"></span> and the pencil <span class="mdi mdi-pencil"> buttons appear on the right.</span></p>
        <p>The right arrow <span class="mdi mdi-arrow-right"></span> button will act the same as pressing the <span class="mono">Enter</span> key.</p>
        <p>The pencil <span class="mdi mdi-pencil"></span> button will open up the todo editor <span class="mono">Todo Modal</span> which will let you edit more details such as the description, priority, due date, etc.</p>
        <img src="${todoModalImg}" alt="The todo editor modal">
        <div class="caption">The todo editor</div>
      </section>
      <section>
        <div class="sub-heading">Completing a todo</div>
        <p>Just click on the grey circle <span class="grey-circle"></span> to check it off.</p>
        <img src="${checkingTodoImg}" style="width: 20%;" alt="Completing a todo">
      </section>
      <section>
        <div class="sub-heading">Quick todo utilities</div>
        <img src="${todoCardImg}" alt="The todo card">
        <p>Upon creating a new todo, you will see three icons on the right.</p>
        <p><span class="mdi mdi-delete"></span> removes the todo... forever.</p>
        <p><span class="mdi mdi-exclamation-thick"></span> lets you quickly change the priority.</p>
        <p><span class="mdi mdi-comment-text-outline"></span> lets you view the description you beautifully wrote.</p>
      </section>
      <section>
        <div class="sub-heading">Editing a todo</div>
        <p>To edit a todo, simply click on it and it will open up the todo editor <span class="mono">Todo Modal</span>.</p>
        <img src="${editingTodoImg}" alt="Editing a todo">
      </section>
      <section>
        <div class="sub-heading">Sidebar Menu</div>
        <p>If you're on mobile, click on the burger icon <span class="mdi mdi-menu"></span> to open up the sidebar menu.</p>
        <img src="${sidebarMenuImg}" style="width: 40%;" alt="Sidebar menu">
      </section>
      <section>
        <div class="sub-heading">Projects</div>
        <p>Projects are a way to organize your todos. They're akin to folders but just named <span class="mono">Project</span> instead.</p>
        <p>On the left (if you're using a computer) or when you open up the sidebar menu, you'll find the list of projects you have.</p>
        <img src="${projectListImg}" alt="List of projects">
        <p>To add, edit, or <strong>even sort(!)</strong> projects, press on the pencil <span class="mdi mdi-pencil"></span> button to open up the projects editor <span class="mono">Project Modal</span>.</p>
        <img src="${projectModalImg}" style="width: 40%;" alt="The projects editor">
        <div class="caption">The projects editor</div>
      </section>
      <section>
        <div class="sub-heading">Editing a project</div>
        <p>Simply press on a project then go ahead and change its name.</p>
        <p>Don't forget to press the confirm <span class="mdi mdi-check"></span> button or hit the <span class="mono">Enter</span> key to save your change!</p>
        <img src="" alt="Editing a project">
      </section>
      <section>
        <div class="sub-heading">Sorting projects</div>
        <p>To change the hierarchy of your projects, simply drag the vertical handles <span class="mdi mdi-drag-vertical"></span> on the left and drop it to your desired new place.</p>
        <img src="${sortingProjectImg}" alt="Sorting a project">
      </section>
      <section>
        <div class="sub-heading">Creating todos based on project</div>
        <p>Need to add multiple todos on the same project?</p>
        <p>Simply go to one of your project's tab and start writing todos from there!</p>
        <img src="" alt="Multiple todos on same project">
      </section>
      <section>
        <div class="sub-heading">And that's all!</div>
        <p>Congratulations for bearing with me through this tutorial.</p>
        <p>You are now ready to be a task master and fulfil all your hopes and dreams!</p>
      </section>
      <button class="begin-button">Let's begin!</button>
    </div>
  `;
  document.body.appendChild(tutorial);
}