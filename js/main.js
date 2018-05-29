/// Elements
let arr = {
    todo: [],
    doing: [],
    done: []
}

let jsonbin = false;

let todoList = document.getElementById('todoUl');
let doingList = document.getElementById('doingUl');
let doneList = document.getElementById('doneUl');
let input = document.getElementById("input");

let secret = "";
let bin = "";

/// press enter on input to add
input.addEventListener("keyup", function (event) {
    event.preventDefault();

    let value = document.getElementById("input").value;
    if (event.keyCode === 13) {
        if (value.indexOf("add secret: ") != -1) {
            secret = value.replace("add secret: ", "");
            saveData("secret", secret);
            return false;
        }

        if (value.indexOf("add bin: ") != -1) {
            bin = value.replace("add bin: ", "");
            saveData("bin", bin);
            return false;
        }

        if (value.indexOf("delete settings") != -1) {
            localStorage.removeItem("secret");
            localStorage.removeItem("bin");
            window.location.reload();
        }

        add();

        // write();
        save();
    }


});

/// Add card to todo
function add() {

    input = document.getElementById("input");

    if (input.value == "") {
        return false;
    }

    let obj = {
        text: input.value,
        category: 'todo',
        id: getRandomId()
    }

    input.value = "";

    arr.todo.push(obj);
    write(arr.todo, todoList)
}

/// load
function load() {

    if (!jsonbin) {
        arr = JSON.parse(localStorage.getItem("data"));

        if (arr != null) {
            write(arr.todo, todoList);
            write(arr.doing, doingList);
            write(arr.done, doneList);
        } else {
            arr = {
                todo: [],
                doing: [],
                done: []
            }
        }
    } else {
        $.ajax({
            url: 'https://api.jsonbin.io/b/' + bin + '/latest',
            type: 'GET',
            headers: {
                'secret-key': secret
            },
            success: (data) => {
                write(data.todo, todoList);
                write(data.doing, doingList);
                write(data.done, doneList);

                setCounter();
            },
            error: (err) => {
                console.log(err.responseJSON);
            }
        });
    }
}

function save() {

    let newTodoList = getTicketsByCategory("todo", "#todoUl > li");
    let newDoingList = getTicketsByCategory("doing", "#doingUl > li");
    let newDoneList = getTicketsByCategory("done", "#doneUl > li");

    arr.todo = newTodoList || [];
    arr.doing = newDoingList || [];
    arr.done = newDoneList || [];

    if (!jsonbin) {

        localStorage.setItem("data", JSON.stringify(arr));


    } else {


        $.ajax({
            url: 'https://api.jsonbin.io/b/' + bin,
            type: 'PUT',
            headers: {
                'secret-key': secret
            },
            contentType: 'application/json',
            data: JSON.stringify(arr),
            success: (data) => {
                // console.log(data);
            },
            error: (err) => {
                console.log(err.responseJSON);
            }
        });

    }

}

function getLocalstorage() {
    var secretStored = JSON.parse(localStorage.getItem("secret"));
    var binStored = JSON.parse(localStorage.getItem("bin"));

    if (secretStored == null || binStored == null || secretStored == "" || binStored == "") {
        jsonbin = false;
        return false;
    }

    jsonbin = true;

    secret = secretStored;
    bin = binStored;

    var dark = JSON.parse(localStorage.getItem("dark"));

    if (dark == null) {
        dark = false;
    }

    if (dark) {
        document.getElementById("container").className = "container dark";
        document.getElementById("dark").className = "button btn-round button-dark";
    }

    return true;

}

function darkmode() {
    var dark = false

    if (document.getElementById("container").className == "container") {
        dark = true
    }

    if (dark) {
        document.getElementById("container").className = "container dark";
        document.getElementById("dark").className = "button btn-round button-dark";
    } else {

        document.getElementById("container").className = "container";
        document.getElementById("dark").className = "button btn-round ";
    }

    localStorage.setItem("dark", JSON.stringify(dark));
}

function saveData(key, value) {
    var localstorage = JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(value));

    window.location.reload(false);
}

$(function () {

    getLocalstorage();
    load();
    setCounter();
});