import React, {Suspense, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls, Environment, Loader} from '@react-three/drei'
import {Model as Magasin} from './components/Magasin1'
import {Model as Neon} from './components/Neon'
import TshirtCustom from './TshirtController/TshirtCustom'
import RightMenu from './components/RightMenu'
import Collision from './components/Collision'
import LightMag from './components/LightMag'
import CameraCollider from './components/CameraCollider'

export default function Scene() {
    const [colorTshirt, setColor] = useState('#ffffff')
    const [sizeTshirt, setSize] = useState(5)

    const [stickerFront, setStickerFront] = useState("/stickers/logo.svg");
    const [stickerBack, setStickerBack] = useState("/stickers/logo.svg");

    const [controlsEnabled] = useState(true)

    return (
        <div style={{position: 'relative', width: '100%', height: '80vh'}}>
            <RightMenu 
                setColor={setColor} 
                setSize={setSize} 
                setStickerBack={setStickerBack} 
                setStickerFront={setStickerFront} 
            />
            <Canvas camera={{position: [5, 5, 5], fov: 50}}>
                <CameraCollider />
                <ambientLight intensity={0.2}/>
                <directionalLight position={[10, 10, 5]} intensity={0.5}/>

                <Suspense fallback={null}>
                    <Collision/>
                    <LightMag/>
                    <Magasin scale={1.4} position={[0.30, 0, 3]}/>
                    <Neon position={[-6.3, 5, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}/>
                    <TshirtCustom customColor={colorTshirt} sizeTshirt={sizeTshirt} stickFront={stickerFront} stickBack={stickerBack} />
                    <Environment preset="city" environmentIntensity={0.2} />
                </Suspense>

                <OrbitControls makeDefault target={[1, 3.5, 0]} enabled={controlsEnabled}/>
            </Canvas>

            <Loader
                containerStyles={{ background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                innerStyles={{ backgroundColor: '#333333' , height: '5px', width: '100%', borderRadius: '5px' }}
                barStyles={{ height: '5px', width: '100%', borderRadius: '5px' }}
                dataStyles={{ color: 'white', fontSize: '1.2rem' }}
                dataInterpolation={(p) => `Chargement du magasin : ${p.toFixed(0)}%`}
            />
        </div>
    )
}
