var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCopmletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;

// main form handler
var taskFormHandler = function(){

    // overides browser default behavior
    event.preventDefault();

    // selects input type with name task-name
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    // selects select type with same name task-type
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // checks to see if target already has an id
    var isEdit = formEl.hasAttribute("data-task-id");

    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else{
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        createTaskEl(taskDataObj);
    }

    // checks if no type was submitted
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
};

// creates list items
var createTaskEl = function(taskDataObj){

        // create list item with custom attribute
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        listItemEl.setAttribute("draggable", "true");

    
        // create div to hold task info and add  to list item
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        // add html to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
        // appends list item with text for object
        listItemEl.appendChild(taskInfoEl);   
        // adds buttons to unique data-*
        var taskActionsEl = createTasksAction(taskIdCounter);
        // appends list item to add buttons
        listItemEl.appendChild(taskActionsEl);
        tasksToDoEl.appendChild(listItemEl);
        
        taskIdCounter++;
};

// creates a new task
var createTasksAction = function(taskId){
    // creates a container for child elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // add dropdown menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // gives options for dropdown menu
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++){
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

// creates a handler for each button
var taskButtonHandler = function(event){
    // search for class
    if(event.target.matches(".delete-btn")){
        // assigns variable taskId based on data-task-id
        var taskId = event.target.getAttribute("data-task-id");
        // runs deleteTask function
        deleteTask(taskId);
    }else if(event.target.matches(".edit-btn")){
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
};

// creates a function to delete item entry and then pipes into handler
var deleteTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
}

// creates a function to edit item entry and then pipes into handler
var editTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}

// change parameters of edited task
var completeEditTask = function(taskName, taskType, taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}


var taskStatusChangeHandler = function(event){
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if(statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed"){
        tasksCopmletedEl.appendChild(taskSelected);
    }
}

// event listener handler for dragging
var dragTaskHandler = function(event){
    var taskId = event.target.getAttribute("data-task-id");
    // store taskId in data transfer property
    event.dataTransfer.setData("text/plain", taskId);
    
    var getId = event.dataTransfer.getData("text/plain");
}

// limits where items can be dragged; uses closest to limit
var dropZoneDragHandler = function(event){
    var taskListEl = event.target.closest(".task-list");
    if(taskListEl){
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}

// creates a handler to drop elements
var dropTaskHandler = function(event){
    // retrieves id from dragTaskHandler
    var id = event.dataTransfer.getData("text/plain");
    // gets id of draggable element
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");

    // selects dropzone element and references a unique id
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    // set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    // determines where elements need to be dropped
    if (statusType === "tasks-to-do"){
        statusSelectEl.selectedIndex = 0;
    } else if (statusType === "tasks-in-progress"){
        statusSelectEl.selectedIndex = 1;
    } else if (statusType === "tasks-completed"){
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.removeAttribute("style");

    // appends the current droppable element
    dropZoneEl.appendChild(draggableElement);
}

// removes hover styleing
var dragLeaveHandler = function(event){
    var taskListEl = event.target.closest(".task-list");
    if(taskListEl){
        taskListEl.removeAttribute("style")
    }
}

// button listeners
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

//drag and drop
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);