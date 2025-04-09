import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "default";

interface StatusBadgeProps {
  status: StatusType | string;
  text?: string;
  className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  let statusConfig = {
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    dotColor: "bg-gray-500",
    label: text || "Unknown",
  };

  // Map status to configuration
  switch (status.toLowerCase()) {
    case "success":
    case "operational":
      statusConfig = {
        bgColor: "bg-success-100",
        textColor: "text-success-800",
        dotColor: "bg-success-500",
        label: text || "Operational",
      };
      break;
    case "warning":
    case "performance issues":
      statusConfig = {
        bgColor: "bg-warning-100",
        textColor: "text-warning-800",
        dotColor: "bg-warning-500",
        label: text || "Performance Issues",
      };
      break;
    case "error":
    case "critical issues":
      statusConfig = {
        bgColor: "bg-danger-100",
        textColor: "text-danger-800",
        dotColor: "bg-danger-500",
        label: text || "Critical Issues",
      };
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusConfig.bgColor,
        statusConfig.textColor,
        className
      )}
    >
      <span className={`w-2 h-2 ${statusConfig.dotColor} rounded-full mr-1`}></span>
      {statusConfig.label}
    </span>
  );
}
