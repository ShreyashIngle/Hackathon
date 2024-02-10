import React from 'react';
import { motion } from 'framer-motion';

const LogoFramer = ({ isOpen, isMobile }) => {
  const logotype = {
    hidden: {
      opacity: 0,
      transition: { ease: 'easeInOut', duration: 0.25 },
    },
    show: {
      opacity: 1,
      transition: { ease: 'easeInOut', delay: 0.1 },
    },
  };

  const cloud = {
    hidden: { x: '-75%', transition: { ease: 'easeInOut', delay: 0.05 } },
    show: { x: '0%', transition: { ease: 'easeInOut' } },
  };

  const rectStyle = {
    fill: isMobile ? '#f9fafc' : '#ffffff',
  };

  return (
    <div>
      
    </div>
  );
};

export default LogoFramer;

