
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { HeroSection } from "./sections/HeroSection";
import { ServicesGrid } from "./sections/ServicesGrid";
import { BarbersTeam } from "./sections/BarbersTeam";
import { BookingSection } from "./sections/BookingSection";

// Exportando todos os componentes de seção
export const sectionComponents: Record<string, ComponentConfig> = {
  HeroSection,
  ServicesGrid,
  BarbersTeam,
  BookingSection
};
