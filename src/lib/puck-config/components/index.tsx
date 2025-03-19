
import { basicComponents } from "./basic-components";
import { sectionComponents } from "./section-components";
import { utilityComponents } from "./utility-components";
import { ComponentConfig } from "@measured/puck";

// Combine all component types into one object for the Puck config
export const puckComponents: Record<string, ComponentConfig> = {
  // Section components (major building blocks)
  ...sectionComponents,
  
  // Basic components (smaller reusable parts)
  ...basicComponents,
  
  // Utility components (functional components)
  ...utilityComponents
};
