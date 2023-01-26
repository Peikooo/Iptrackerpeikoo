
let map = new Array()

const downloadButton = document.querySelector(".downloadButton")

downloadButton.addEventListener("click", () => {
    let jsonData = JSON.stringify(map);
    let file = new Blob([jsonData], { type: "application/json" });
    saveAs(file, "map.json");
})

const playButton = document.querySelector(".playButton")
let startPoint = null
let endPoint = null
const svgPath = document.querySelector(".svg")
const pathSvg = document.querySelector(".path")


    const mod = {
        red: document.querySelector(".red"),
        yellow: document.querySelector(".yellow"),
        green: document.querySelector(".green"),
        blue: document.querySelector(".blue")
    }
    let currentMod = "red"

    Object.values(mod).forEach((item) => {
        item.addEventListener("click", () => {
            currentMod = item.classList[0]
            item.classList.add("selectedMod")
            let othersItem = Object.keys(mod).filter(element => element != item.classList[0])
            othersItem.forEach((element) => {
                mod[element].classList.remove("selectedMod")
            })
        })
    })

function sliceMap(map, startPoint, endPoint) {
   let mMap = map
   mMap[parseInt(startPoint[0])][parseInt(startPoint[1])][0] = "S"
   mMap[parseInt(endPoint[0])][parseInt(endPoint[1])][0] = "E"
   let y = [parseInt(startPoint[0]), parseInt(endPoint[0])]
   let x = [parseInt(startPoint[1]), parseInt(endPoint[1])]
   y.sort((a, b) => a - b)
   x.sort((a, b) => a - b)
   if ((y[0] - 6) < 0) {
      y[0] = 0
   } else {
      y[0] = y[0] - 6
   }
   if ((y[1] + 6) > 325) {
      y[1] = 325
   } else {
      y[1] = y[1] + 6
   }
   if ((x[0] - 6) < 0) {
      x[0] = 0
   } else {
      x[0] = x[0] - 6
   }
   if ((x[1] + 6) > 293) {
      x[1] = 293
   } else {
      x[1] = x[1] + 6
   }
   mMap.slice(y[0], y[1])
   for (let row of mMap) {
      row.slice(x[0], x[1])
   }
   return mMap
}

function getQ(cur, pre, n=1) {
    const direction = {
        'right': [4, 0],
        'bottom': [0, 4],
        'left': [-4, 0],
        'top': [0, -4]
    }

    if (cur === pre) {
        return `l${direction[cur][0] * n} ${direction[cur][1] * n}`;
    }
    let arr = [0, 0];
    arr[direction[pre].indexOf(direction[pre].find(elem => elem !== 0))] = direction[pre][direction[pre].indexOf(direction[pre].find(elem => elem !== 0))];
    arr[direction[cur].indexOf(direction[cur].find(elem => elem !== 0))] = direction[cur][direction[cur].indexOf(direction[cur].find(elem => elem !== 0))];
    return `q${direction[pre][0]},${direction[pre][1]} ${arr.join(",")}`;
}

function drawPath(path, startPoint) {
   let svg = "";
   let start = [((parseInt(startPoint[0]) - 1) / 2), ((parseInt(startPoint[1]) - 1) / 2)]
   svg = `M${(start[1] * 41.7) + 21.35} ${(start[0] * 29.82) + 15.41}`
   for (let i = 0; i < path.length; i++) {
      if (typeof path[i] !== "string") {
         continue;
      } else {
         if (i !== 0) {
            svg += " " + getQ(path[i], path[i-1], 2);
         } else {
            svg += " " + getQ(path[i], path[i])
         }
         switch(path[i]) {
            case "right":
               svg += " l33.7 0";
               break;
            case "bottom":
               svg += " l0 21.82";
               break;
            case "left":
               svg += " l-31.7 0";
               break;
            case "top":
               svg += " l0 -21.82";
               break;
         }
         if (i === path.length - 1) {
            svg += " " + getQ(path[i], path[i])
         }
      }
   }
   return svg;
}


