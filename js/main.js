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

let inputInterval = null;

let phrases = ["Dispatching carrier pigeons", "ULTIMATE IS READY!", "Insert Coin to Continue", "spinning to win", "Entering cheat codes", "Rushing B", "Pressing random buttons", "Cheat Code Activated", "Resetting Run", "Removing pen from pineapple", "Caution: Contents Spicy", "Good News Everyone!", "Resurrecting dead memes", "Clicking circles (to the beat!)", "Building Lore", "We don't need a healer for this", "Wubba Lubba Dub Dub", "Scaling Bananas", "l o a d i n g a e s t h e t i c s", "Create the next Elon Musk company ", "Center the div in the page", "Buy a Tesla", "Develop a cheat code for life", "Switch sides", "Prepare final form", "Reset servers", "Learn PHP and then suicide", "Placeholders in 2018 LUL", "Get a girlfriend", "Get a boyfriend", "Just a punch by Saitama", "Spawn spiders in Minecraft"];

var dark = null;

/// press enter on input to add
input.addEventListener("keyup", function (event) {
    event.preventDefault();

    let value = document.getElementById("input").value;
    if (event.keyCode === 13) {
        $("#input").blur();
        if (value.indexOf("set secret: ") != -1) {
            secret = value.replace("set secret: ", "");
            saveData("secret", secret);
            return false;
        }

        if (value.indexOf("set bin: ") != -1) {
            bin = value.replace("set bin: ", "");
            saveData("bin", bin);
            return false;
        }

        if (value.indexOf("delete settings") != -1) {
            localStorage.removeItem("secret");
            localStorage.removeItem("bin");

            /// Clear value
            $('#input').val("");

            /// Stop interval
            clearInterval(inputInterval);

            /// Some info
            changeInput("Successfully cleared internal storage, refresing in 3 seconds!", "rgba(0,255,0,0.5)");

            /// Refresh
            setTimeout(() => {
                window.location.reload(false);
            }, 3000);

            return false;
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

    setChart();
}

/// load
function load() {
    changeInput("Loading kanban...", null);

    if (!jsonbin) {
        arr = JSON.parse(localStorage.getItem("data"));

        if (arr != null) {
            write(arr.todo, todoList, true, false);
            write(arr.doing, doingList, true, false);
            write(arr.done, doneList, true, false);
            changeInput("Successfully loaded from internal storage!", "rgba(0,255,0,0.5)");

        } else {
            arr = {
                todo: [],
                doing: [],
                done: []
            }
            changeInput("No data found on internal storage!", "rgba(255,255,0,0.5)");
        }

        setCounter();
        setChart();
        $("kanban-board").css("display", "flex");
    } else {
        loadJSONbin();

        setInterval(() => {
            loadPace(dark);
            loadJSONbin();
        }, 60000);
    }

    inputInterval = setInterval(() => {
        changeInput(null, null);
    }, 2000);
}

function loadJSONbin() {
    $.ajax({
        url: 'https://api.jsonbin.io/b/' + bin + '/latest',
        type: 'GET',
        headers: {
            'secret-key': secret
        },
        success: (data) => {
            if (data == null || data == []) {
                changeInput("No data found on JSONbin!", "rgba(255,255,0,0.5)");
                return false;
            }

            try {
                write(data.todo, todoList, true, false);
                write(data.doing, doingList, true, false);
                write(data.done, doneList, true, false);
                changeInput("Successfully loaded JSONbin!", "rgba(0,255,0,0.5)");

            } catch (error) {}

            setCounter();
            setChart();
        },
        error: (err) => {
            changeInput("Error loading JSONbin!", "rgba(255,0,0,0.5)");
        }
    });
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
        changeInput("Successfully saved to internal storage!", "rgba(0,255,0,0.5)");
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
                changeInput("Successfully saved to JSONbin!", "rgba(0,255,0,0.5)");
                // console.log(data);
            },
            error: (err) => {
                changeInput("Error saving to JSONbin!", "rgba(255,0,0,0.5)");
                // console.log(err.responseJSON);
            }
        });
    }
}

/// get data from localstorage
function getLocalstorage() {
    dark = JSON.parse(localStorage.getItem("dark")) || false;

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

/// set dark mode
function darkmode() {
    let dark = document.getElementById("container").className == "container" ? true : false;

    setDark(dark);

    localStorage.setItem("dark", JSON.stringify(dark));
}

/// set chart mode
function chartmode() {
    var kanbanchart = document.getElementById("kanban-board").getAttribute("chart") == "true" ? true : false;

    toggleChart(!kanbanchart);

    localStorage.setItem("chart", JSON.stringify(!kanbanchart));
}

/// save data in localstorage
function saveData(key, value) {
    var localstorage = JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(value));

    /// Clear value
    $('#input').val("");

    /// Stop interval
    clearInterval(inputInterval);

    /// Some info
    changeInput("Successfully saved " + key + " on the internal storage, refresing in 3 seconds!", "rgba(0,255,0,0.5)");

    /// Refresh
    setTimeout(() => {
        window.location.reload(false);
    }, 3000);
}

/// Get localstorage before jquery
getLocalstorage();

$(function () {
    /// localstorage is loaded, load stuff now
    load();

    /// Trying to fix the drag an drop in safari
    document.getElementsByTagName('body')[0].addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // alert("DragOver");
    }, false);
});