/// Elements
let arr = {
    todo: [],
    doing: [],
    done: []
}

let todoList = document.getElementById('todoUl');
let doingList = document.getElementById('doingUl');
let doneList = document.getElementById('doneUl');
let input = document.getElementById("input");

let secret = "";
let bin = "";

/// Drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.children[2].appendChild(document.getElementById(data));

    setCounter();
    save();
}

/// press enter on input to add
input.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13)
        add();

    write();
    save();
});

/// Add card to todo
function add() {
    if (input.value == "") {
        return false;
    }

    let obj = {
        text: input.value,
        category: 'todo',
        id: Math.random().toString(36).substring(7)
    }

    input.value = "";

    arr.todo.push(obj);
    write(arr.todo, todoList)
}

/// write all cards
function write(category, list) {
    clear(list);

    category.forEach(e => {
        list.appendChild(getCard(e));
    });

    setCounter();
}

/// get card element
function getCard(obj) {
    let li = document.createElement('li');
    li.innerHTML = obj.text + "<span class='btn-delete' removeid='" + obj.id + "' onclick='remove(event)'><i class='fas fa-times'></i></span>";
    li.setAttribute("draggable", true);
    li.setAttribute("ondragstart", "drag(event)");
    li.id = obj.id;
    return li;
}

/// clear ul
function clear(element) {
    let myNode = element;
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

/// get lis and set counters
function setCounter() {
    document.getElementById('todoCounter').innerHTML = document.getElementById('todoUl').children.length;
    document.getElementById('doingCounter').innerHTML = document.getElementById('doingUl').children.length;
    document.getElementById('doneCounter').innerHTML = document.getElementById('doneUl').children.length;
}



/// load
function load() {

    $.ajax({
        url: 'https://api.jsonbin.io/b/' + bin + '/latest',
        type: 'GET',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': secret
        },
        success: (data) => {
            arr.todo = data.todo;
            arr.doing = data.doing;
            arr.done = data.done;

            write(arr.todo, todoList);
            write(arr.doing, doingList);
            write(arr.done, doneList);

            setCounter();
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

function remove(e) {
    let parentElement = document.getElementById(e.srcElement.getAttribute("removeid"));
    $("#" + parentElement.id).remove()
    save();
}


function save() {
    let newTodoList = [],
        newDoingList = [],
        newDoneList = [];

    let curentTodoList = document.querySelectorAll('#todoUl > li');
    let currentDoingList = document.querySelectorAll('#doingUl > li');
    let currentDoneList = document.querySelectorAll('#doneUl > li');

    curentTodoList.forEach(element => {
        let obj = {
            text: element.innerText,
            category: 'todo',
            id: element.id
        }
        newTodoList.push(obj);
    });

    currentDoingList.forEach(element => {
        let obj = {
            text: element.innerText,
            category: 'doing',
            id: element.id
        }
        newDoingList.push(obj);
    });

    currentDoneList.forEach(element => {
        let obj = {
            text: element.innerText,
            category: 'done',
            id: element.id
        }
        newDoneList.push(obj);
    });

    arr.todo = newTodoList;
    arr.doing = newDoingList;
    arr.done = newDoneList;

    $.ajax({
        url: 'https://api.jsonbin.io/b/' + bin,
        type: 'PUT',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': secret
        },
        contentType: 'application/json',
        data: JSON.stringify(arr),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

function getLocalstorage() {
    var info = JSON.parse(localStorage.getItem("info"));

    if (info == null) {
        input.setAttribute("disabled", true);
        input.value = "Set your settings first!"
        return false;
    }

    if (info.secret == null || info.secret == "" || info.bin == null || info.bin == "") {
        input.setAttribute("disabled", true);
        input.value = "Settings are wrong!"

        return false;
    }

    secret = info.secret;
    bin = info.bin;
    var dark = JSON.parse(localStorage.getItem("dark"));

    if (dark == null) {
        dark = false;
    }

    if (dark) {
        document.getElementById("container").className = "container dark";
        document.getElementById("settings").className = "button btn-round button-dark";
        document.getElementById("dark").className = "button btn-round button-dark";
        document.getElementById("savebtn").className = "button btn-round button-save-dark";
        document.getElementById("modal").className = "modal modal-dark";
    }

    document.getElementById("secret").value = secret;
    document.getElementById("bin").value = bin;
    document.getElementById("dark").checked = dark;

    return true;

}

function darkmode() {

    var dark = false
    if (document.getElementById("container").className == "container") {
        dark = true
    }

    if (dark) {
        document.getElementById("container").className = "container dark";
        document.getElementById("settings").className = "button btn-round button-dark";
        document.getElementById("dark").className = "button btn-round button-dark";
        document.getElementById("savebtn").className = "button btn-round button-save-dark";
        document.getElementById("modal").className = "modal modal-dark";
    } else {

        document.getElementById("container").className = "container";
        document.getElementById("settings").className = "button btn-round ";
        document.getElementById("dark").className = "button btn-round ";
        document.getElementById("savebtn").className = "button btn-round button-save-dark";
        document.getElementById("modal").className = "modal ";
    }

    localStorage.setItem("dark", JSON.stringify(dark));

}

function saveData() {

    var secret = document.getElementById("secret").value;
    var bin = document.getElementById("bin").value;

    var obj = {
        secret: secret,
        bin: bin
    }

    localStorage.setItem("info", JSON.stringify(obj));
    window.location.reload(false);
}

$(function () {

    if (getLocalstorage()) {
        load();

    }

});