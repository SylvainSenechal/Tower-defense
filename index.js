let world
const init = () => {
  world = new World()
}

// Planete qui grossit
class World {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 3000)
    this.camera.position.setZ(15)
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor("#f4e242")
    this.container = document.getElementsByClassName("game")[0]
    this.container.appendChild(this.renderer.domElement)
    this.light = new THREE.PointLight(0xffffff, 1, 100)
    this.light.position.setZ(10)

    this.scene.add(this.light)
    this.planets = []
    this.addPlanet()
    this.addPlanet()
    this.loop()
  }

  loop = () => {
    this.renderer.render(this.scene, this.camera)

    this.rotatePlanets()
    // this.rotateLight()
    requestAnimationFrame(this.loop)
  }

  addPlanet = () => {
    let geomPlanet = new THREE.SphereGeometry(2, 8, 8)
    let matPlanet = new THREE.MeshPhysicalMaterial({
  		color:0x58addd,
  		// transparent:true,
  		// opacity: 0.7,
  		vertexColors: THREE.FaceColors,
  		flatShading: true,

  		side: THREE.DoubleSide,
  		metalness: 0,
  		roughness: 0.5,
  		aoMapIntensity: 1,
  		reflectivity: 1,
  		clearCoat: 1,
  		clearCoatRoughness: 1,
  		premultipliedAlpha: true,
  		envMapIntensity: 5,
  		refractionRatio: 0.98,
      // emissive: 0x555555
  	})
    matPlanet = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

    let mesh = new THREE.Mesh(geomPlanet, matPlanet)
    mesh.position.setZ(-5)
    mesh.position.setX(  (-1 + 2*Math.random()) * 5)
    this.planets.push(mesh)
    this.scene.add(mesh)
  }

  rotatePlanets = () => this.planets.map( planet => planet.rotation.x += 0.00*Math.random())
  rotateLight = () => this.light.position.x += 0.05
}

document.addEventListener("DOMContentLoaded", init)
