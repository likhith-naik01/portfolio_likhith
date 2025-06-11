"use client";

import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Ideation",
    date: "Phase 1",
    content: "Every great project starts with a powerful idea. I turn concepts into clear, goal-driven strategies.",
    category: "Ideation",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    emoji: "💡",
  },
  {
    id: 2,
    title: "Design & Architecture",
    date: "Phase 2",
    content: "Crafting both beauty and structure, inside and out. From UI/UX to secure, scalable tech blueprints.",
    category: "Design & Architecture",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    emoji: "🎨",
  },
  {
    id: 3,
    title: "Smart Development",
    date: "Phase 3",
    content: "Writing clean, intelligent, and efficient code. Bringing innovation to life across the full stack.",
    category: "Smart Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    emoji: "🚀",
  },
  {
    id: 4,
    title: "Optimization & Testing",
    date: "Phase 4",
    content: "Polishing performance, eliminating vulnerabilities. Every line of code is tested, tuned, and trusted.",
    category: "Optimization & Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    emoji: "⚡",
  },
  {
    id: 5,
    title: "Launch & Integration",
    date: "Phase 5",
    content: "Delivering products that are ready for the real world. On time. Secure. Fully integrated. Future-proof.",
    category: "Launch & Integration",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    emoji: "🎯",
  },
];

export function RadialOrbitalTimelineDemo() {
  return <RadialOrbitalTimeline timelineData={timelineData} />;
}