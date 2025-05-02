import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Plus, X, AlertCircle, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import Commission from "@/components/Commission";
import MapLocationPicker from "@/components/MapLocationPicker";
import { ListingTable } from "@/types/database";

const categories = [
  { id: "tools", name: "Tools" },
  { id: "electronics", name: "Electronics" },
  { id: "outdoor", name: "Outdoor" },
  { id: "furniture", name: "Furniture" },
  { id: "clothing", name: "Clothing" },
  { id: "sports", name: "Sports" },
  { id: "books", name: "Books" },
  { id: "kitchen", name: "Kitchen" },
  { id: "games", name: "Games" },
  { id: "music", name: "Music" },
];

const CreateListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [rules, setRules] = useState<string[]>([""]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<any>(null);
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  
  const addFeature = () => {
    setFeatures([...features, ""]);
  };
  
  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  
  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };
  
  const addRule = () => {
    setRules([...rules, ""]);
  };
  
  const updateRule = (index: number, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index] = value;
    setRules(updatedRules);
  };
  
  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...images];
    const newUrls = [...imageUrls];
    
    setLoadingImages(true);
    
    for (const file of selectedFiles) {
      if (newFiles.length + images.length >= 5) break;
      
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      newFiles.push(file);
      newUrls.push(url);
    }
    
    setImages(newFiles);
    setImageUrls(newUrls);
    setLoadingImages(false);
    
    // Reset the file input
    e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedUrls = [...imageUrls];
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(updatedUrls[index]);
    
    updatedImages.splice(index, 1);
    updatedUrls.splice(index, 1);
    
    setImages(updatedImages);
    setImageUrls(updatedUrls);
  };
  
  const nextStep = () => {
    if (currentStep === 1) {
      if (!title || !description || !category) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!pricePerDay || !location) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 3) {
      if (images.length === 0) {
        toast({
          title: "Missing images",
          description: "Please add at least one image.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const uploadImages = async () => {
    if (!user) return [];
    
    const uploadedUrls = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      try {
        const { error: uploadError, data } = await supabase.storage
          .from('listings')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload failed",
          description: "There was a problem uploading one or more images.",
          variant: "destructive",
        });
      }
    }
    
    return uploadedUrls;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in before final submission
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images and get their public URLs
      const imageUrls = await uploadImages();
      
      // Create a listing object with all the data
      const listingData = {
        user_id: user.id,
        title,
        description,
        category,
        price_per_day: parseFloat(pricePerDay),
        security_deposit: securityDeposit ? parseFloat(securityDeposit) : null,
        location,
        location_details: selectedLocationDetails,
        features: features.filter(feature => feature.trim() !== ''),
        rules: rules.filter(rule => rule.trim() !== ''),
        images: imageUrls,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      
      // Insert the new listing into Supabase
      const { data, error } = await supabase
        .from('listings')
        .insert(listingData as any);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Listing created!",
        description: "Your item has been successfully listed.",
      });
      navigate("/profile/me");
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error creating your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLocationPicker = () => {
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (selectedLocation: { address: string; lat: number; lng: number }) => {
    setLocation(selectedLocation.address);
    setShowLocationPicker(false);
    setSelectedLocationDetails(selectedLocation);
  };
  
  // Load the Google Maps API
  useEffect(() => {
    // In a real implementation, we would load the Google Maps API here
    // For now, we'll simulate it being loaded
    const timer = setTimeout(() => {
      setMapApiLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
      <p className="text-gray-600 mb-8">Share your item with the community and start earning</p>
      
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? "bg-brand-purple text-white" : "bg-gray-200 text-gray-500"
          }`}>
            1
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-brand-purple" : "bg-gray-200"}`}></div>
        </div>
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? "bg-brand-purple text-white" : "bg-gray-200 text-gray-500"
          }`}>
            2
          </div>
          <div className={`h-1 w-16 ${currentStep >= 3 ? "bg-brand-purple" : "bg-gray-200"}`}></div>
        </div>
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 3 ? "bg-brand-purple text-white" : "bg-gray-200 text-gray-500"
          }`}>
            3
          </div>
          <div className={`h-1 w-16 ${currentStep >= 4 ? "bg-brand-purple" : "bg-gray-200"}`}></div>
        </div>
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 4 ? "bg-brand-purple text-white" : "bg-gray-200 text-gray-500"
          }`}>
            4
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="What are you listing?" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your item in detail" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    required
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* Step 2: Pricing & Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Pricing & Location</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price per day ($) *</Label>
                  <Input 
                    id="pricePerDay" 
                    type="number" 
                    placeholder="0.00" 
                    value={pricePerDay} 
                    onChange={e => setPricePerDay(e.target.value)} 
                    required 
                  />
                  
                  {/* Commission information */}
                  {pricePerDay && parseFloat(pricePerDay) > 0 && (
                    <div className="mt-2">
                      <Commission variant="compact" listingPrice={parseFloat(pricePerDay)} />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
                  <Input 
                    id="securityDeposit" 
                    type="number" 
                    placeholder="0.00" 
                    value={securityDeposit} 
                    onChange={e => setSecurityDeposit(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="location" 
                      placeholder="Enter your city or neighborhood" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                      required 
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={openLocationPicker}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Map
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Photos */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Photos</h2>
                <p className="text-gray-600 mb-4">Add high-quality photos of your item (up to 5)</p>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={images.length >= 5}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={url} 
                        alt={`Listing image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 bg-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {loadingImages && (
                    <div className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center text-gray-500">
                      <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  )}
                  
                  {images.length < 5 && !loadingImages && (
                    <button 
                      type="button"
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center text-gray-500 hover:text-brand-purple hover:border-brand-purple transition-colors"
                    >
                      <Camera className="h-8 w-8 mb-2" />
                      <span>Add photo</span>
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 4: Features & Rules */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Features & Rules</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Item Features</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="h-4 w-4 mr-2" /> Add Feature
                    </Button>
                  </div>
                  
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={feature} 
                        onChange={e => updateFeature(index, e.target.value)} 
                        placeholder={`Feature ${index + 1}`}
                      />
                      {features.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Rental Rules</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addRule}>
                      <Plus className="h-4 w-4 mr-2" /> Add Rule
                    </Button>
                  </div>
                  
                  {rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={rule} 
                        onChange={e => updateRule(index, e.target.value)} 
                        placeholder={`Rule ${index + 1}`}
                      />
                      {rules.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeRule(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Full commission information */}
                <div className="mt-6">
                  <Commission listingPrice={pricePerDay ? parseFloat(pricePerDay) : undefined} />
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {currentStep < 4 && (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Continue
                </Button>
              )}
              {currentStep === 4 && (
                <Button type="submit" disabled={isSubmitting} className="ml-auto">
                  {isSubmitting ? "Creating Listing..." : "Create Listing"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to create a listing. Would you like to sign in or create an account?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-2">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Log In
            </Button>
            <Button onClick={() => navigate("/auth?tab=register")}>
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map Dialog for Location Picking with Google Maps integration */}
      <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
            <DialogDescription>
              Choose your location from the map
            </DialogDescription>
          </DialogHeader>
          <div className="h-[300px] bg-gray-100 rounded-md">
            <MapLocationPicker onLocationSelect={handleLocationSelect} />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLocationPicker(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateListing;
