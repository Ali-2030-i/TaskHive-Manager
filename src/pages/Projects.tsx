import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, CheckCircle2, Trash2, Edit2, Archive, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useData, Project } from "@/contexts/DataContext";

const colorOptions = [
  { name: "Amber", class: "bg-primary" },
  { name: "Blue", class: "bg-secondary" },
  { name: "Green", class: "bg-green-500" },
  { name: "Purple", class: "bg-purple-500" },
  { name: "Pink", class: "bg-pink-500" },
  { name: "Cyan", class: "bg-cyan-500" },
];

const Projects = () => {
  const { projects, tasks, addProject, updateProject, deleteProject } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: "bg-primary",
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    addProject({
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      members: ["AZ"],
      status: "active",
    });
    setNewProject({ name: "", description: "", color: "bg-primary" });
    setIsCreateOpen(false);
  };

  const handleEditProject = () => {
    if (!editingProject || !editingProject.name.trim()) return;
    updateProject(editingProject.id, {
      name: editingProject.name,
      description: editingProject.description,
      color: editingProject.color,
      status: editingProject.status,
    });
    setEditingProject(null);
    setIsEditOpen(false);
  };

  const handleDeleteProject = () => {
    if (deleteProjectId) {
      deleteProject(deleteProjectId);
      setDeleteProjectId(null);
    }
  };

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    return {
      total: projectTasks.length,
      completed: projectTasks.filter(t => t.status === "done").length,
    };
  };

  const openEditDialog = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditOpen(true);
  };

  return (
    <Layout>
      <div className="pt-28 pb-16 min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage and organize all your team projects
              </p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2 group">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    Create New Project
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Project Name
                    </label>
                    <Input
                      placeholder="Enter project name..."
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="bg-muted border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Enter project description..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="bg-muted border-border resize-none focus:border-primary"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Color Tag
                    </label>
                    <div className="flex gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setNewProject({ ...newProject, color: color.class })}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all duration-300 hover:scale-125",
                            color.class,
                            newProject.color === color.class && "ring-2 ring-foreground ring-offset-2 ring-offset-card scale-110"
                          )}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={handleCreateProject}
                  >
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">No projects yet</p>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero">
                      <Plus className="w-5 h-5" />
                      Create Your First Project
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              projects.map((project, index) => {
                const stats = getProjectStats(project.id);
              return (
                <div
                  key={project.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background/40 to-background/20 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50",
                    project.status === "completed" && "opacity-70",
                    project.status === "archived" && "opacity-50"
                  )}
                  style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    {/* Status Badge */}
                    {project.status !== "active" && (
                      <div className={cn(
                        "absolute top-2 right-2 text-xs px-3 py-1 rounded-full font-medium",
                        project.status === "completed" && "bg-green-500/20 text-green-600 dark:text-green-400",
                        project.status === "archived" && "bg-muted/60 text-muted-foreground"
                      )}>
                        {project.status === "completed" ? "✓ Completed" : "📦 Archived"}
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-4 h-4 rounded-full group-hover:scale-150 transition-transform duration-300", project.color)} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="p-1.5 rounded-lg hover:bg-muted transition-all opacity-0 group-hover:opacity-100 duration-300"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem onClick={() => openEditDialog(project)} className="cursor-pointer">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          {project.status === "active" && (
                            <DropdownMenuItem onClick={() => updateProject(project.id, { status: "completed" })} className="cursor-pointer">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {project.status === "completed" && (
                            <DropdownMenuItem onClick={() => updateProject(project.id, { status: "active" })} className="cursor-pointer">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          {project.status !== "archived" && (
                            <DropdownMenuItem onClick={() => updateProject(project.id, { status: "archived" })} className="cursor-pointer">
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          {project.status === "archived" && (
                            <DropdownMenuItem onClick={() => updateProject(project.id, { status: "active" })} className="cursor-pointer">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restore
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => setDeleteProjectId(project.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Content - Clickable Link */}
                    <Link to={`/project/${project.id}`} className="block">
                      <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 group-hover:text-foreground/60 transition-colors">
                        {project.description || "No description"}
                      </p>
                    </Link>

                    {/* Stats Bar */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-primary/10 group-hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">
                          Progress
                        </span>
                        <span className="text-xs font-bold text-primary">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${stats.total === 0 ? 0 : (stats.completed / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center text-xs font-bold text-primary-foreground border border-background"
                            title={member}
                          >
                            {member}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-background">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                      <Link 
                        to={`/project/${project.id}`}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors group-hover:underline"
                      >
                        View Board →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Edit Project
            </DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Project Name
                </label>
                <Input
                  placeholder="Enter project name..."
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Enter project description..."
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="bg-muted border-border resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <div className="flex gap-2">
                  {(["active", "completed", "archived"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setEditingProject({ ...editingProject, status })}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                        status === "active" && "bg-secondary/20 text-secondary",
                        status === "completed" && "bg-green-500/20 text-green-500",
                        status === "archived" && "bg-muted text-muted-foreground",
                        editingProject.status === status && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Color Tag
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setEditingProject({ ...editingProject, color: color.class })}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        color.class,
                        editingProject.color === color.class && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={handleEditProject}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all its tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
};

export default Projects;
