"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

// This component loads and displays the 3D model
function Model(props: any) {
  const group = useRef();
  const { scene, animations } = useGLTF('/libro_arcano_animado.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const animationName = Object.keys(actions)[0];
    if (animationName) {
      actions[animationName]?.play();
    }
  }, [actions]);

  return <primitive object={scene} ref={group} {...props} />;
}

// This is the main component that sets up the 3D scene
export default function ArcaneBook() {
  return (
    <div className='w-full h-full'>
      <Canvas 
        // CHANGE 1: Adjusted camera position for a better view of the larger model.
        // Pulled it back on the Z-axis and centered it vertically.
        camera={{ position: [0, 0, 12], fov: 50 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[30.3, 1.0, 4.4]} intensity={4} />
          
          {/* CHANGE 2: Increased scale and centered the model at the origin. */}
          {/* The model is now bigger and positioned at [0, y, 0] to be the scene's center. */}
          <Model scale={4} position={[-0, -4.5, 0]} />

          <OrbitControls 
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.5}
            // CHANGE 3: Set the rotation target to the model's position.
            // This ensures the camera revolves around the model itself, not the world's center.
            target={[0, -1.5, 0]} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/libro_arcano_animado.glb');