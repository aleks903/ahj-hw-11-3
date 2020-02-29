/* eslint-disable class-methods-use-this */
export default class DOM {
  drawStats(arr, parentEl) {
    const elProjects = document.createElement('div');
    elProjects.className = 'projects';
    elProjects.innerHTML = `
    Stats
    <div class="le-projects">
    <div class="title-projects item-project">
      <div class="col-one">Project</div>
      <div class="col-two">Open</div>
    </div>
    ${this.addListProject(arr)}
    </div>
    `;
    parentEl.appendChild(elProjects);
  }

  addListProject(obj) {
    let elHtml = '';
    for (const item of obj) {
      elHtml += `
        <div class="item-project">
          <div class="col-one">${item.name}</div>
          <div class="amount-tasks col-two">
            <span data-id="${item.id}">0</span>
          </div>
        </div>
      `;
    }
    return elHtml;
  }

  addTasks(arr, parentEl) {
    const elTasks = document.createElement('div');
    elTasks.className = 'tasks';
    elTasks.innerHTML = `
    Tasks
    <div class="table-tasks">
      <div class="item-tasks">Projsect:
        <span id="${arr[0].id}" class="select cursor">${arr[0].name}</span>
      </div>
    ${this.addListTasks(arr)}
    </div>
    `;
    parentEl.appendChild(elTasks);
  }

  addListTasks(obj) {
    let elHtml = '';
    for (const item of obj) {
      elHtml += `
        <div class="project-tasks" data-id="${item.id}">
          ${this.addItemList(item.tasks, item.id)}
        </div>
      `;
    }
    return elHtml;
  }

  addItemList(listObj, id) {
    let elHtml = '';
    for (const item of listObj) {
      elHtml += `
        <div class="item-tasks">
          <div class="select-task cursor ${item.done ? 'active' : ''}" data-id-project="${id}" data-id-task="${item.id}"></div>
          <span class="name-task">${item.name}</span>
        </div>
      `;
    }
    return elHtml;
  }

  addElementChangeProjectTask(arr, parentEl) {
    let elHtml = '';
    for (const item of arr) {
      elHtml += `
        <div class="project-name cursor" data-id="${item.id}">${item.name}</div>
      `;
    }

    const popupChangeProject = document.createElement('div');
    popupChangeProject.className = 'popup project-tasks';
    popupChangeProject.innerHTML = `
    <span>Projsect:</span>
    <div class="popup-project">
      ${elHtml}
    </div>
    `;
    parentEl.appendChild(popupChangeProject);
  }
}
