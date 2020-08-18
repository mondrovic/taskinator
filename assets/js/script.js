var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(){

    // overides browser default behavior
    event.preventDefault();

    // selects input type with name task-name
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    // selects select type with same name task-type
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }

    createTaskEl(taskDataObj);

    formEl.reset();
};

var createTaskEl = function(taskDataObj){

        // create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
    
        // create div to hold task info and add  to list item
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        // add html to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
        listItemEl.appendChild(taskInfoEl);
    
        tasksToDoEl.appendChild(listItemEl);
};

// adds event listener to button and appends list items
formEl.addEventListener("submit", taskFormHandler);