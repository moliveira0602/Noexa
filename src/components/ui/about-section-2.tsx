"use client";

import { TimelineContent } from "./timeline-animation";
import { TrendingUp, Users, Globe, Award } from "lucide-react";
import { useRef } from "react";

export default function AboutSection2() {
  const heroRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.6,
      },
    }),
    hidden: {
      y: 30,
      opacity: 0,
      filter: "blur(10px)",
    },
  };

  const stats = [
    { icon: TrendingUp, value: "21+", label: "Years of Excellence" },
    { icon: Users, value: "80+", label: "Talented Engineers" },
    { icon: Globe, value: "14", label: "Nationalities" },
    { icon: Award, value: "200+", label: "Projects Delivered" },
  ];

  return (
    <div className="about-section-2" ref={heroRef}>
      <div className="about-section-2-inner">
        <TimelineContent
          as="h3"
          animationNum={0}
          timelineRef={heroRef}
          customVariants={revealVariants}
          className="about-section-2-title"
        >
          Engineering Excellence Since 2004
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={heroRef}
          customVariants={revealVariants}
          className="about-section-2-desc"
        >
          We transform complex challenges into elegant digital solutions. 
          Our team combines technical expertise with creative problem-solving 
          to deliver software that powers businesses across Europe and beyond.
        </TimelineContent>

        <div className="about-section-2-stats">
          {stats.map((stat, index) => (
            <TimelineContent
              key={stat.label}
              as="div"
              animationNum={2 + index}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="about-stat-item"
            >
              <div className="about-stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
            </TimelineContent>
          ))}
        </div>
      </div>
    </div>
  );
}
