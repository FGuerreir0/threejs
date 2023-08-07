import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color("#cdf0ff");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled=true
renderer.setSize(window.innerWidth, window.innerHeight)
//renderer.setClearColorHex( 0xffffff, 1 );
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

class Box extends THREE.Mesh {
  constructor({width, height, depth, color = '#ff0000', velocity = {x:0, y:0, z:0}, position = {x:0, y:0, z:0}, jumping = false}){
    super(
      new THREE.BoxGeometry(width, height, depth), 
      new THREE.MeshStandardMaterial({ color})
      )
      this.height = height
      this.width = width
      this.depth = depth
      
      this.position.set(position.x, position.y, position.z) 

      this.bottom = this.position.y - this.height/2
      this.top = this.position.y + this.height /2
      
      this.velocity = velocity
      this.gravity = -0.004

      this.jumping = jumping
  }
  update() {
    this.bottom = this.position.y - this.height/2
    this.top = this.position.y + this.height /2
    this.position.x += this.velocity.x
    this.position.z += this.velocity.z
    
  }

  applyGravity(group){
    this.velocity.y += this.gravity

    //When hit floor
    if(this.bottom + this.velocity.y <= group.top) {
      this.velocity.y *= 0.8
      this.velocity.y = -this.velocity.y
      this.jumping = false
    }else{
      this.position.y += this.velocity.y
      this.jumping= true
    }
  }
}

const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  velocity: {x:0, y:-0.01, z:0}
})
cube.castShadow = true
scene.add(cube)


const floor = new Box({
  width:5,
  height: 0.5,
  depth : 100,
  color: '#222021',
  position: {x:0, y:-2, z:0}
})
floor.receiveShadow=true
scene.add(floor)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.y = 3
light.position.x = 0
light.position.z = 2
light.castShadow = true
scene.add(light)

camera.position.z = 7

//console.log(cube.position.y - cube.height/2)
//console.log(floor.position.y + floor.height /2)
const actionKeys = {
  a:{
    pressed:false
  },  
  d:{
    pressed:false
  },  
  w:{
    pressed:false
  },  
  s:{
    pressed:false
  },  
  space:{
    pressed:false
  }
}

window.addEventListener('keypress', (event) =>{
  if (event.code == 'Space'){
    actionKeys.space.pressed = true
  }
})

window.addEventListener('keydown', (event) =>{
  switch(event.code){
    case 'KeyA':
      actionKeys.a.pressed = true
      break
    case 'KeyW':
      actionKeys.w.pressed = true
      break
    case 'KeyS':
      actionKeys.s.pressed = true
      break
    case 'KeyD':
      actionKeys.d.pressed = true
      break
    default:
      break
}
})

window.addEventListener('keyup', (event) =>{
  switch(event.code){
    case 'KeyA':
      actionKeys.a.pressed = false
      break
    case 'KeyW':
      actionKeys.w.pressed = false
      break
      case 'KeyS':
        actionKeys.s.pressed = false
        break
    case 'KeyD':
      actionKeys.d.pressed = false
      break
    default:
      break
}
})


function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  cube.update()
  cube.applyGravity(floor)

  cube.velocity.x = 0
  cube.velocity.z = 0

  if(actionKeys.a.pressed) cube.velocity.x = -0.03
  else if(actionKeys.d.pressed) cube.velocity.x = 0.03
  
  if(actionKeys.w.pressed) cube.velocity.z = -0.03
  else if(actionKeys.s.pressed) cube.velocity.z = 0.03

  if(actionKeys.space.pressed && !cube.jumping){
    cube.velocity.y = 0.07
    actionKeys.space.pressed = false
  }
}
animate()