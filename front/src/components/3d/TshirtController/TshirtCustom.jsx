import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export default function TshirtCustom({ brushColor, size = 'M', setControlsEnabled, activeSticker, stickerSize = 150, ...props }) {
  const { nodes } = useGLTF('/models/tshirt.glb')
  const meshRef = useRef()
  const [texture, setTexture] = useState(null)
  const canvasRef = useRef(document.createElement('canvas'))
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const getScale = () => {
    switch(size) {
      case 'S': return 3.4
      case 'L': return 4.2
      default: return 3.788 // M
    }
  }

  // Initialize canvas and texture
  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    
    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const tex = new THREE.CanvasTexture(canvas)
    tex.flipY = false // GLTF UVs are usually flipped
    tex.colorSpace = THREE.SRGBColorSpace // Modern color management
    setTexture(tex)
  }, [])

  const getCanvasCoordinates = (uv) => {
    const canvas = canvasRef.current
    return {
        x: uv.x * canvas.width,
        y: uv.y * canvas.height
    }
  }

  const draw = (uv) => {
    if (!uv || !texture) return
    // Don't draw lines if sticker mode is active
    if (activeSticker) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getCanvasCoordinates(uv)

    ctx.beginPath()
    ctx.strokeStyle = brushColor
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // If we are starting a new line, start exactly at current point
    if (lastPos.x === -1) {
        ctx.moveTo(x, y)
    } else {
        ctx.moveTo(lastPos.x, lastPos.y)
    }
    
    ctx.lineTo(x, y)
    ctx.stroke()
    
    setLastPos({ x, y })
    texture.needsUpdate = true
  }

  const handlePointerDown = (e) => {
    e.stopPropagation() 
    if (setControlsEnabled) setControlsEnabled(false)
    
    // Sticker Mode
    if (activeSticker && e.uv) {
        const { x, y } = getCanvasCoordinates(e.uv)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        const img = new Image()
        img.src = activeSticker
        img.onload = () => {
            // Draw sticker centered on click using stickerSize prop
            const s = stickerSize 
            ctx.drawImage(img, x - s/2, y - s/2, s, s)
            texture.needsUpdate = true
        }
        return // Exit, don't start drawing lines
    }

    setIsDrawing(true)
    if (e.uv) {
        const { x, y } = getCanvasCoordinates(e.uv)
        setLastPos({ x, y }) // Set initial position
        
        // Draw a dot immediately
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.beginPath()
        ctx.fillStyle = brushColor
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
        texture.needsUpdate = true
    } else {
        setLastPos({ x: -1, y: -1 })
    }
  }

  const handlePointerMove = (e) => {
    if (isDrawing && e.uv) {
      draw(e.uv)
    }
  }

  const handlePointerUp = (e) => {
    if (setControlsEnabled) setControlsEnabled(true)
    setIsDrawing(false)
    setLastPos({ x: -1, y: -1 }) // Reset
  }

  return (
    <group {...props} dispose={null}>
      <mesh 
        ref={meshRef}
        geometry={nodes['Comfortable_T-Shirt'].geometry} 
        scale={getScale()}
        rotation={[0, Math.PI / 2, 0]}
        position={[1, 1, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {texture && <meshStandardMaterial map={texture} side={THREE.DoubleSide} />}
      </mesh>
    </group>
  )
}