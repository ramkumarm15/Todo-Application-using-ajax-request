let csrftoken = getCookie("csrftoken");
// Get CSRFToken Cookie for sending data
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// TASK functions
let url = "http://127.0.0.1:8000/api/task/";
let list_snapshot = [];
let activeItem = null;

// Render task in DOM
const renderTask = () => {
  let options = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };
  let taskList = document.getElementById("task-list");
  fetch(url, options)
    .then((resp) => resp.json())
    .then((data) => {
      let list = data;
      for (let i in list) {
        try {
          document.getElementById(`data-row-${i}`).remove();
        } catch (err) {}
        let title = `<p>${list[i].title} <span><input type="checkbox" class="form-check task-completed"></span></p>`;
        if (list[i].completed) {
          title = `<strike><p>${list[i].title} <span><input type="checkbox" checked class="form-check task-completed"></span></p></strike>`;
        }
        let html = `<div id="data-row-${i}" class="row mb-4">
                                        <div class="col-md-5">
                                            ${title}
							            </div>
							            <div class="col-md-7 ">
								            <div class="float-end ">
                                                <button class="btn btn-sm btn-outline-dark edit"><i class="uil uil-edit-alt"></i> Edit</button>
                                                <button class="btn btn-sm btn-outline-danger delete"><i class="uil uil-trash-alt"></i> Delete</button>

                                            </div>
                                        </div>
                                    </div>`;
        taskList.innerHTML += html;
      }

      if (list_snapshot.length > list.length) {
        for (let i = list.length; i < list_snapshot.length; i++) {
          document.getElementById(`data-row-${i}`).remove();
        }
      }

      console.log("Before Assign", list_snapshot);
      list_snapshot = list;
      console.log("After Assign", list_snapshot);
      for (let i in list) {
        let editbtn = document.getElementsByClassName("edit")[i];
        let deleteBTN = document.getElementsByClassName("delete")[i];
        let taskCompleted =
          document.getElementsByClassName("task-completed")[i];

        editbtn.addEventListener("click", (item) => {
          editbtns(list[i]);
        });
        deleteBTN.addEventListener("click", () => {
          deleteBtn(list[i]);
        });
        taskCompleted.addEventListener("change", () => {
          taskComplete(list[i]);
        });
      }
    });
};
renderTask();

// Send AJAX request to server after form submit
let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let url = "http://127.0.0.1:8000/api/taskcreate/";
  if (activeItem != null) {
    url = `http://127.0.0.1:8000/api/taskupdate/${activeItem.id}`;
    activeItem = null;
  }
  let title = document.getElementById("task").value;
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ title: title }),
  };
  fetch(url, options).then((res) => {
    renderTask();
    form.reset();
  });
});

// Focus on Individual task to edit
const editbtns = (item) => {
  activeItem = item;
  document.getElementById("task").value = activeItem.title;
};

// Delete a Individual task
const deleteBtn = (item) => {
  let url = `http://127.0.0.1:8000/api/taskdelete/${item.id}`;
  let options = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };
  fetch(url, options).then((response) => {
    renderTask();
  });
};

// Strike out the task when it is completed
const taskComplete = (item) => {
  let url = `http://127.0.0.1:8000/api/taskupdate/${item.id}`;
  let data = {
    title: item.title,
    completed: !item.completed,
  };
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  };
  fetch(url, options).then((response) => {
    renderTask();
  });
};
