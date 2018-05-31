/// Drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    try {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");

        if (ev.target.innerHTML.substring(0, 3) == "<li")
            ev.target.appendChild(document.getElementById(data));
        else
            ev.target.children[2].appendChild(document.getElementById(data));

        setCounter();
        save();
    } catch (error) {}
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
}

/// remove using the button from the ticket
function remove(e) {
    let parentElement = document.getElementById(e.srcElement.getAttribute("removeid"));
    $("#" + parentElement.id).remove()
    save();
    setCounter();
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
    } else {
        document.getElementById("dark").className = "button";
        document.getElementById("chart").className = "button";
        document.getElementById("container").className = "container";
    }
}

function toggleChart(chart) {
    if (chart) {
        $("#kanban-board").addClass('media');
        document.getElementById("kanban-board").setAttribute("chart", true);
        $(".container .kanban-board .category ul").addClass('media');
        $(".container .kanban-board .category ul li").addClass('media');
    } else {
        $("#kanban-board").removeClass('media');
        document.getElementById("kanban-board").setAttribute("chart", false);
        $(".container .kanban-board .category ul").removeClass('media');
        $(".container .kanban-board .category ul li").removeClass('media');
    }
}

// function toggleChart(chart) {
//     if (chart) {
//         $("#kanban-board").css("flex-wrap", "wrap");
//         document.getElementById("kanban-board").setAttribute("chart", true);
//         $(".container .kanban-board .category").css("flex-basis", "100%");
//         $(".container.dark .kanban-board .category ul li").css("width", "30%");
//         $(".container.dark .kanban-board .category ul li").css("margin-left", "10px");
//         $(".container.dark .kanban-board .category ul").css("display", "flex");
//         $(".container.dark .kanban-board .category ul").css("flex-wrap", "wrap");
//         $(".container .kanban-board .category ul").css("display", "flex");
//         $(".container .kanban-board .category ul").css("flex-wrap", "wrap");
//         $(".container .kanban-board .category ul li").css("width", "30%");
//         $(".container .kanban-board .category ul li").css("margin-left", "10px");
//     } else {
//         $("#kanban-board").css("flex-wrap", "");
//         document.getElementById("kanban-board").setAttribute("chart", false);
//         $(".container .kanban-board .category").css("flex-basis", "");
//         $(".container.dark .kanban-board .category ul li").css("width", "100%");
//         $(".container.dark .kanban-board .category ul li").css("margin-left", "");
//         $(".container .kanban-board .category ul").css("display", "");
//         $(".container .kanban-board .category ul").css("flex-wrap", "");
//         $(".container .kanban-board .category ul li").css("width", "");
//         $(".container .kanban-board .category ul li").css("margin-left", "");
//     }
// }