import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import ProfileCard from './ProfileCard'

interface Computer3DProps {
  showGrayCard?: boolean;
}

function TopRingModel({ showGrayCard }: Computer3DProps) {
  const { scene } = useGLTF('/Top_Ring.glb')
  const meshRef = useRef<THREE.Group>(null)
  const cardRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation animation for the ring
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    
    if (cardRef.current) {
      // Floating animation for the card
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1 + 1.5
    }
  })

  return (
    <>
      {/* Top Ring Model */}
      <group ref={meshRef}>
        <primitive object={scene} scale={1.6} position={[0, -0.3, 0]} />
      </group>
      
      {/* Profile Card floating above the ring */}
      <group ref={cardRef}>
        <Html
          transform
          distanceFactor={1}
          position={[0, 1.5, 0]}
          rotation={[0, 0, 0]}
          style={{
            width: '320px',
            transition: 'all 1s ease-out',
            pointerEvents: 'auto'
          }}
        >
          <div className="transform scale-[0.85] hover:scale-[0.9] transition-transform duration-300">
            {!showGrayCard ? (
              <ProfileCard
                name="Carl Condrad"
                title="UI/UX Designer"
                handle="carlcondrad"
                status="Available for work"
                contactText="Contact Me"
                avatarUrl="/main.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                behindGlowEnabled={true}
                onContactClick={() => console.log('Contact clicked')}
              />
            ) : (
              <ProfileCard
                name="Carl Condrad"
                title="Front-End Developer"
                handle="carlcondrad"
                status="Open to opportunities"
                contactText="Get in Touch"
                avatarUrl=""
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                behindGlowColor="rgba(150, 150, 150, 0.5)"
                behindGlowEnabled={true}
                innerGradient="linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 100%)"
                onContactClick={() => console.log('Contact clicked 2')}
              />
            )}
          </div>
        </Html>
      </group>
    </>
  )
}

export default function Computer3D({ showGrayCard = false }: Computer3DProps) {
  return (
    <div className="w-full h-[700px] lg:h-[750px]">
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 55 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#4a9eff" />
        
        <TopRingModel showGrayCard={showGrayCard} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
}
