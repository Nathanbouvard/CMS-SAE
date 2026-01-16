import React, {useRef, useState} from 'react'
import {useGLTF} from '@react-three/drei'
import * as THREE from 'three'

export default function TshirtCustom1({ customColor, sizeTshirt, ...props }) {
    const {nodes} = useGLTF('/models/tshirt.glb')
    const meshRef = useRef()

    return (
        <group {...props} dispose={null}>
            <mesh
                ref={meshRef}
                geometry={nodes['Comfortable_T-Shirt'].geometry}
                scale={sizeTshirt}
                rotation={[0, Math.PI / 2, 0]}
                position={[1, 2.5, 0]}
            >
                <meshStandardMaterial color={customColor} side={THREE.DoubleSide}/>
            </mesh>
        </group>
    )
}
