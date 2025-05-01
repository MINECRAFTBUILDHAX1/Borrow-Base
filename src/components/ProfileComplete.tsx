
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ProfileComplete = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Show the dialog only when a user logs in for the first time
  useEffect(() => {
    if (user) {
      // Check if this is a first login by checking if profile_completed flag exists
      const isFirstLogin = user.user_metadata?.profile_completed === undefined;
      
      if (isFirstLogin) {
        setOpen(true);
      }
    }
  }, [user]);

  const handleCompleteProfile = async () => {
    // Mark profile as "seen completion dialog" so it won't show again
    if (user) {
      await supabase.auth.updateUser({
        data: {
          profile_completed: true,
        },
      });
    }
    navigate('/settings');
    setOpen(false);
  };

  const handleSkip = async () => {
    // Even if they skip, mark as having seen the dialog
    if (user) {
      await supabase.auth.updateUser({
        data: {
          profile_completed: true,
        },
      });
    }
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Set up your profile to get the most out of BorrowBase. Add a profile photo, bio, and location to help other users know more about you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            A complete profile builds trust and increases your chances of successful rentals and borrowing experiences.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>Skip for now</Button>
          <Button onClick={handleCompleteProfile}>Complete Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileComplete;