playButton.addEventListener("click", (e) => {
   if (e.target.classList.contains("disabled") == true) {
      return
   } else if (e.target.classList.contains("done") == true) {
       e.target.classList.add("disabled")
       e.target.classList.remove("done")
       const elementsToRemove = [document.querySelector(`.p${startPoint[0]}_${startPoint[1]}`), document.querySelector(`.p${endPoint[0]}_${endPoint[1]}`)]
       elementsToRemove.forEach((item) => item.setAttribute("id", ""))
       startPoint = null
       endPoint = null
       svgPath.classList.remove("active")
       pathSvg.setAttribute("d", "")
       return
   } else {
      let mMap = sliceMap(map, startPoint, endPoint)
      let path = findPath(mMap)
      if (path == null) {
          window.alert("Pas de chemin possible !")
          e.target.classList.add("done")
      }
      let svg = drawPath(path, startPoint)
      console.log(svg)
      pathSvg.setAttribute("d", svg)
      pathSvg.setAttribute("stroke-dasharray", pathSvg.getTotalLength())
      pathSvg.setAttribute("stroke-dashoffset", pathSvg.getTotalLength())
      console.log(pathSvg.getTotalLength())
      svgPath.classList.add("active")
      pathSvg.style.animationName = "draw"
      pathSvg.style.animationDuration = "5s"
      pathSvg.style.animationFillMode = "forwards"
      e.target.classList.add("done")
      return
   }
})

function verify() {
   if (typeof startPoint == "object" && typeof endPoint == "object") {
      playButton.classList.remove("disabled")
      return
   } else {
      playButton.classList.add("disabled")
      return
   }
}

function stringToArray(string) {
   const array = string.replace("p", "").split("_")
   return array
} 

function searchClass(list, string) {
   for (const classname of list) {
      const presence = classname.startsWith(string) 
      if (presence == true) {
         return classname
      } else {
         continue
      }
   }
}

function makeStart(element, cell) {
   if (startPoint == null) {
      
   } else {
      if (startPoint[0] == cell[0] && startPoint[1] == cell[1]) {
         element.setAttribute("id", "")
         startPoint = null
         return
      } else {
         const elementToRemove = document.querySelector(`.p${startPoint[0]}_${startPoint[1]}`)
         elementToRemove.setAttribute("id", "")
      }
   }
   element.setAttribute("id", "green")
   startPoint = cell
   if (startPoint[0] == endPoint[0] && startPoint[1] == endPoint[1]) {
      endPoint = null
   }
   verify()
}

function makeEnd(element, cell) {
   if (endPoint == null) {
      
   } else {
      if (endPoint[0] == cell[0] && endPoint[1] == cell[1]) {
         element.setAttribute("id", "")
         endPoint = null
         return
      } else {
         const elementToRemove = document.querySelector(`.p${endPoint[0]}_${endPoint[1]}`)
         elementToRemove.setAttribute("id", "")
      }
   }
   element.setAttribute("id", "blue")
   endPoint = cell
   if (endPoint[0] == startPoint[0] && endPoint[1] == startPoint[1]) {
      startPoint = null
   }
   verify()
}

function block(element, cell, effect) {
   element.classList.toggle("blocked")
   let character;
   if (effect == false) {
      character = "#"
   } else {
      character = " "
   }
   if (typeof map[cell[0]][cell[1]] == "object") {
      map[cell[0]][cell[1]][0] = character
   } else {
      map[cell[0]][cell[1]] = character
   }
}

function createPortal(element, cell, effect) {
   if (effect == false) {
      let portal;
      function createPrompt() {
         let portall = window.prompt('Entrez le nom et le nombre du portail. Ex: A: nom et 10: nombre --> "A10"', "A1")
         let arr = portall.replace(/ /g, "").split(/(\D+)/).filter(Boolean).map(function(elem) {
            return isNaN(elem) ? elem : parseInt(elem);
         });
         if (arr.length == 2 && typeof arr[0] == "string" && typeof arr[1] == "number") {
            portal = arr
            return
         } else {
            createPrompt()
         }
      }
      createPrompt() 
      element.classList.add("portal", "j" + portal[0] + portal[1])
      map[cell[0]][cell[1]][0] = ["P", portal]
   } else {
      element.classList.remove("portal", searchClass(element.classList))
      map[cell[0]][cell[1]][0] = " "
   }
}

function defineStatus(statuss) {
   let statu;
   if (typeof statuss == "object") {
      statu = statuss[0]   
   } else {
      statu = statuss
   }
   if (typeof statu == "object") {
      return ["portal", "j" + statu[1] + statu[2]]
   } else if (statu == "#") {
      console.log("blocked")
      return "blocked"
   } else if (statu == " ") {
      return ""
   }
}

