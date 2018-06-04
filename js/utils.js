/// Drag and drop
function allowDrop(ev) {
    ev.preventDefault();

    /* events fired on the drop targets */
    document.addEventListener("dragover", function (event) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {

    /* events fired on the drop targets */
    document.addEventListener("dragover", function (event) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    try {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");

        if (ev.target.innerHTML.substring(0, 3) == "<li")
            ev.target.appendChild(document.getElementById(data));
        else
            ev.target.children[2].appendChild(document.getElementById(data));

        setCounter();
        save();

        scrollDivToBottom(ev.currentTarget.id);
    } catch (error) {}
}

/// scroll function
function scrollDivToBottom(id) {
    let height = parseInt($('#' + id + ' ul').height());

    height += '';

    $('#' + id + ' ul').animate({
        scrollTop: height + 1
    });
}

/// get list and set counters
function setCounter() {
    document.getElementById('todoCounter').innerHTML = document.getElementById('todoUl').children.length;
    document.getElementById('doingCounter').innerHTML = document.getElementById('doingUl').children.length;
    document.getElementById('doneCounter').innerHTML = document.getElementById('doneUl').children.length;
}

/// clear ul
function clear(element) {
    try {
        let myNode = element;
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    } catch (error) {}
}

/// get card element
function getCard(obj) {
    let li = document.createElement('li');
    li.innerHTML = obj.text + "<span class='btn-delete'  removeid='" + obj.id + "' onclick='remove(event)'></span>";
    li.setAttribute("draggable", true);
    li.setAttribute("ondragstart", "drag(event)");
    li.id = obj.id;
    return li;
}

/// write all cards
function write(category, list, fadein, isfirst) {
    clear(list);

    let counter = 0;
    let saveli;
    category.forEach(e => {
        let li = getCard(e);
        li.focus();
        li.className += "fade-in";
        list.appendChild(li);

        counter++;
    });

    setCounter();
}

/// write todo card 
function writeone(category, list, obj) {
    let li = getCard(obj);
    li.focus();
    li.className += "fade-in";
    list.appendChild(li);

    setCounter();

    scrollDivToBottom("todo");
}

/// remove using the button from the ticket
function remove(e) {
    let parentElement;

    try {
        /// Chrome and supported 
        parentElement = document.getElementById(e.srcElement.getAttribute("removeid"));
    } catch (error) {
        /// Fix for firefox, there is no srcElement
        parentElement = document.getElementById(e.currentTarget.getAttribute("removeid"));
    }

    $("#" + parentElement.id).addClass("fade-out");

    setTimeout(() => {
        $("#" + parentElement.id).remove();
        save();
        setCounter();
    }, 500);
}

/// Get random id
function getRandomId() {
    return Math.random().toString(36).substring(7);
}

/// gets all the tickets in object form by the category type and jquerypath
function getTicketsByCategory(categoryName, jqueryPath) {
    let returnList = [];
    let curentList = document.querySelectorAll(jqueryPath);

    curentList.forEach(element => {
        let obj = {
            text: element.innerText,
            category: categoryName,
            id: element.id
        }
        returnList.push(obj);
    });

    return returnList;
}

/// returns random id
function getRandomArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/// toggles dark mode
function setDark(dark) {
    if (dark) {
        document.getElementById("dark").className = "button button-dark";
        document.getElementById("chart").className = "button button-dark";
        document.getElementById("container").className = "container dark";

        /// progress bar
        $(".pace .pace-progress").css("background", "#FFFFFF")

        /// Stuff for the header in chrome/firefox/edge
        $('head').append('<meta name="theme-color" content="#292c2f">');

    } else {
        document.getElementById("dark").className = "button";
        document.getElementById("chart").className = "button";
        document.getElementById("container").className = "container";

        /// progress bar
        $(".pace .pace-progress").css("background", "#000000")

        /// Stuff for the header in chrome/firefox/edge
        $('head').append('<meta name="theme-color" content="white">');
    }
}

function toggleChart(chart) {
    if (chart) {
        $("#kanban-board").addClass('media');
        document.getElementById("kanban-board").setAttribute("chart", true);
        $(".container .kanban-board .category ul").addClass('media');
        $(".container .kanban-board .category ul li").addClass('media');
        $(".container.dark .kanban-board .category ul").addClass('media');
        $(".container.dark .kanban-board .category ul li").addClass('media');
    } else {
        $("#kanban-board").removeClass('media');
        document.getElementById("kanban-board").setAttribute("chart", false);
        $(".container .kanban-board .category ul").removeClass('media');
        $(".container .kanban-board .category ul li").removeClass('media');
        $(".container.dark .kanban-board .category ul").removeClass('media');
        $(".container.dark .kanban-board .category ul li").removeClass('media');
    }
}

/// set chart mode
function setChart() {
    toggleChart(JSON.parse(localStorage.getItem("chart")) || false);
}

function loadPace(dark) {
    Pace.restart();

    if (dark) {
        $(".pace .pace-progress").css("background", "#FFFFFF")
    } else {
        $(".pace .pace-progress").css("background", "#000000")
    }
}