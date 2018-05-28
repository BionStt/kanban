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
    li.innerHTML = '' + obj.text + '<span class="btn-delete" onclick="remove(' + obj.id + ')"></span>';
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

function setCounter() {
    document.getElementById('todoCounter').innerHTML = document.getElementById('todoUl').children.length;
    document.getElementById('doingCounter').innerHTML = document.getElementById('doingUl').children.length;
    document.getElementById('doneCounter').innerHTML = document.getElementById('doneUl').children.length;
}

load();

/// load
function load() {

    $.ajax({
        url: 'https://api.jsonbin.io/b/5b0bf68fc83f6d4cc734a080/latest',
        type: 'GET',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': '$2a$10$V36.po9G/JTdYKf4OeuUiODyGHTrWZW4SlXb1lyHOF5KqIcCdCwEi'
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

function remove(id) {

    $("#" + id).remove()
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
        url: 'https://api.jsonbin.io/b/5b0bf68fc83f6d4cc734a080',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(arr),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
    // console.log(newTodoList);
    // console.log(newDoingList);
    // console.log(newDoneList);
}

// //api.jsonbin.io/b/5b0bf68fc83f6d4cc734a080