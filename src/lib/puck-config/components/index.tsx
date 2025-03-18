
import { basicComponents } from "./basic-components";
import { sectionComponents } from "./section-components";
import { utilityComponents } from "./utility-components";

// Combine all component types into one object for the Puck config
export const puckComponents = {
  // Section components (major building blocks)
  ...sectionComponents,
  
  // Basic components (smaller reusable parts)
  ...basicComponents,
  
  // Utility components (functional components)
  ...utilityComponents
};
