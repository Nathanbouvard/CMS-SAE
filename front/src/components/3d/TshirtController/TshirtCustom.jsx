import React, {useRef, useState, useEffect} from 'react'
import {useGLTF, Decal} from '@react-three/drei'
import * as THREE from 'three'


const stickerPaths = [
    "/stickers/logo.svg",
    "/stickers/heart.svg",
    "/stickers/star.svg"
];

const loader = new THREE.TextureLoader();
stickerPaths.forEach(path => loader.load(path));

export default function TshirtCustom({customColor, sizeTshirt, stickFront, stickBack, ...props}) {
    const {nodes} = useGLTF('/models/tshirt.glb')
    const meshRef = useRef()

    const [frontTexture, setFrontTexture] = useState(null);
    const [backTexture, setBackTexture] = useState(null);

    useEffect(() => {
        new THREE.TextureLoader().load(stickFront, (tex) => {
            tex.anisotropy = 16;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.needsUpdate = true;
            setFrontTexture(tex);
        });
    }, [stickFront]);

    useEffect(() => {
        new THREE.TextureLoader().load(stickBack, (tex) => {
            tex.anisotropy = 16;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.needsUpdate = true;
            setBackTexture(tex);
        });
    }, [stickBack]);

    return (<group {...props} dispose={null}>
        <mesh
            ref={meshRef}
            geometry={nodes['Comfortable_T-Shirt'].geometry}
            scale={sizeTshirt}
            rotation={[0, Math.PI / 2, 0]}
            position={[1, 2.5, 0]}
        >
            <meshStandardMaterial color={customColor} side={THREE.DoubleSide}/>
            {/*Logo devant*/}
            {frontTexture && (
                <Decal
                    // debug // Makes "bounding box" of the decal visible
                    position={[0.06, 0.32, 0.05]} // Position of the decal
                    rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
                    scale={0.04} // Scale of the decal
                >
                    <meshBasicMaterial
                        map={frontTexture}
                        polygonOffset
                        polygonOffsetFactor={-1} // The material should take precedence over the original
                        transparent
                        toneMapped={false}
                    />
                </Decal>
            )}
            {/*Logo dans le dos*/}
            {backTexture && (
                <Decal
                    debug // Makes "bounding box" of the decal visible
                    position={[0, 0.29, -0.12]} // Position of the decal
                    rotation={[0, Math.PI / 1, 0]} // Rotation of the decal (can be a vector or a degree in radians)
                    scale={0.15} // Scale of the decal
                >
                    <meshBasicMaterial
                        map={backTexture}
                        polygonOffset
                        polygonOffsetFactor={-1} // The material should take precedence over the original
                        transparent
                        toneMapped={false}
                    />
                </Decal>
            )}
        </mesh>
    </group>)
}
