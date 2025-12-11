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
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Projects
              </h1>
              <p className="text-muted-foreground">
                Manage and organize all your team projects
              </p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="w-5 h-5" />
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
                      className="bg-muted border-border"
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
                      className="bg-muted border-border resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Color Tag
                    </label>
                    <div className="flex gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setNewProject({ ...newProject, color: color.class })}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all",
                            color.class,
                            newProject.color === color.class && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
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
            {projects.map((project, index) => {
              const stats = getProjectStats(project.id);
              return (
                <div
                  key={project.id}
                  className={cn(
                    "glass-card p-6 group transition-all duration-300 hover:-translate-y-1 animate-slide-up relative",
                    project.status === "completed" && "opacity-70",
                    project.status === "archived" && "opacity-50"
                  )}
                  style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "both" }}
                >
                  {/* Status Badge */}
                  {project.status !== "active" && (
                    <div className={cn(
                      "absolute top-3 right-12 text-xs px-2 py-0.5 rounded-full",
                      project.status === "completed" && "bg-green-500/20 text-green-500",
                      project.status === "archived" && "bg-muted text-muted-foreground"
                    )}>
                      {project.status === "completed" ? "Completed" : "Archived"}
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-3 h-3 rounded-full", project.color)} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="p-1 rounded-lg hover:bg-muted transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => openEditDialog(project)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        {project.status === "active" && (
                          <DropdownMenuItem onClick={() => updateProject(project.id, { status: "completed" })}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        {project.status === "completed" && (
                          <DropdownMenuItem onClick={() => updateProject(project.id, { status: "active" })}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                        {project.status !== "archived" && (
                          <DropdownMenuItem onClick={() => updateProject(project.id, { status: "archived" })}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        {project.status === "archived" && (
                          <DropdownMenuItem onClick={() => updateProject(project.id, { status: "active" })}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
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
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", project.color)}
                          style={{
                            width: stats.total > 0 
                              ? `${(stats.completed / stats.total) * 100}%`
                              : "0%"
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground"
                          >
                            {member}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3" />
                        {stats.completed} done
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
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
    </Layout>
  );
};

export default Projects;
