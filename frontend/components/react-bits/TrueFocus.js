"use client";
import React from 'react';
import { motion } from 'framer-motion';

const TrueFocus = ({ text }) => {
    const words = text.split(' ');

    return (
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
                    whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: [0.21, 0.45, 0.32, 0.9]
                    }}
                    viewport={{ once: true }}
                    className="text-step-2 font-display text-surface-light/80 hover:text-accent-highlight transition-colors duration-300"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
};

export default TrueFocus;
