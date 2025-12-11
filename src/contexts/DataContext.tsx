import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  members: string[];
  status: "active" | "completed" | "archived";
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  focusHours: number;
  avatarInitials: string;
  avatarColor: string;
  avatarImage?: string;
}

export interface Activity {
  id: string;
  action: string;
  project: string;
  time: string;
  timestamp: number;
}

interface DataContextType {
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // User Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Activity
  activities: Activity[];
  addActivity: (action: string, project: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design",
    color: "bg-primary",
    members: ["AZ", "JD", "MK"],
    status: "active",
  },
  {
    id: "2",
    name: "Mobile App",
    description: "iOS and Android app development for customer portal",
    color: "bg-secondary",
    members: ["AZ", "SK"],
    status: "active",
  },
  {
    id: "3",
    name: "API Integration",
    description: "Third-party API integrations and documentation",
    color: "bg-green-500",
    members: ["JD", "MK", "AZ"],
    status: "completed",
  },
  {
    id: "4",
    name: "Marketing Campaign",
    description: "Q4 marketing campaign for product launch",
    color: "bg-purple-500",
    members: ["SK", "JD"],
    status: "active",
  },
];

const initialTasks: Task[] = [
  { id: "1", projectId: "1", title: "Design system setup", description: "Create tokens and components", status: "done", priority: "high", assignee: "AZ", dueDate: "2024-01-15" },
  { id: "2", projectId: "1", title: "Homepage layout", description: "Build responsive hero section", status: "done", priority: "high", assignee: "JD", dueDate: "2024-01-16" },
  { id: "3", projectId: "1", title: "API integration", description: "Connect to backend services", status: "progress", priority: "high", assignee: "AZ", dueDate: "2024-01-18" },
  { id: "4", projectId: "1", title: "User authentication", description: "Implement login/signup flow", status: "progress", priority: "medium", assignee: "MK", dueDate: "2024-01-19" },
  { id: "5", projectId: "1", title: "Dashboard widgets", description: "Create stats and charts", status: "review", priority: "medium", assignee: "AZ", dueDate: "2024-01-20" },
  { id: "6", projectId: "2", title: "Mobile responsive", description: "Test and fix mobile layout", status: "todo", priority: "low", assignee: "JD", dueDate: "2024-01-22" },
  { id: "7", projectId: "2", title: "Performance optimization", description: "Improve load times", status: "todo", priority: "medium", assignee: "AZ", dueDate: "2024-01-25" },
  { id: "8", projectId: "3", title: "API Documentation", description: "Write comprehensive API docs", status: "done", priority: "high", assignee: "MK", dueDate: "2024-01-10" },
];

const initialProfile: UserProfile = {
  name: "Ali Zewiany",
  email: "ali@taskhive.com",
  role: "Senior Developer",
  focusHours: 42,
  avatarInitials: "AZ",
  avatarColor: "bg-primary",
};

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", action: "Created new project", project: "Website Redesign", time: "2 min ago", timestamp: Date.now() - 120000 },
    { id: "2", action: "Completed task", project: "Mobile App", time: "15 min ago", timestamp: Date.now() - 900000 },
    { id: "3", action: "Added team member", project: "Marketing Campaign", time: "1 hour ago", timestamp: Date.now() - 3600000 },
  ]);

  const addActivity = (action: string, project: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      project,
      time: "Just now",
      timestamp: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
  };

  // Update activity times periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => prev.map(a => ({
        ...a,
        time: formatTimeAgo(a.timestamp)
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: Date.now().toString() };
    setProjects(prev => [newProject, ...prev]);
    addActivity("Created new project", newProject.name);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const project = projects.find(p => p.id === id);
    if (project) {
      addActivity("Updated project", project.name);
    }
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (project) {
      addActivity("Deleted project", project.name);
    }
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks(prev => [newTask, ...prev]);
    const project = projects.find(p => p.id === task.projectId);
    addActivity("Created new task", project?.name || "Unknown");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const task = tasks.find(t => t.id === id);
    const project = projects.find(p => p.id === task?.projectId);
    if (updates.status) {
      addActivity(`Moved task to ${updates.status}`, project?.name || "Unknown");
    } else {
      addActivity("Updated task", project?.name || "Unknown");
    }
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    const project = projects.find(p => p.id === task?.projectId);
    setTasks(prev => prev.filter(t => t.id !== id));
    addActivity("Deleted task", project?.name || "Unknown");
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    if (updates.name) {
      const initials = updates.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      setProfile(prev => ({ ...prev, avatarInitials: initials }));
    }
    addActivity("Updated profile", "Profile");
  };

  return (
    <DataContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      profile,
      updateProfile,
      activities,
      addActivity,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
