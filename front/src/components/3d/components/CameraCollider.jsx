import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraCollider() {
  const { scene, camera, controls } = useThree()
  const raycaster = new THREE.Raycaster()
  const dir = new THREE.Vector3()
  const offset = 0.5 // Keep camera slightly away from wall

  useFrame(() => {
    // Only work if OrbitControls are active and available via makeDefault
    if (!controls) return

    const target = controls.target
    const camPos = camera.position
    
    // Direction from target to camera
    dir.subVectors(camPos, target).normalize()
    
    // Set ray from target towards camera
    raycaster.set(target, dir)
    
    // Find colliders
    const colliders = []
    scene.traverse((object) => {
      if (object.name === 'camera-collider') {
        colliders.push(object)
      }
    })

    if (colliders.length === 0) return

    // Check intersection strictly up to the current camera distance
    const currentDist = camPos.distanceTo(target)
    
    const intersects = raycaster.intersectObjects(colliders)
    
    if (intersects.length > 0) {
      const hit = intersects[0]
      if (hit.distance < currentDist) {
        camera.position.copy(hit.point).addScaledVector(dir, -offset)
      }
    }
  })

  return null
}
