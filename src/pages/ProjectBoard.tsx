import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, GripVertical, Calendar, Trash2, Edit2, MoreVertical } from "lucide-react";
import { SubTaskList } from "@/components/SubTaskList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useData, Task } from "@/contexts/DataContext";

const columns = [
  { id: "todo", title: "To Do", color: "bg-muted-foreground/30" },
  { id: "progress", title: "In Progress", color: "bg-secondary" },
  { id: "review", title: "Review", color: "bg-primary" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-primary/20 text-primary",
  high: "bg-destructive/20 text-destructive",
};

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, addTask, updateTask, deleteTask } = useData();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    dueDate: new Date().toISOString().split("T")[0],
  });

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task["status"]) => {
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
      setDraggedTask(null);
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !id) return;
    
    addTask({
      projectId: id,
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      assignee: "AZ",
      dueDate: newTask.dueDate,
    });
    
    setNewTask({ 
      title: "", 
      description: "", 
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
    });
    setIsCreateOpen(false);
  };

  const handleEditTask = () => {
    if (!editingTask) return;
    updateTask(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
      status: editingTask.status,
      dueDate: editingTask.dueDate,
    });
    setEditingTask(null);
    setIsEditOpen(false);
  };

  const handleDeleteTask = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task });
    setIsEditOpen(true);
  };

  const getTasksByStatus = (status: Task["status"]) => 
    projectTasks.filter(t => t.status === status);

  if (!project) {
    return (
      <Layout>
        <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Button asChild variant="hero">
              <Link to="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link to="/projects">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", project.color)} />
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">
                    {project.name}
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="w-5 h-5" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    Create New Task
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Task Title
                    </label>
                    <Input
                      placeholder="Enter task title..."
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Enter task description..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="bg-muted border-border resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setNewTask({ ...newTask, priority })}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                            priorityColors[priority],
                            newTask.priority === priority && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                          )}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={handleCreateTask}
                  >
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col bg-gradient-to-b from-background/40 to-background/20 border border-border/40 rounded-xl p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg group/column"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id as Task["status"])}
              >
                {/* Column Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/30 group-hover/column:border-primary/20 transition-all">
                  <div className={cn("w-3 h-3 rounded-full group-hover/column:scale-125 transition-transform duration-200", column.color)} />
                  <h3 className="font-display font-bold text-foreground group-hover/column:text-primary transition-colors duration-200">
                    {column.title}
                  </h3>
                  <span className="ml-auto text-sm font-semibold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full group-hover/column:bg-primary/20 group-hover/column:text-primary transition-all duration-200">
                    {getTasksByStatus(column.id as Task["status"]).length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="space-y-4 min-h-[500px]">
                  {getTasksByStatus(column.id as Task["status"]).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-muted-foreground">No tasks yet</p>
                    </div>
                  ) : (
                    getTasksByStatus(column.id as Task["status"]).map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className={cn(
                          "group bg-card border border-border/40 rounded-xl p-5 cursor-move transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:bg-card/80",
                          draggedTask?.id === task.id && "opacity-50 scale-95",
                          "transform hover:scale-102 hover:-translate-y-1"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 shrink-0 cursor-grab active:cursor-grabbing" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <h4 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors duration-200 line-clamp-2">
                                {task.title}
                              </h4>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1.5 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-all shrink-0 hover:text-primary">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border">
                                  <DropdownMenuItem onClick={() => openEditDialog(task)} className="cursor-pointer">
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Task
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {columns.filter(c => c.id !== task.status).map(col => (
                                    <DropdownMenuItem 
                                      key={col.id}
                                      onClick={() => updateTask(task.id, { status: col.id as Task["status"] })}
                                      className="cursor-pointer"
                                    >
                                      <div className={cn("w-3 h-3 rounded-full mr-2", col.color)} />
                                      Move to {col.title}
                                    </DropdownMenuItem>
                                  ))}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onClick={() => setDeleteTaskId(task.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 group-hover:text-foreground/60 transition-colors">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                              <span className={cn(
                                "text-xs px-3 py-1.5 rounded-full font-medium capitalize transition-all duration-200",
                                priorityColors[task.priority],
                                "group-hover:scale-110"
                              )}>
                                {task.priority}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center text-xs font-bold text-primary-foreground hover:scale-110 transition-transform duration-200">
                                {task.assignee}
                              </div>
                            </div>
                            
                            {/* SubTasks - Compact Preview */}
                            {task.subTasks && task.subTasks.length > 0 && (
                              <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-primary/10 group-hover:border-primary/30 transition-all">
                                <p className="text-xs font-medium text-muted-foreground mb-2.5">
                                  ✓ {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} subtasks
                                </p>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                                    style={{ width: `${(task.subTasks.filter(st => st.completed).length / task.subTasks.length) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <SubTaskList taskId={task.id} subTasks={tasks.find(t => t.id === task.id)?.subTasks || []} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Edit Task
            </DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Task Title
                </label>
                <Input
                  placeholder="Enter task title..."
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Enter task description..."
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="bg-muted border-border resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select 
                  value={editingTask.status} 
                  onValueChange={(value) => setEditingTask({ ...editingTask, status: value as Task["status"] })}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {columns.map(col => (
                      <SelectItem key={col.id} value={col.id}>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", col.color)} />
                          {col.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setEditingTask({ ...editingTask, priority })}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                        priorityColors[priority],
                        editingTask.priority === priority && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                      )}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={handleEditTask}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ProjectBoard;
