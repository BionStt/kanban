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

let phrases = ["Dispatching carrier pigeons", "ULTIMATE IS READY!", "Insert Coin to Continue", "spinning to win", "Entering cheat codes", "Rushing B", "Pressing random buttons", "Cheat Code Activated", "Resetting Run", "Removing pen from pineapple", "Caution: Contents Spicy", "Good News Everyone!", "Resurrecting dead memes", "Clicking circles (to the beat!)", "Building Lore", "We don't need a healer for this", "Wubba Lubba Dub Dub", "Scaling Bananas", "l o a d i n g a e s t h e t i c s", "Create the next Elon Musk company ", "Center the div in the page", "Buy a Tesla", "Develop a cheat code for life", "Switch sides", "Prepare final form", "Reset servers", "Learn PHP and then suicide", "Placeholders in 2018 LUL", "Get a girlfriend", "Get a boyfriend", "Just a punch by Saitama", "Spawn spiders in Minecraft"];


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
    writeone(arr.todo, todoList, obj)
}

/// load
function load() {

    $('#input').attr('placeholder', getRandomArray(phrases) + "...");

    if (!jsonbin) {
        arr = JSON.parse(localStorage.getItem("data"));

        if (arr != null) {
            write(arr.todo, todoList, true,false);
            write(arr.doing, doingList, true,false);
            write(arr.done, doneList, true,false);
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
                write(data.todo, todoList, true,false);
                write(data.doing, doingList, true,false);
                write(data.done, doneList, true,false);

                setCounter();
            },
            error: (err) => {
                console.log(err.responseJSON);
            }
        });
    }

    setInterval(() => {
        $('#input').attr('placeholder', getRandomArray(phrases) + "...");
    }, 2000);
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

    var dark = JSON.parse(localStorage.getItem("dark"));

    if (dark == null) {
        dark = false;
    }

    setDark(dark);

    var secretStored = JSON.parse(localStorage.getItem("secret"));
    var binStored = JSON.parse(localStorage.getItem("bin"));

    if (secretStored == null || binStored == null || secretStored == "" || binStored == "") {
        jsonbin = false;
        return false;
    }

    jsonbin = true;

    secret = secretStored;
    bin = binStored;


    return true;

}

function darkmode() {
    var dark = false

    if (document.getElementById("container").className == "container") {
        dark = true
    }

    setDark(dark);

    localStorage.setItem("dark", JSON.stringify(dark));
}

function saveData(key, value) {
    var localstorage = JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(value));

    window.location.reload(false);
}

getLocalstorage();

$(function () {
    load();
    setCounter();
});