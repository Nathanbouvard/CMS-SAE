import React from 'react'

export default function LightMag() {
    return (
        <group>
            <mesh position={[-2, 8.5, 0]} >
                <boxGeometry args={[0.3, 0.1, 9]}/>
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>

            <mesh position={[3, 8.5, 0]}>
                <boxGeometry args={[0.3, 0.1, 9]}/>
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>

            <mesh position={[-2.9, 4.75, -10.6]}>
                <boxGeometry args={[0.3, 0.3, 0.3]}/>
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <pointLight position={[0.55, 4.8, -1.3]} intensity={5} distance={15} color="#ffffff" />
        </group>
    )
}