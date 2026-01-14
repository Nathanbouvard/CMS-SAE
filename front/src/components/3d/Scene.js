import React, {Suspense, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls, Environment} from '@react-three/drei'
import {Model as Magasin} from './components/Magasin1'
import {Model as Neon} from './components/Neon'
import TshirtCustom from './TshirtController/TshirtCustom'
import RightMenu from './components/RightMenu'
import Collision from './components/Collision'
import CameraCollider from './components/CameraCollider'

export default function Scene() {
    const [brushColor, setBrushColor] = useState('#ff0000')
    const [tshirtSize, setTshirtSize] = useState('M')
    const [controlsEnabled, setControlsEnabled] = useState(true)
    const [activeSticker, setActiveSticker] = useState(null)
    const [stickerSize, setStickerSize] = useState(150)

    return (
        <div style={{position: 'relative', width: '100%', height: '80vh'}}>
            <RightMenu
                currentColor={brushColor}
                onColorChange={(color) => {
                    setBrushColor(color)
                    setActiveSticker(null)
                }}
                currentSize={tshirtSize}
                onSizeChange={setTshirtSize}
                activeSticker={activeSticker}
                onStickerSelect={setActiveSticker}
                stickerSize={stickerSize}
                onStickerSizeChange={setStickerSize}
            />
            <Canvas camera={{position: [5, 5, 5], fov: 50}}>
                <CameraCollider />
                <ambientLight intensity={0.5}/>
                <directionalLight position={[10, 10, 5]} intensity={0.5}/>

                <Suspense fallback={null}>
                    <Collision/>
                    <Magasin scale={1.4} position={[0.30, 0, 3]}/>
                    <Neon position={[-6.3, 5, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}/>
                    <TshirtCustom
                        position={[0, 1.5, 0]}
                        brushColor={brushColor}
                        size={tshirtSize}
                        setControlsEnabled={setControlsEnabled}
                        activeSticker={activeSticker}
                        stickerSize={stickerSize}
                    />
                    <Environment preset="city"/>
                </Suspense>

                <OrbitControls makeDefault target={[1, 3.5, 0]} enabled={controlsEnabled}/>
            </Canvas>
        </div>
    )
}
