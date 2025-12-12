import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase"; // تأكد إن المسار ده صح

// --- Interfaces ---
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
  project: string; // اسم المشروع
  time: string;
  timestamp: number;
}

interface DataContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  activities: Activity[];
  addActivity: (action: string, project: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// دالة مساعدة لحساب الوقت
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // بروفايل مبدئي مؤقتاً
  const [profile, setProfile] = useState<UserProfile>({
    name: "Ali Zewiany",
    email: "ali@taskhive.com",
    role: "Senior Developer",
    focusHours: 0,
    avatarInitials: "AZ",
    avatarColor: "bg-primary",
  });

  // --- 1. Fetch Data (تحميل البيانات عند فتح الموقع) ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Get Projects
      const { data: projectsData, error: projError } = await supabase.from('projects').select('*');
      if (projError) throw projError;
      
      // تحويل شكل الداتا من Supabase لشكل الكود بتاعنا
      if (projectsData) {
        const formattedProjects: Project[] = projectsData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: 'active', // قيمة افتراضية لو مش موجودة
          color: 'bg-primary', // قيمة افتراضية
          members: [] // قيمة افتراضية
        }));
        setProjects(formattedProjects);
      }

      // 2. Get Tasks
      const { data: tasksData, error: taskError } = await supabase.from('tasks').select('*');
      if (taskError) throw taskError;

      if (tasksData) {
        const formattedTasks: Task[] = tasksData.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          dueDate: t.due_date, // لاحظ التحويل هنا: due_date -> dueDate
          projectId: t.project_id, // لاحظ التحويل هنا: project_id -> projectId
          assignee: 'AZ' // مؤقتاً
        }));
        setTasks(formattedTasks);
      }

      // 3. Get Activities
      const { data: actData } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(10);
      if (actData) {
        const formattedActivities: Activity[] = actData.map(a => ({
          id: a.id,
          action: a.action,
          project: a.details || 'System',
          time: formatTimeAgo(new Date(a.created_at).getTime()),
          timestamp: new Date(a.created_at).getTime()
        }));
        setActivities(formattedActivities);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Activity Helper ---
  const addActivity = async (action: string, details: string) => {
    // تحديث الواجهة فوراً
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      project: details,
      time: "Just now",
      timestamp: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]);

    // الحفظ في قاعدة البيانات
    await supabase.from('activities').insert([{
      action: action,
      details: details
    }]);
  };

  // --- 3. Projects Actions ---
  const addProject = async (projectData: Omit<Project, "id">) => {
    try {
      const { data, error } = await supabase.from('projects').insert([{
        name: projectData.name,
        description: projectData.description,
        // user_id: ممكن نضيفه هنا لو معانا اليوزر
      }]).select().single();

      if (error) throw error;

      if (data) {
        const newProject: Project = { 
          ...projectData, 
          id: data.id,
          status: 'active' 
        };
        setProjects(prev => [newProject, ...prev]);
        addActivity("Created new project", newProject.name);
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    // تحديث الواجهة فوراً (Optimistic UI)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    // تحديث قاعدة البيانات
    await supabase.from('projects').update({
      name: updates.name,
      description: updates.description
    }).eq('id', id);

    const project = projects.find(p => p.id === id);
    if (project) addActivity("Updated project", project.name);
  };

  const deleteProject = async (id: string) => {
    const project = projects.find(p => p.id === id);
    
    // حذف من الواجهة
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    
    // حذف من قاعدة البيانات
    await supabase.from('tasks').delete().eq('project_id', id); // امسح التاسكات الأول
    await supabase.from('projects').delete().eq('id', id); // ثم المشروع
    
    if (project) addActivity("Deleted project", project.name);
  };

  // --- 4. Tasks Actions ---
  const addTask = async (taskData: Omit<Task, "id">) => {
    try {
      const { data, error } = await supabase.from('tasks').insert([{
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.dueDate,      // Mapping
        project_id: taskData.projectId   // Mapping
      }]).select().single();

      if (error) throw error;

      if (data) {
        const newTask: Task = {
          ...taskData,
          id: data.id, // استخدام الـ ID الحقيقي من Supabase
        };
        setTasks(prev => [newTask, ...prev]);
        
        const project = projects.find(p => p.id === taskData.projectId);
        addActivity("Created new task", project?.name || "Unknown");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // تحديث الواجهة
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    // تحديث قاعدة البيانات
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
    if (updates.projectId) dbUpdates.project_id = updates.projectId;

    await supabase.from('tasks').update(dbUpdates).eq('id', id);

    const task = tasks.find(t => t.id === id);
    const project = projects.find(p => p.id === task?.projectId);
    
    if (updates.status) {
      addActivity(`Moved task to ${updates.status}`, project?.name || "Unknown");
    } else {
      addActivity("Updated task", project?.name || "Unknown");
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    const project = projects.find(p => p.id === task?.projectId);
    
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
    
    addActivity("Deleted task", project?.name || "Unknown");
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    addActivity("Updated profile", "Profile");
  };

  // تحديث وقت النشاطات كل دقيقة
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => prev.map(a => ({
        ...a,
        time: formatTimeAgo(a.timestamp)
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
      isLoading
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
