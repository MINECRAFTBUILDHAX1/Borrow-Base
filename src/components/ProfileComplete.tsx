
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

const ProfileComplete = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Show the dialog when a user logs in but hasn't completed their profile
  useEffect(() => {
    if (user) {
      // Check if profile is incomplete
      // This is a simple check - you can expand this based on your requirements
      const isProfileIncomplete = !user.user_metadata?.profile_completed;
      
      if (isProfileIncomplete) {
        setOpen(true);
      }
    }
  }, [user]);

  const handleCompleteProfile = () => {
    navigate('/settings');
    setOpen(false);
  };

  const handleSkip = () => {
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
