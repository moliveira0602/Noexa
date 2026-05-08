"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode, type ElementType, type CSSProperties } from "react";

interface TimelineContentProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  href?: string;
  customVariants?: {
    visible: (i: number) => {
      y?: number;
      opacity: number;
      filter: string;
      transition: {
        delay: number;
        duration: number;
      };
    };
    hidden: {
      filter: string;
      y?: number;
      opacity: number;
    };
  };
}

export function TimelineContent({
  as: Component = "div",
  children,
  className = "",
  animationNum = 0,
  timelineRef: _timelineRef,
  customVariants,
  href,
}: TimelineContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Default variants if custom not provided
  const defaultVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };

  const variants = customVariants || defaultVariants;

  const style: CSSProperties = {
    display: Component === "span" || Component === "a" ? "inline" : "block",
  };

  // Use anchor element if href is provided
  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={className}
        style={style}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={animationNum}
        variants={variants}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
