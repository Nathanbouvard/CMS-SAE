import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'

const raycaster = new THREE.Raycaster()
const dir = new THREE.Vector3()

export default function CameraCollider() {
  const { scene, camera, controls } = useThree()

  // On récupère les murs une seule fois ou quand la scène change, c'est plus simple et plus performant
  const colliders = useMemo(() => {
    const list = []
    scene.traverse((obj) => { if (obj.name === 'camera-collider') list.push(obj) })
    return list
  }, [scene])

  useFrame(() => {
    if (!controls || colliders.length === 0) return

    const target = controls.target
    const camPos = camera.position
    
    // Direction de la cible vers la caméra
    dir.subVectors(camPos, target).normalize()
    raycaster.set(target, dir)
    
    const intersects = raycaster.intersectObjects(colliders)
    
    if (intersects.length > 0) {
      const hit = intersects[0]
      // Si un mur est plus proche que la caméra, on recule la caméra au point d'impact
      if (hit.distance < camPos.distanceTo(target)) {
        camera.position.copy(hit.point).addScaledVector(dir, -0.2)
        controls.update()
      }
    }
  })

  return null
}