"use client";
import React, { useEffect, useRef } from 'react';

const Hyperspeed = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const stars = [];
        const starCount = 1000;
        let width, height;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const createStar = () => ({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * width,
            px: 0,
            py: 0
        });

        for (let i = 0; i < starCount; i++) {
            stars.push(createStar());
        }

        const draw = () => {
            ctx.fillStyle = '#0F172A';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#6366F1';
            ctx.lineWidth = 1.5;

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach(star => {
                star.z -= 10;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                const sx = (star.x / star.z) * width + cx;
                const sy = (star.y / star.z) * height + cy;

                if (star.px !== 0) {
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(star.px, star.py);
                    ctx.stroke();
                }

                star.px = sx;
                star.py = sy;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

export default Hyperspeed;
