import React from 'react'

export default function Collision() {
    return (
        <group>
            {/*sol*/}
            <mesh position={[0.55, 1.15, -1.3]} name="camera-collider">
                <boxGeometry args={[14, 0.1, 23]}/>
                <meshStandardMaterial/>
            </mesh>
            {/*plafond*/}
            <mesh position={[0.55, 8.70, -1.3]} name="camera-collider">
                <boxGeometry args={[14, 0.1, 23]}/>
                <meshStandardMaterial/>
            </mesh>
            {/*mur brique*/}
            <mesh position={[0.55, 5, 10.1]} rotation={[Math.PI / 2, 0, 0]} name="camera-collider">
                <boxGeometry args={[14, 0.1, 8]}/>
                <meshStandardMaterial/>
            </mesh>
            {/*mur vetement*/}
            <mesh position={[0.55, 5, -12.8]} rotation={[Math.PI / 2, 0, 0]} name="camera-collider">
                <boxGeometry args={[14, 0.1, 8]}/>
                <meshStandardMaterial/>
            </mesh>
            {/*mur neon*/}
            <mesh position={[-6.5, 5, -1.4]} rotation={[Math.PI / 2, 0, Math.PI / 2]} name="camera-collider">
                <boxGeometry args={[23, 0.1, 8]}/>
                <meshStandardMaterial/>
            </mesh>
            {/*mur porte*/}
            <mesh position={[7.8, 5, -1.4]} rotation={[Math.PI / 2, 0, Math.PI / 2]} name="camera-collider">
                <boxGeometry args={[23, 0.1, 8]}/>
                <meshStandardMaterial/>
            </mesh>
        </group>
    )
}