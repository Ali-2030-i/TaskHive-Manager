import { useState, useEffect } from "react";
import { useData, SubTask } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, X, Check } from "lucide-react";

interface SubTaskListProps {
  taskId: string;
  subTasks: SubTask[];
}

export const SubTaskList = ({ taskId, subTasks }: SubTaskListProps) => {
  const { addSubTask, updateSubTask, deleteSubTask } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [localSubTasks, setLocalSubTasks] = useState<SubTask[]>([]);

  // Sync local state with props
  useEffect(() => {
    setLocalSubTasks(subTasks);
  }, [subTasks]);

  const taskSubTasks = localSubTasks.filter(st => st.taskId === taskId);
  const completedCount = taskSubTasks.filter(st => st.completed).length;

  const handleAddSubTask = async () => {
    if (!newSubTaskTitle.trim()) return;
    await addSubTask(taskId, newSubTaskTitle);
    setNewSubTaskTitle("");
    setIsAdding(false);
  };

  const handleToggleSubTask = async (subTaskId: string, completed: boolean) => {
    // Optimistic update
    setLocalSubTasks(prev => 
      prev.map(st => st.id === subTaskId ? { ...st, completed: !completed } : st)
    );
    await updateSubTask(subTaskId, { completed: !completed });
  };

  const handleEditSubTask = (subTaskId: string, title: string) => {
    setEditingId(subTaskId);
    setEditingTitle(title);
  };

  const handleSaveEdit = async (subTaskId: string) => {
    if (!editingTitle.trim()) return;
    // Optimistic update
    setLocalSubTasks(prev =>
      prev.map(st => st.id === subTaskId ? { ...st, title: editingTitle } : st)
    );
    await updateSubTask(subTaskId, { title: editingTitle });
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteSubTask = async (subTaskId: string) => {
    // Optimistic delete
    setLocalSubTasks(prev => prev.filter(st => st.id !== subTaskId));
    await deleteSubTask(subTaskId);
  };

  return (
    <div className="space-y-3 mt-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 p-4 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
          <span className="text-lg">📋</span> 
          SubTasks 
          <span className={`text-xs px-2 py-1 rounded-full transition-colors font-semibold ${completedCount === taskSubTasks.length && taskSubTasks.length > 0 ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
            {completedCount}/{taskSubTasks.length}
          </span>
        </h4>
      </div>

      <div className="space-y-2">
        {taskSubTasks.length === 0 && !isAdding && (
          <p className="text-xs text-muted-foreground italic p-3 text-center">No subtasks yet. Add one to get started!</p>
        )}
        
        {taskSubTasks.map(subTask => (
          <div 
            key={subTask.id} 
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group/item border backdrop-blur-sm ${
              subTask.completed
                ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/15 hover:border-green-500/30"
                : "bg-background/60 border-primary/10 hover:bg-background/80 hover:border-primary/30 hover:shadow-md"
            }`}
          >
            <Checkbox
              checked={subTask.completed}
              onCheckedChange={() => handleToggleSubTask(subTask.id, subTask.completed)}
              className="h-5 w-5 transition-all duration-200 group-hover/item:scale-110 cursor-pointer"
            />
            {editingId === subTask.id ? (
              <div className="w-full space-y-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full text-base h-11 bg-background border-2 border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none rounded-lg px-3 text-foreground placeholder:text-muted-foreground font-medium transition-all duration-200 shadow-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(subTask.id);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditingTitle("");
                    }
                  }}
                  placeholder="Edit subtask..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveEdit(subTask.id)}
                    className="flex-1 h-10 gap-2 transition-all duration-200 bg-green-600 hover:bg-green-700 font-semibold shadow-md hover:shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(null);
                      setEditingTitle("");
                    }}
                    className="flex-1 h-10 font-semibold hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-5 h-5 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className={`text-sm flex-1 cursor-pointer transition-all duration-200 select-none ${
                    subTask.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground group-hover/item:text-primary font-medium"
                  }`}
                  role="button"
                  tabIndex={0}
                  onDoubleClick={() => handleEditSubTask(subTask.id, subTask.title)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEditSubTask(subTask.id, subTask.title);
                    }
                  }}
                >
                  {subTask.title}
                </span>
                <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEditSubTask(subTask.id, subTask.title)}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-1.5 rounded-md transition-all text-xs font-semibold"
                    title="Edit subtask (double-click text)"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteSubTask(subTask.id)}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all hover:scale-110 transform"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex gap-2 mt-3 p-3 bg-background/50 rounded-lg border border-primary/20 items-center">
          <input
            type="text"
            placeholder="Type subtask name..."
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubTask();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewSubTaskTitle("");
              }
            }}
            className="text-sm h-9 bg-background border border-primary/30 focus:border-primary focus:outline-none rounded-md px-2 flex-1 text-foreground placeholder:text-muted-foreground min-w-0"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddSubTask}
            disabled={!newSubTaskTitle.trim()}
            className="transition-all duration-200 gap-1 h-9 bg-green-600 hover:bg-green-700 disabled:opacity-50 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false);
              setNewSubTaskTitle("");
            }}
            className="h-9 shrink-0"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2 transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 border-primary/20 text-foreground/70 hover:text-foreground h-9"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4" />
          Add SubTask
        </Button>
      )}
    </div>
  );
};
