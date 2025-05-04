
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Camera, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import MapLocationPicker from "@/components/MapLocationPicker";

const profileSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required" }),
  bio: z.string().optional(),
  location: z.string().optional(),
  paypalEmail: z.string().email({ message: "Invalid PayPal email address" }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const SettingsProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [paypalSaved, setPaypalSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's avatar if it exists
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      bio: user?.user_metadata?.bio || "",
      location: user?.user_metadata?.location || "",
      paypalEmail: user?.user_metadata?.paypal_email || "",
    },
  });

  // Update form with user data when it loads
  useEffect(() => {
    if (user) {
      profileForm.setValue('fullName', user.user_metadata?.full_name || "");
      profileForm.setValue('bio', user.user_metadata?.bio || "");
      profileForm.setValue('location', user.user_metadata?.location || "");
      profileForm.setValue('paypalEmail', user.user_metadata?.paypal_email || "");
    }
  }, [user, profileForm]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to update your profile",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          bio: values.bio,
          location: values.location,
          paypal_email: values.paypalEmail,
          profile_completed: true,
        },
      });
      
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (values.paypalEmail) {
        setPaypalSaved(true);
        setTimeout(() => {
          setPaypalSaved(false);
        }, 3000);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update user metadata with new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      });
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    profileForm.setValue('location', location.address);
    setShowMap(false);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center mb-4">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={avatarUrl || ""} alt="Profile" />
          <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="relative">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="sr-only"
            disabled={uploading}
          />
          <label
            htmlFor="avatar-upload"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Change Photo
              </>
            )}
          </label>
        </div>
      </div>

      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
          <FormField
            control={profileForm.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={profileForm.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell others a bit about yourself..." 
                    className="resize-none" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={profileForm.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      placeholder="London, UK"
                      {...field}
                      value={field.value || ""}
                      readOnly={showMap}
                      className="flex-1"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? "Hide Map" : "Select on Map"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={profileForm.control}
            name="paypalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PayPal Email Address</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <div className="relative flex-1">
                      <Input 
                        placeholder="your-paypal@example.com" 
                        type="email"
                        {...field} 
                        value={field.value || ""}
                      />
                      {paypalSaved && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Required</strong> for receiving 85% of the payment when your items are rented.
                </p>
              </FormItem>
            )}
          />
          
          {showMap && (
            <div className="border rounded-md p-1 h-[300px] mt-2">
              <MapLocationPicker
                onLocationSelect={handleLocationSelect}
                defaultLocation={{ lat: 51.5074, lng: -0.1278 }}
              />
            </div>
          )}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsProfileForm;
