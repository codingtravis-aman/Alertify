import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  animateType?: "pulse" | "bounce" | "scale" | "spin";
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  animateType = "scale",
  className,
  onClick,
  variant = "default",
  size = "default",
  type = "button",
  disabled = false,
  ...props
}: AnimatedButtonProps) {
  const animations = {
    pulse: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    bounce: {
      whileHover: { y: -3 },
      whileTap: { y: 2 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.92 },
      transition: { type: "spring", stiffness: 500, damping: 15 }
    },
    spin: {
      whileTap: { rotate: 5 },
      transition: { type: "spring", stiffness: 700, damping: 20 }
    }
  };

  const animation = animations[animateType];

  return (
    <motion.div
      className="inline-block"
      {...animation}
    >
      <Button
        className={cn(className)}
        onClick={onClick}
        variant={variant}
        size={size}
        type={type}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}