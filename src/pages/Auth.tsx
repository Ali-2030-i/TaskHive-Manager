import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import "./Auth.css";

const animals = [
  { id: 1, name: "🦁", delay: 0 },
  { id: 2, name: "🦊", delay: 0.1 },
  { id: 3, name: "🐻", delay: 0.2 },
  { id: 4, name: "🐼", delay: 0.3 },
  { id: 5, name: "🦌", delay: 0.4 },
];

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // تتبع حركة الماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / globalThis.innerWidth,
        y: e.clientY / globalThis.innerHeight,
      });
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    return () => globalThis.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // تسجيل الدخول
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccess("تم تسجيل الدخول بنجاح! ✨");
      } else {
        // إنشاء حساب جديد
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني 📧");
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* خلفية متحركة مع تدرج */}
      <div className="auth-background">
        <motion.div
          className="gradient-orb orb-1"
          animate={{
            x: mousePosition.x * 50 - 25,
            y: mousePosition.y * 50 - 25,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="gradient-orb orb-2"
          animate={{
            x: mousePosition.x * -40 + 20,
            y: mousePosition.y * -40 + 20,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="gradient-orb orb-3"
          animate={{
            x: mousePosition.x * 30 - 15,
            y: mousePosition.y * -30 + 15,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
      </div>

      {/* الحيوانات العلوية */}
      <div className="animals-container">
        {animals.map((animal) => (
          <motion.div
            key={animal.id}
            className={`animal ${showPassword ? "watching" : "sleeping"}`}
            animate={{
              y: showPassword ? -5 : 0,
              rotateZ: showPassword ? 0 : 15,
            }}
            transition={{ delay: animal.delay, duration: 0.6 }}
          >
            <motion.span
              className="animal-emoji"
              animate={{
                scale: showPassword ? 1.2 : 1,
                filter: showPassword
                  ? "brightness(1.3)"
                  : "brightness(0.8)",
              }}
            >
              {animal.name}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* البطاقة الرئيسية */}
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* الرأس */}
        <motion.div className="auth-header">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLogin ? "أهلاً بعودتك" : "انضم إلينا"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isLogin
              ? "أدخل بيانات حسابك لإدارة مهامك"
              : "أنشئ حساباً جديداً للبدء"}
          </motion.p>
        </motion.div>

        {/* النموذج */}
        <form onSubmit={handleAuth} className="auth-form">
          {/* حقل البريد الإلكتروني */}
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="email">البريد الإلكتروني</label>
            <motion.input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          {/* حقل كلمة المرور */}
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="password">كلمة المرور</label>
            <div className="password-wrapper">
              <motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </motion.button>
            </div>
          </motion.div>

          {/* رسالة خطأ */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* رسالة نجاح */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                ✨ {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* زر الإرسال */}
          <motion.button
            type="submit"
            disabled={loading}
            className="auth-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                ⚙️
              </motion.span>
            ) : isLogin ? (
              "دخول"
            ) : (
              "إنشاء حساب"
            )}
          </motion.button>
        </form>

        {/* التبديل بين الحسابات */}
        <motion.div className="auth-footer">
          <p>
            {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
          </p>
          <motion.button
            type="button"
            className="toggle-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
              setEmail("");
              setPassword("");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? "أنشئ حساب جديد" : "سجل دخول"}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* شعار الموقع */}
      <motion.div
        className="auth-logo"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        TaskHive 🐝
      </motion.div>
    </div>
  );
}
