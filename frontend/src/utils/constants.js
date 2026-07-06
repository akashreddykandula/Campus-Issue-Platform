/**
 * constants.js
 * ------------
 * Shared enum values for dropdowns, badges, and validation.
 * Must stay in sync with backend/app/utils/constants.py.
 */

export const CATEGORIES = [
  "Electrical",
  "Water Supply",
  "Internet",
  "Hostel",
  "Classroom",
  "Furniture",
  "Medical",
  "Security",
  "Laboratory",
  "Library",
  "Transport",
  "Cleanliness",
  "Others",
];

export const PREDEFINED_LOCATIONS = [
  "Academic Block A",
  "Academic Block B",
  "Academic Block C",
  "Diploma Block",
  "Library",
  "Computer Lab",
  "Electronics Lab",
  "Mechanical Lab",
  "Civil Lab",
  "Hostel Block A",
  "Hostel Block B",
  "Hostel Block C",
  "Boys Hostel",
  "Girls Hostel",
  "Parking",
  "Ground",
  "Canteen",
  "Main Gate",
  "Others",
];

export const COURSES = ["B.Tech", "Diploma"];

export const BRANCHES = {
  "B.Tech": [
    "CSE",
    "CSE AI & ML",
    "CSE Data Science",
    "Information Technology",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "MBA",
    "MCA",
    "Others",
  ],
  Diploma: [
    "Computer Engineering",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Automobile",
    "Others",
  ],
};

export const YEARS = {
  "B.Tech": ["1st", "2nd", "3rd", "4th"],
  Diploma: ["1st", "2nd", "3rd"],
};

export const STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
  "Escalated",
];

export const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];

// Tailwind class maps for badges
export const PRIORITY_COLORS = {
  Low:      "bg-green-100  text-green-800  dark:bg-green-900  dark:text-green-200",
  Medium:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  High:     "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Critical: "bg-red-100    text-red-800    dark:bg-red-900    dark:text-red-200",
};

export const STATUS_COLORS = {
  Pending:     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "In Progress":"bg-blue-100   text-blue-800   dark:bg-blue-900   dark:text-blue-200",
  Resolved:    "bg-green-100  text-green-800  dark:bg-green-900  dark:text-green-200",
  Rejected:    "bg-red-100    text-red-800    dark:bg-red-900    dark:text-red-200",
  Escalated:   "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};
