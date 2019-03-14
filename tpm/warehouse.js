var ctx, canvas
var game

const initCanvas = () => {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')

  let sizeCanvas = document.getElementsByClassName('game')

  ctx.canvas.width = sizeCanvas[0].clientWidth
  ctx.canvas.height = sizeCanvas[0].clientHeight

  // canvas.addEventListener('mousemove', mousemove)
  canvas.addEventListener('click', click)
}



const initGame = () => {
  game = new Game()

  loop()
}

let cpt = 0
const loop = () => {

  cpt++
  if(cpt%8 === 0) game.addEnnemi()

  game.updateTime()
  game.moveEnnemies()
  game.removeKilled()
  game.shootWorkers()

  game.updateInfos()
  dessin()
  requestAnimationFrame(loop);
}
var perso1 = new Image();
perso1.src = 'perso1.png';
class Game {
  constructor() {
    this.time = performance.now()
    this.previousTime = 0
    this.deltaTime = 0
    this.mouseAction = "attack"

    this.life = 0
    this.listEnnemi = []
    this.listWorkers = []

    this.clickDamage = 4
  }

  updateTime() {
    this.previousTime = this.time
    this.time = performance.now()
    this.deltaTime = this.time - this.previousTime
  }
  updateInfos() {
    let a = document.getElementById('nbEnnemi')
    a.innerHTML = "Number of Ennemies : " + this.listEnnemi.length
  }
  addEnnemi() {
    this.listEnnemi.push(new Ennemi)
  }
  moveEnnemies() {
    this.listEnnemi.forEach( e => e.move())
  }
  shootWorkers() {
    this.listWorkers.forEach( w => w.shootArrow())
  }
  removeKilled() {
    this.listEnnemi.forEach( (e, index) => {
      if ( e.life <= 0 ) this.listEnnemi.splice(index, 1)
    })
  }
}

class Ennemi {
  constructor() {
    this.life = 10
    this.maxLife = 10
    this.speed = 0.07
    this.size = 5
    this.x = this.size
    this.y = Math.random()*canvas.height
  }

  move() {
    this.x += this.speed*game.deltaTime
    if(this.x > canvas.width - 100) this.x = canvas.width - 100
  }
}

class Archer {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.damage = 0.1
  }

  shootArrow() {
    if (game.listEnnemi.length > 0){
      let target = this.closestEnnemi()
      target.life -= this.damage
    }

  }

  closestEnnemi() {
    let dstClosest = dst(game.listEnnemi[0].x, game.listEnnemi[0].y, this.x, this.y)
    let xe = game.listEnnemi[0].x
    let ye = game.listEnnemi[0].y
    let closest = game.listEnnemi[0]
    game.listEnnemi.forEach( e => {
      let distanceCurrent = dst(e.x, e.y, this.x, this.y)
      if (distanceCurrent < dstClosest) {
        dstClosest = distanceCurrent
        xe = e.x
        ye = e.y
        closest = e
      }
    })
    return closest
  }
}

const click = mouse => {
  if (game.mouseAction === "attack") {
    game.listEnnemi.forEach( (e, index, list) => {
      if( dst(e.x, e.y, mouse.offsetX, mouse.offsetY) < 2*e.size){
        e.life -= game.clickDamage
      }
    })
  }
  else if (game.mouseAction === "archer") {
    game.listWorkers.push(new Archer(mouse.offsetX, mouse.offsetY))
  }
}

var buttonArcher = document.getElementById("placeArcher")
buttonArcher.onclick = () => game.mouseAction = "archer"
document.onkeydown = key => {
  if (key.keyCode === 65) { // a
    if (game.mouseAction === "archer") {
      game.mouseAction = "attack"
      buttonArcher.style.opacity = 0.6
      buttonArcher.style.backgroundPosition = "left center"
    }
    else {
      game.mouseAction = "archer"
      buttonArcher.style.backgroundPosition = "right center"
      buttonArcher.style.opacity = 1
    }
  }
}

const dst = (x1, y1, x2, y2) => Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) )

const dessin = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Dessin limites bases
  ctx.strokeStyle = "#000000"
  ctx.beginPath()
  ctx.moveTo(canvas.width - 100, 0)
  ctx.lineTo(canvas.width - 100, canvas.height)
  ctx.stroke()


  game.listEnnemi.forEach( e => {
    // Dessin ennemi
    ctx.strokeStyle = "#000000"
    ctx.beginPath()
    ctx.arc(e.x, e.y, e.size, 0, 2 * Math.PI)
    ctx.stroke()

    // Dessin points de vie
    let percentLife = Math.floor(e.life/e.maxLife*10) // Car 10px de barre de vie
    ctx.beginPath()
    ctx.strokeStyle = "#FF0000"
    ctx.moveTo(e.x-5, e.y-8)
    ctx.lineTo(e.x-5+10-percentLife, e.y-8)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "#00FF00"
    ctx.moveTo(e.x-5+10-percentLife, e.y-8)
    ctx.lineTo(e.x+5, e.y-8)
    ctx.stroke()
  })

  // Dessin workers
  game.listWorkers.forEach( p => ctx.drawImage(perso1, p.x, p.y))
}



window.addEventListener('load', initCanvas)
window.addEventListener('load', initGame)
