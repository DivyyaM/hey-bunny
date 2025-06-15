"use client";
import React from 'react';
const heroImage = '/assets/hero-bunny.png';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Ripple from "../magicui/Ripple";
import SparklesText from "../magicui/SparklesText"
import BoxReveal from "../magicui/BoxReveal"
import {PulsatingButton} from "../magicui/PulsatingButton"

const HeroSection = () => {
  // Variants for the animations
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
  };

  return (
    <div>
      <div className="relative pt-40 pb-10 bg-black">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-10 py-8 xl:py-12">
          <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-shrink-0">
                <a
                  href="#"
                  title="BakerStreet"
                  className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-secondary focus:ring-primary"
                >
                  <h1 className="text-4xl text-white transition duration-300 transform hover:scale-105">
                    <SparklesText text="🐰Bunny" />
                  </h1>
                </a>
              </div>
              {/* Navigation Links */}
              <div className="hidden md:flex md:items-center md:space-x-10 lg:ml-28">
                <motion.a
                  href="#"
                  title="About"
                  className="font-sans text-base font-normal transition-all duration-200 rounded text-white focus:outline-none focus:ring-offset-secondary focus:ring-2 focus:ring-offset-1 focus:ring-primary hover:scale-105 hover:text-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  About Us
                </motion.a>
                <motion.a
                  href="/sign-up"
                  title="Sign Up"
                  className="inline-flex items-center justify-center px-5 py-2 font-sans text-base font-normal leading-7 transition-all duration-200 border-2 rounded-full text-white border-primary focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary hover:bg-white hover:text-black focus:ring-offset-secondary"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign Up
                </motion.a>
              </div>
            </div>
          </div>
        </header>
        {/* Main Section */}
        <div className="relative">
          <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
            <div className="grid items-center grid-cols-1 lg:grid-cols-2">
              {/* Text Section */}
              <div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={textVariants}
                >
                   <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <h1 className="font-sans text-base font-normal tracking-tight text-white text-opacity-70">
                      Master the social media
                    </h1>
                   </BoxReveal>
                   <BoxReveal boxColor={"#5046e6"} duration={1}>
                    <p className="mt-6 tracking-tighter text-white">
                      <span className="font-sans font-normal text-7xl">Hey, I'm </span>
                      <br />
                      <span className="font-serif italic font-normal text-8xl">Bunny..!</span>
                    </p>
                     </BoxReveal>
                  <BoxReveal boxColor={"#5046e6"} duration={1.5}> 
                    <p className="mt-12 font-sans text-base font-normal leading-7 text-white text-opacity-70">
                      I'm here to make your content creation and social media management easier than ever. ✨ With just one click, you can generate stunning posts 📸 and share them across all your platforms instantly. 🚀 Say goodbye to the hassle of juggling multiple accounts—let me do the hopping for you! 🌍💬
                    </p>
                  </BoxReveal>
                </motion.div>
              </div>
              {/* Hero Image for Desktop */}
              <div className="relative flex justify-center items-center">
                <motion.div
                  className="hidden lg:block relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={imageVariants}
                >
                  {/* The ripple effect is now positioned absolutely within this div */}
                  <div className="relative">
                    <Ripple className="absolute inset-0" />
                    <Image
                      src={heroImage}
                      alt="Bunny Hero Image"
                      className="relative z-10"
                      width={400}
                      height={400}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 