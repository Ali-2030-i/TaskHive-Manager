import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface EnhancedButtonProps extends ButtonProps {
  withGlow?: boolean;
  withPulse?: boolean;
  withShimmer?: boolean;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ withGlow = false, withPulse = false, withShimmer = false, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {withGlow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/0 to-primary/20 rounded-lg blur-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {withPulse && (
          <motion.div
            className="absolute inset-0 border border-primary/50 rounded-lg"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <Button ref={ref} {...props} className="relative">
          {withShimmer && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ borderRadius: "inherit" }}
            />
          )}
          {props.children}
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
