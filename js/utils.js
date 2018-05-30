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
function write(category, list) {
    clear(list);

    category.forEach(e => {
        list.appendChild(getCard(e));
    });

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
        
        document.getElementById("container").className = "container dark";
    } else {
        document.getElementById("dark").className = "button";
        
        document.getElementById("container").className = "container";
    }
}