"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../../styles/Home.module.css';
import lottieAnimation from '../../public/LoadingLottie.json'; 

interface LoadingOverlayProps {
  isLoading: boolean;
}

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <Lottie
        animationData={lottieAnimation}
				height={400}
				width={400}
			/>
    </div>
  );
};

export default LoadingOverlay;
