//API Endpoints

const CALC_API_ENDPOINT = "https://oc-api-server.cyclic.app/CalculatePath"
const NODE_API_ENDPOINT = "https://oc-api-server.cyclic.app/GetNodes"
const EDGES_API_ENDPOINT = "https://oc-api-server.cyclic.app/GetEdges"

//DOM Elements

let dropdownFrom = document.getElementById("dropdownFrom")
let dropdownTo = document.getElementById("dropdownTo")


//Global Variables

let nodes = document.querySelector("#Nodes")
let paths = document.querySelector("#Paths")
let Nodes = []
let Edges = []
var API_HEADERS = new Headers()
API_HEADERS.append("Content-Type", "application/json")

let resultPaths = []
//Fetch the global variables from the API

fetch(NODE_API_ENDPOINT, { method: "GET" }).then(res => res.json()).then(data => Nodes = data).catch(err => alert("Error Connecting With Server"))
fetch(EDGES_API_ENDPOINT, { method: "GET" }).then(res => res.json()).then(data => Edges = data).catch(err => alert("Error Connecting With Server"))

//DOM Manipulating Functions

function renderDropdowns() {
    for (i = 0; i < nodes.childElementCount; i++) {
        childname = nodes.children[i].id
        childname_ = childname.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
        dropdownFrom.innerHTML += `<option value="${childname}">${childname_}</option>`
        dropdownTo.innerHTML += `<option value="${childname}">${childname_}</option>`
    }
}

function renderPathSelecterDropdown() {
    document.getElementById("pathSelector").innerHTML = ""
    if (resultPaths.length > 0) {
        for (i = 0; i < resultPaths.length; i++) {
            document.getElementById("pathSelector").innerHTML += `<option value="${i}">${i + 1}</option>`
        }
    }
}

function visualizePath(pathVector, color) {
    for (i = 0; i < pathVector.length; i++) {
        ps = document.querySelectorAll(`#Paths #${pathVector[i]} #Arrow path`)
        if (ps) {
            for (k = 0; k < ps.length; k++) {
                ps[k].style.fill = color
                ps[k].style.stroke = color
            }
        }
        lines = document.querySelectorAll(`#Paths #${pathVector[i]} #Arrow line`)
        if (lines) {
            for (k = 0; k < lines.length; k++) {
                lines[k].style.stroke = color
            }
        }
    }
}

document.getElementById("pathSelector").addEventListener('change', () => {
    visualizePath(Edges, "black")
    pathNum = document.getElementById("pathSelector").value
    visualizePath(resultPaths[pathNum], "red")
})

document.getElementById("submit_btn").addEventListener("click", () => {
    if (dropdownFrom.value == dropdownTo.value) {
        alert(`Bro! Are you mad or what?? you already have ${dropdownFrom.value.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")} ... No conversion needed. :-)`)
    } else {
        resultPaths = []
        visualizePath(Paths, "black")
        fetch(CALC_API_ENDPOINT, { 
            method: "POST", 
            body: JSON.stringify({ from: dropdownFrom.value, to: dropdownTo.value }),
            headers : API_HEADERS
        })
            .then(res => res.json())
            .then(paths => {
                resultPaths = paths
                visualizePath(Edges,"black")
                renderPathSelecterDropdown()
                visualizePath(paths[0],"red")
            })
            .catch(err=>{
                alert("Error Occured While Trying To Connect To The Server")
            })
        
        if (resultPaths.length > 0) {
            visualizePath(resultPaths[0], "red")
        }
    }
})


dropdownFrom.innerHTML = ""
dropdownTo.innerHTML = ""
renderDropdowns()
renderPathSelecterDropdown()
