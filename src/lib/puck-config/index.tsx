
import { Config, Data } from "@measured/puck";
import { Render } from "@measured/puck";
import { puckComponents } from "./components";
import { colorOptions, textColorOptions, accentColorOptions, buttonColorOptions } from "./color-options";

// Create and export the PuckRenderer component using the Render component from @measured/puck
export const PuckRenderer = Render;

// Export the config with all components
export const config: Config = {
  components: puckComponents
};

// Re-export color options for use in other files
export { colorOptions, textColorOptions, accentColorOptions, buttonColorOptions };
