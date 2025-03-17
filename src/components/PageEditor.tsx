
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SaveIcon, Eye, RotateCcw } from "lucide-react";
import { Puck, type Data } from "@measured/puck";
import { config, PuckRenderer } from "@/lib/puck-config";
import { toast } from "@/components/ui/use-toast";

type SectionType = 'hero' | 'services' | 'barbers' | 'booking';

interface EditorProps {
  onSave: (sections: SectionType[]) => void;
  onPreview: () => void;
  onReset: () => void;
  initialSections?: SectionType[];
}

const PageEditor: React.FC<EditorProps> = ({ 
  onSave, 
  onPreview, 
  onReset,
  initialSections = ['hero', 'services', 'barbers', 'booking']
}) => {
  const [puckData, setPuckData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  console.log("PageEditor rendering with initialSections:", initialSections);
  
  // Load Puck data when initialized
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Check if there's saved Puck data
      const savedPuckData = localStorage.getItem('puckData');
      console.log("Fetching Puck data:", savedPuckData ? "Data found" : "No data");
      
      if (savedPuckData) {
        try {
          const parsedData = JSON.parse(savedPuckData);
          console.log("Puck data parsed successfully:", parsedData);
          setPuckData(parsedData);
        } catch (e) {
          console.error("Error parsing Puck data:", e);
          createDefaultPuckData();
        }
      } else {
        console.log("No Puck data found, creating default data");
        createDefaultPuckData();
      }
    } catch (e) {
      console.error("Error loading editor:", e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [initialSections]);

  // Function to create default Puck data based on initial sections
  const createDefaultPuckData = () => {
    console.log("Creating default Puck data with sections:", initialSections);
    
    // Map section types to Puck components
    const rootChildren = initialSections.map(sectionType => {
      switch(sectionType) {
        case 'hero':
          return {
            type: "HeroSection",
            props: {
              ...config.components.HeroSection.defaultProps
            }
          };
        case 'services':
          return {
            type: "ServicesGrid",
            props: {
              ...config.components.ServicesGrid.defaultProps
            }
          };
        case 'barbers':
          return {
            type: "BarbersTeam",
            props: {
              ...config.components.BarbersTeam.defaultProps
            }
          };
        case 'booking':
          return {
            type: "BookingSection",
            props: {
              ...config.components.BookingSection.defaultProps
            }
          };
        default:
          return null;
      }
    }).filter(Boolean);
    
    // Creating a proper Data structure for Puck according to its API
    const defaultData: Data = {
      root: {
        props: {}
      },
      content: rootChildren
    };
    
    console.log("Default Puck data created:", defaultData);
    setPuckData(defaultData);
    localStorage.setItem('puckData', JSON.stringify(defaultData));
  };

  // When the user makes changes in the editor
  const handlePuckChange = (data: Data) => {
    console.log("Puck data changed:", data);
    setPuckData(data);
  };

  // Save changes
  const handleSave = () => {
    console.log("Saving changes, current data:", puckData);
    
    if (!puckData || !puckData.content) {
      toast({
        title: "Error saving",
        description: "Invalid data. Try reloading the page.",
        variant: "destructive",
      });
      return;
    }
    
    // Save Puck data to localStorage
    localStorage.setItem('puckData', JSON.stringify(puckData));
    
    // Extract section types from Puck data
    const sections: SectionType[] = puckData.content
      .map((child: any) => {
        switch(child.type) {
          case 'HeroSection': return 'hero';
          case 'ServicesGrid': return 'services';
          case 'BarbersTeam': return 'barbers';
          case 'BookingSection': return 'booking';
          default: return null;
        }
      })
      .filter(Boolean) as SectionType[];
    
    console.log("Extracted sections to save:", sections);
    onSave(sections);
    
    toast({
      title: "Changes saved",
      description: "Homepage changes have been saved successfully.",
    });
  };

  // Reset to default
  const handleReset = () => {
    console.log("Resetting to default");
    createDefaultPuckData();
    onReset();
    
    toast({
      title: "Page reset",
      description: "The homepage has been reset to default.",
    });
  };

  // Loading component
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading editor...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error component
  if (hasError || !puckData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[600px]">
            <p className="text-red-500 mb-4">Error loading editor. Please try again.</p>
            <Button onClick={createDefaultPuckData}>
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Homepage Editor</CardTitle>
          <CardDescription>
            Use the editor below to customize your website's homepage
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            View Site
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <SaveIcon className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="p-4 bg-amber-50 border rounded-md mb-4">
          <p className="text-amber-800">
            Drag components from the sidebar to the editing area. Click on a component to edit its properties.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden" style={{ height: "800px" }}>
          <Puck
            config={config}
            data={puckData}
            onPublish={handleSave}
            onChange={handlePuckChange}
          />
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Preview:</h3>
          <div className="border rounded-md p-4 bg-gray-50 max-h-[400px] overflow-auto">
            {puckData ? (
              <PuckRenderer data={puckData} />
            ) : (
              <p className="text-muted-foreground text-center py-10">No content to preview.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
