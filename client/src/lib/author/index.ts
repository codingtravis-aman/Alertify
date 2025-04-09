/**
 * Alertify Application
 * 
 * Developed by Aman
 * This state-of-the-art monitoring application provides real-time alerts and analytics
 * for website and application monitoring.
 * 
 * © 2025 Aman - All Rights Reserved
 */

export const AUTHOR = {
  name: "Aman",
  role: "Full Stack Developer",
  github: "https://github.com/codingtravis-aman",
  twitter: "https://x.com/codingtravis_",
  website: "https://alertify.app",
  project: "Alertify - Intelligent Monitoring Platform"
};

export const PROJECT_INFO = {
  name: "Alertify",
  version: "1.0.0",
  description: "An intelligent monitoring platform that provides real-time alerts for websites and applications",
  features: [
    "Real-time monitoring and alerts",
    "Comprehensive dashboard with analytics",
    "AI-powered insights and recommendations",
    "Team collaboration with role-based notification routing",
    "Integration with popular notification services",
    "Self-healing capabilities for supported platforms"
  ],
  stack: [
    "React.js",
    "TypeScript", 
    "Node.js",
    "Express",
    "Tailwind CSS",
    "Shadcn UI",
    "Framer Motion"
  ],
  deployment: "Vercel"
};

/**
 * Get author attribution string for UI display
 */
export function getAttribution(): string {
  return `Developed by ${AUTHOR.name} | © ${new Date().getFullYear()}`;
}

/**
 * Get information for the About page
 */
export function getAboutInfo() {
  return {
    ...PROJECT_INFO,
    author: AUTHOR,
    copyright: `© ${new Date().getFullYear()} ${AUTHOR.name} - All Rights Reserved`
  };
}