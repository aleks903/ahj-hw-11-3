import { Subject } from 'rxjs';
import {
  startWith,
  scan,
  share,
  pluck,
  distinctUntilChanged,
} from 'rxjs/operators';
import DOM from './DOM.js';

const Actions = {
  Increment: 'INCREMENT',
  Decrement: 'DECREMENT',
  Reset: 'RESET',
};
const stores = {};

const dom = new DOM();
const objProjects = {
  projects: [
    {
      id: 4,
      name: 'iOS App',
      tasks: [
        {
          id: 25,
          name: 'Push Notifications',
          done: true,
        },
        {
          id: 26,
          name: 'Apple Pay Support',
          done: false,
        },
        {
          id: 27,
          name: 'l18n',
          done: false,
        },
        {
          id: 28,
          name: 'AppStore Publication',
          done: false,
        },
      ],
    },
    {
      id: 5,
      name: 'REST Backend',
      tasks: [
        {
          id: 25,
          name: 'Push Notifications',
          done: true,
        },
        {
          id: 26,
          name: 'Apple Pay Support',
          done: false,
        },
        {
          id: 27,
          name: 'l18n',
          done: false,
        },
        {
          id: 28,
          name: 'AppStore Publication',
          done: false,
        },
      ],
    },
    {
      id: 6,
      name: 'Frontend',
      tasks: [
        {
          id: 25,
          name: 'Push Notifications',
          done: true,
        },
        {
          id: 26,
          name: 'Apple Pay Support',
          done: false,
        },
        {
          id: 27,
          name: 'l18n',
          done: false,
        },
        {
          id: 28,
          name: 'AppStore Publication',
          done: false,
        },
      ],
    },
    {
      id: 7,
      name: 'Android App',
      tasks: [
        {
          id: 25,
          name: 'Push Notifications',
          done: true,
        },
        {
          id: 26,
          name: 'Apple Pay Support',
          done: false,
        },
        {
          id: 27,
          name: 'l18n',
          done: false,
        },
        {
          id: 28,
          name: 'AppStore Publication',
          done: false,
        },
      ],
    },
  ],
};

function reduce(state, action) {
  switch (action.type) {
    case Actions.Increment:
      return { ...state, counter: state.counter + 1 };
    case Actions.Decrement:
      return { ...state, counter: state.counter - 1 };
    case Actions.Reset:
      return { ...state, counter: 0 };
    default:
      return state;
  }
}

class Store {
  constructor() {
    this.actions$ = new Subject();
    this.state$ = this.actions$.asObservable().pipe(
      startWith({ type: '__INITIALIZATION__' }),
      scan((state, action) => reduce(state, action), { counter: 0 }),
      share(),
    );
  }

  dispatch(type, payload = null) {
    this.actions$.next({ type, payload });
  }

  inc(value = null) {
    this.dispatch(Actions.Increment, value);
  }

  dec(value = null) {
    this.dispatch(Actions.Decrement, value);
  }

  reset() {
    this.dispatch(Actions.Reset);
  }
}

dom.drawStats(objProjects.projects, document.body);
dom.addTasks(objProjects.projects, document.body);

function addStores() {
  for (const item of objProjects.projects) {
    stores[item.id] = new Store();
    stores[item.id].state$
      .pipe(
        pluck('counter'),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        document.querySelector(`[data-id='${item.id}']`).innerText = value;
      });
    for (const itemTask of item.tasks) {
      if (itemTask.done) stores[item.id].inc();
    }
  }
}

addStores();

dom.addElementChangeProjectTask(objProjects.projects, document.querySelector('.table-tasks'));

function changeVisibleTasks(idProject) {
  const elRojectTasks = document.querySelectorAll('.project-tasks');
  for (const item of elRojectTasks) {
    if (item.dataset.id === idProject) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  }
}

function changeObjProjects(arr, idProj, idTask, value) {
  const itProj = arr.findIndex((item) => item.id === idProj);
  if (itProj !== -1) {
    const itTask = arr[itProj].tasks.findIndex((item) => item.id === idTask);
    if (itTask !== -1) {
      /* eslint no-param-reassign: "error" */
      arr[itProj].tasks[itTask].done = value;
    }
  }
}

const elementsTask = document.querySelector('.table-tasks');
elementsTask.addEventListener('click', (event) => {
  event.preventDefault();
  const itemEl = event.target;
  if (itemEl.classList.contains('select-task')) {
    const itemIdProject = itemEl.dataset.idProject;
    const itemITask = itemEl.dataset.idTask;

    if (itemEl.classList.contains('active')) {
      itemEl.classList.remove('active');
      stores[itemIdProject].dec();
      changeObjProjects(objProjects.projects, itemIdProject, itemITask, false);
      return;
    }
    itemEl.classList.add('active');
    stores[itemIdProject].inc();
    changeObjProjects(objProjects.projects, itemIdProject, itemITask, true);
  }
});

// popup
const elChangeProject = document.querySelector('.item-tasks span');
const elPopup = document.querySelector('.popup');
const elPopupProjects = document.querySelector('.popup-project');
let prevSelectProject = null;

elChangeProject.addEventListener('click', () => {
  elPopup.classList.remove('hidden');
});

elPopupProjects.addEventListener('click', (event) => {
  const itemEl = event.target;
  if (itemEl.classList.contains('project-name')) {
    elChangeProject.id = itemEl.dataset.id;
    elChangeProject.textContent = itemEl.textContent;
    if (prevSelectProject !== null) prevSelectProject.classList.remove('select');
    itemEl.classList.add('select');
    prevSelectProject = itemEl;
    changeVisibleTasks(itemEl.dataset.id);
    elPopup.classList.add('hidden');
  }
});

changeVisibleTasks('4');
