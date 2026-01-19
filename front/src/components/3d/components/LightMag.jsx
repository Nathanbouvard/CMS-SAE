import React from 'react'

export default function LightMag() {
    return (
        <group>
            {/* Bar 1 */}
            <mesh position={[-2, 8.5, 0]} >
                <boxGeometry args={[0.3, 0.1, 6]}/>
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* lights Bar 1 */}
            <pointLight position={[-2, 8.4, -3]} intensity={3} distance={15} color="#ffffff" />
            <pointLight position={[-2, 8.4, 0]} intensity={3} distance={15} color="#ffffff" />
            <pointLight position={[-2, 8.4, 3]} intensity={3} distance={15} color="#ffffff" />

            {/* Bar 2 */}
            <mesh position={[3, 8.5, 0]}>
                <boxGeometry args={[0.3, 0.1, 6]}/>
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* lights Bar 2 */}
            <pointLight position={[3, 8.4, -3]} intensity={3} distance={15} color="#ffffff" />
            <pointLight position={[3, 8.4, 0]} intensity={3} distance={15} color="#ffffff" />
            <pointLight position={[3, 8.4, 3]} intensity={3} distance={15} color="#ffffff" />

            {/*lampe cuivre*/}
            <pointLight position={[-2.9, 4.75, -10.6]} intensity={5} distance={15} color="#ffffff" />
        </group>
    )
}