function verifyId(element) {
   const id = element.getAttribute("id")
   if (id == "blue" || id == "green") {
      return true
   } else {
      return false
   }
}

function appendElement(element, x, y, status) {
    const body = document.querySelector("body")
    if (element == "vborder") {
       let evBorder = document.createElement("div")
       const statu = defineStatus(status)
       if (statu == "") {
          evBorder.classList.add("vborder", "p" + y + "_" + x)
       } else {
          evBorder.classList.add("vborder", "p" + y + "_" + x, statu)
       }
       evBorder.style.top = ((y / 2) * 29.82) + "px"
       evBorder.style.left = (((x - 1) / 2) * 41.7 + 2) + "px"
       evBorder.addEventListener("click", (e) => {
          const classElement = e.target.classList
          console.log(document.querySelector("." + e.target.classList[1]))
          const cell = stringToArray(searchClass(classElement, "p"))
          const blocked = classElement.contains("blocked")
          const portal = classElement.contains("portal")
          if (currentMod == "red" && portal == false) {
             block(e.target, cell, blocked)
          }
       })
       body.appendChild(evBorder)
       return
    } else if (element == "hborder") {
       let ehBorder = document.createElement("div")
       const statu = defineStatus(status)
       if (statu == "") {
          ehBorder.classList.add("hborder", "p" + y + "_" + x)
       } else {
          ehBorder.classList.add("hborder", "p" + y + "_" + x, statu)
       }
       ehBorder.style.top = ((((y - 1) / 2) * 29.82) + 2.5) + "px"
       ehBorder.style.left = ((x  / 2) * 41.7) + "px"
       ehBorder.addEventListener("click", (e) => {
          const classElement = e.target.classList
          console.log(e.target)
          const cell = stringToArray(searchClass(classElement, "p"))
          const blocked = classElement.contains("blocked")
          const portal = classElement.contains("portal")
          if (currentMod == "red" && portal == false) {
             block(e.target, cell, blocked)
          }
       })
       body.appendChild(ehBorder)
       return
    } else {
       let eMap = document.createElement("div")
       const statu = defineStatus(status)
       if (statu == "") {
          eMap.classList.add("map", "p" + y + "_" + x, "c" + (-94 + ((x + 1) / 2) - 1) + "_" + (-100 + ((y + 1) / 2) - 1))
       } else {
          eMap.classList.add("map", "p" + y + "_" + x, "c" + (-94 + ((x + 1) / 2) - 1) + "_" + (-100 + ((y + 1) / 2) - 1), statu)
       }
       eMap.style.top = ((((y - 1) / 2) * 29.82) + 3) + "px"
       eMap.style.left = ((((x - 1) / 2) * 41.7) + 3) + "px"
       eMap.addEventListener("click", (e) => {
          const classElement = e.target.classList
          console.log(e.target)
          const cell = stringToArray(searchClass(classElement, "p"))
          const blocked = classElement.contains("blocked")
          const portal = classElement.contains("portal")
          const point = verifyId(e.target)
          if (currentMod == "red" && portal == false && point == false) {
             block(e.target, cell, blocked)
          } else if (currentMod == "yellow" && blocked == false) {
             createPortal(e.target, cell, portal)
          } else if (currentMod == "green" && blocked == false) {
             makeStart(e.target, cell)
          } else if (currentMod == "blue" && blocked == false) {
             makeEnd(e.target, cell)
          }
       })
       body.appendChild(eMap)
       return
    }
}

function makeGrid(mapp) {
    for (let y = 0; y < 325; y++) {
       let cell = mapp[y];
       for (let x = 0; x < 293; x++) {
          let xcell = cell[x]
          if (y % 2 == 0) {
             if (x % 2 == 0) {
                continue
             } else {
                appendElement("vborder", x, y, xcell)
             }
          } else {
             if (x % 2 == 0) {
                appendElement("hborder", x, y, xcell)
             } else {
                appendElement("map", x, y, xcell)
             }
          }
       }
    }
}


let xhr = new XMLHttpRequest();
xhr.onload = () => {
   for (let y = 0; y < JSON.parse(xhr.response).length; y++) {
      map[y] = JSON.parse(xhr.response)[y]
   }
   makeGrid(map)
   console.log("a")
};
xhr.open("GET", "map.json");
xhr.send()



window.addEventListener("load", () => {
   document.querySelectorAll("body > *").forEach((item) => {
      item.style.visibility = "visible"
   })
})


