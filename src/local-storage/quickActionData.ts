import { Href } from "expo-router";

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons";
  bgColor: string;
  iconColor: string;
  route: Href;
}

export const ACTIONS: QuickAction[] = [
  // --- PAGE 1 ---
  {
    id: "summary",
    title: "Summary",
    icon: "calendar-month",
    iconFamily: "MaterialCommunityIcons",
    bgColor: "#E0F2FE",
    iconColor: "#0284C7",
    route: "/(main)/screens/summary",
  },
  {
    id: "leaves",
    title: "Leave Center",
    icon: "airplane",
    iconFamily: "Ionicons",
    bgColor: "#FCE7F3",
    iconColor: "#DB2777",
    route: "/(main)/screens/leaves",
  },
  {
    id: "holidays",
    title: "Holidays",
    icon: "flag",
    iconFamily: "Ionicons",
    bgColor: "#F3E8FF",
    iconColor: "#9333EA",
    route: "/(main)/screens/holidays",
  },
  {
    id: "payslips",
    title: "Payslips",
    icon: "document-text",
    iconFamily: "Ionicons",
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
    route: "/(main)/screens/payslips",
  },
  // {
  //   id: "reimburse",
  //   title: "Expense",
  //   icon: "wallet-outline",
  //   iconFamily: "Ionicons",
  //   bgColor: "#F0FDF4",
  //   iconColor: "#16A34A",
  //   route: "/(main)/screens/reimburse",
  // },
  // {
  //   id: "announce",
  //   title: "Announce",
  //   icon: "megaphone-outline",
  //   iconFamily: "Ionicons",
  //   bgColor: "#E0E7FF",
  //   iconColor: "#4F46E5",
  //   route: "/(main)/screens/announce",
  // },
  // --- PAGE 2 ---
  {
    id: "directory",
    title: "Directory",
    icon: "people",
    iconFamily: "Ionicons",
    bgColor: "#DCFCE7",
    iconColor: "#16A34A",
    route: "/(main)/screens/directory",
  },
  {
    id: "gurukul",
    title: "Gurukul",
    icon: "school-outline",
    iconFamily: "Ionicons",
    bgColor: "#E0F2FE",
    iconColor: "#0284C7",
    route: "/(main)/screens/gurukul",
  },
  {
    id: "resignation",
    title: "Resignation",
    icon: "exit-outline", // Or "document-text-outline" if you prefer a form icon
    iconFamily: "Ionicons",
    bgColor: "#FFE4E6",   // Soft Rose background
    iconColor: "#E11D48", // Deep Red/Rose icon
    route: "/(main)/screens/resignation",
  },
  {
    id: "helpdesk",
    title: "Helpdesk",
    icon: "headset",
    iconFamily: "Ionicons",
    bgColor: "#F3F4F6",
    iconColor: "#4B5563",
    route: "/(main)/screens/helpdesk",
  },

  //   {
  //     id: "assets",
  //     title: "My Assets",
  //     icon: "laptop-mac",
  //     iconFamily: "MaterialCommunityIcons",
  //     bgColor: "#FAF5FF",
  //     iconColor: "#7C3AED",
  //     route: "/(main)/assets",
  //   },
  //   {
  //     id: "more",
  //     title: "More",
  //     icon: "grid-outline",
  //     iconFamily: "Ionicons",
  //     bgColor: "#F9FAFB",
  //     iconColor: "#6B7280",
  //     route: "/(main)/more",
  //   },
];
