import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Camera,
  Mail, 
  Clock, 
  Trophy,
  Edit2,
  Save,
  X,
  CheckCircle2,
  FolderKanban,
  TrendingUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import {
  FadeIn,
  ScrollReveal,
  HoverScale,
} from "@/components/MotionComponents";

const colorOptions = [
  { name: "Amber", class: "bg-primary" },
  { name: "Blue", class: "bg-secondary" },
  { name: "Green", class: "bg-green-500" },
  { name: "Purple", class: "bg-purple-500" },
  { name: "Pink", class: "bg-pink-500" },
  { name: "Cyan", class: "bg-cyan-500" },
];

const achievements = [
  { icon: CheckCircle2, label: "100 Tasks Completed", unlocked: true },
  { icon: FolderKanban, label: "10 Projects Created", unlocked: true },
  { icon: Clock, label: "40+ Focus Hours", unlocked: true },
  { icon: Trophy, label: "Team Leader", unlocked: false },
];

const Profile = () => {
  const { profile, updateProfile, projects, tasks } = useData();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatarColor: profile.avatarColor,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    updateProfile({
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      avatarColor: editForm.avatarColor,
    });
    setIsEditOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    updateProfile({ avatarImage: undefined });
  };

  const stats = [
    { label: "Tasks Completed", value: tasks.filter(t => t.status === "done").length.toString() },
    { label: "Projects", value: projects.length.toString() },
    { label: "Focus Hours", value: `${profile.focusHours}h` },
    { label: "Active Tasks", value: tasks.filter(t => t.status !== "done").length.toString() },
  ];

  return (
    <Layout>
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Profile Card */}
          <FadeIn direction="down" duration={0.6}>
            <motion.div className="glass-card p-8 mb-8" whileHover={{ borderColor: "rgba(var(--primary), 0.3)" }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <HoverScale scale={1.05}>
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                  >
                    {profile.avatarImage ? (
                      <img 
                        src={profile.avatarImage} 
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover glow-amber"
                      />
                    ) : (
                      <div className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-display font-bold",
                        profile.avatarColor,
                        "text-primary-foreground glow-amber"
                      )}>
                        {profile.avatarInitials}
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {profile.avatarImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                </HoverScale>

              {/* Info */}
              <motion.div className="flex-1 text-center md:text-left">
                <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {profile.role}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
              </motion.div>

              {/* Edit Button */}
              <HoverScale scale={1.08}>
                <Button variant="outline" onClick={() => {
                  setEditForm({
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    avatarColor: profile.avatarColor,
                  });
                  setIsEditOpen(true);
                }}>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              </HoverScale>
            </div>
            </motion.div>
          </FadeIn>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="glass-card p-4 text-center group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="font-display text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievements */}
          <ScrollReveal delay={0.2}>
            <motion.div 
              className="glass-card p-6 mb-8"
              whileHover={{ borderColor: "rgba(var(--primary), 0.3)" }}
            >
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={`achievement-${idx}`}
                  className={cn(
                    "p-4 rounded-xl text-center transition-all cursor-pointer group",
                    achievement.unlocked 
                      ? "bg-primary/10 border border-primary/30" 
                      : "bg-muted/50 border border-border opacity-50"
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={achievement.unlocked ? { scale: 1.05, y: -4 } : {}}
                >
                  <motion.div
                    animate={achievement.unlocked ? { y: [0, -4, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <achievement.icon 
                      className={cn(
                        "w-8 h-8 mx-auto mb-2",
                        achievement.unlocked ? "text-primary" : "text-muted-foreground"
                      )} 
                    />
                  </motion.div>
                  <p className="text-sm font-medium text-foreground">
                    {achievement.label}
                  </p>
                </motion.div>
              ))}
            </div>
            </motion.div>
          </ScrollReveal>

          {/* Focus Hours Chart */}
          <div 
            className="glass-card p-6 animate-slide-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Focus Hours This Week
            </h2>
            <div className="h-48 flex items-end gap-2">
              {[6, 8, 5, 9, 7, 4, 3].map((hours, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{hours}h</span>
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all duration-500 hover:from-primary/80"
                    style={{ height: `${(hours / 10) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Full Name
              </label>
              <Input
                placeholder="Enter your name..."
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email..."
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Role
              </label>
              <Input
                placeholder="Enter your role..."
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Avatar Color (if no image)
              </label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setEditForm({ ...editForm, avatarColor: color.class })}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      color.class,
                      editForm.avatarColor === color.class && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <Button 
              variant="hero" 
              className="w-full"
              onClick={handleSaveProfile}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
