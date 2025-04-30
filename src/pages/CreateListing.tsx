
import { useState, useEffect } from "react";
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
import { Camera, Plus, X, AlertCircle } from "lucide-react";
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
import { MapPin } from "lucide-react";

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
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [rules, setRules] = useState<string[]>([""]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // For demo purposes, preloaded images
  const preloadedImages = [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    "https://images.unsplash.com/photo-1580707221190-bd94d9087b7f",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
  ];
  
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
  
  const handleAddImages = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll add preloaded images
    if (images.length < 3) {
      setImages([...images, preloadedImages[images.length]]);
    }
  };
  
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in before final submission
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Listing created!",
        description: "Your item has been successfully listed.",
      });
      setIsSubmitting(false);
      navigate("/profile/me");
    }, 1500);
  };

  const openLocationPicker = () => {
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationPicker(false);
  };
  
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
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={image} 
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
                  
                  {images.length < 5 && (
                    <button 
                      type="button"
                      onClick={handleAddImages}
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

      {/* Map Dialog for Location Picking - Mock Implementation */}
      <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
            <DialogDescription>
              Choose your location from the map
            </DialogDescription>
          </DialogHeader>
          <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Map integration coming soon</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quickLocation">Quick Select</Label>
            <Select onValueChange={handleLocationSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="Brooklyn, NY">Brooklyn, NY</SelectItem>
                <SelectItem value="Queens, NY">Queens, NY</SelectItem>
                <SelectItem value="Manhattan, NY">Manhattan, NY</SelectItem>
                <SelectItem value="Bronx, NY">Bronx, NY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLocationPicker(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowLocationPicker(false)}>
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateListing;
