// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  
  const todoInput = document.querySelector("#todo");
  const dateInput = document.querySelector("#date");
  
  const currentDate = new Date();
  const targetDate = new Date(dateInput.value);
  targetDate.setHours(targetDate.getHours() + 4)
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  let urgency = "Not Urgent";
  if(daysDifference < 0){
    urgency = "Late"
  }
  else if(daysDifference <= 7){
    urgency = "Urgent"
  }
  
  
  const json = {
      todo: todoInput.value,
      date: dateInput.value,
      urgency: urgency,
      done: false,
      userID: 0
    }
   
  todoInput.value = '';
  todoInput.focus();
  dateInput.value = '';

  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(json)
  });

  fetch('/docs')
    .then(response => response.json())
    .then(data => {
       updateList(data);
  })
};

const deleteItem = async function (event) {
  const todoItem = event.target.dataset.id;
  const json = {
    _id: todoItem
  }
  const response = await fetch("/delete", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json),
  });

  fetch('/docs')
    .then(response => response.json())
    .then(data => {
       updateList(data);
  })
};

const updateCheckbox = async function (event) {
      const doneItem = event.target.dataset.done;
      const todoItem = event.target.dataset.id;
      const dateItem = event.target.dataset.date
      
      const json = { 
        _id: todoItem, 
        date: dateItem, 
        done: doneItem 
      };
      
      const response = await fetch("/update", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      fetch('/docs')
        .then(response => response.json())
        .then(data => {
           updateList(data);
      })
    }

const updateList = function (data) {
  const list = document.getElementById("todoList");
  list.innerHTML = "";

  data.forEach((todo) => {
    const item = document.createElement("li");
    let shouldCheck = todo.done;

    item.innerHTML = `
            <style>
              label[for="' + ${todo._id} + '"] {
                border: 0;
                clip: rect(0 0 0 0);
                height: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                position: absolute;
                width: 1px;
              }
            </style>
            <div class="listItem">
            <label for="' + ${todo._id} + '">Done?</label>
            <input id="' + ${todo._id} + '" type="checkbox" class="check" data-id="${todo._id}" data-date="${todo.date}" data-done="${todo.done}">
            <p
              data-id="${todo._id}"
              ondblclick="makeEditable(this)"
              onblur="saveEditable(this)"
              contenteditable="false"
              class="todo"
            >${todo.todo}</p>
            <p class="date">Due Date: ${todo.date}</p>
            <p class="urgency">${todo.urgency}</p>
            <button class="delete btn btn-secondary btn-sm" data-id="${todo._id}">Delete</button>
            </div>
        `;
    list.appendChild(item);

    const p = document.querySelectorAll('.urgency');

    p.forEach(p => {
      let color = 'black'
      if (p.textContent === 'Done') {
        color = '#5BFF91';
      }
      else if (p.textContent === 'Urgent') {
        color= '#FF7D70';
      }
      else if (p.textContent === 'Not Urgent') {
        color= '#8A9BFF';
      }
      else if (p.textContent === 'Late') {
        color= '#FFA505';
      }
      p.style.backgroundColor = color;
    });
    
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.checked = shouldCheck;
  });
  
  const checkboxes = document.querySelectorAll(".check");
  checkboxes.forEach((box) => {
    box.addEventListener("click", updateCheckbox);
  });

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteItem);
  });
};

function makeEditable(element) {
  element.dataset.originalText = element.textContent;
  element.contentEditable = true;
  element.classList.add('inEdit');
}

async function saveEditable(element) {
  element.contentEditable = false;
  element.classList.remove('inEdit');

  // Get the edited text content
  const editedText = element.textContent;
  const todoItem = event.target.dataset.id;

  // You can save the edited text here or perform any other actions with it
  const response = await fetch("/edit", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id: todoItem, todoNew: editedText}),
  });

    
}


window.onload = async function () {
  const addButton = document.querySelector("#add");
  addButton.onclick = submit;

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteItem);
  });
  
  const checkboxes = document.querySelectorAll('.check');
  checkboxes.forEach((box) => {
    box.addEventListener("click", updateCheckbox);
  });
  
   fetch('/docs')
      .then(response => response.json())
      .then(data => {
        updateList(data);
    })
  
  fetch('/username')
      .then(response => response.json())
      .then(data => {
        const loggedInUsername = data[0].username;
        const usernamePlaceholder = document.getElementById("usernamePlaceholder");
        usernamePlaceholder.textContent = loggedInUsername;
      })
};
