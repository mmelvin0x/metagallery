import { Exhibit, NFT, Project } from "models";
import create from "zustand";

interface AppState {
  project: Project | null;
  setProject: (project: Project | null) => void;
  exhibits: Exhibit[];
  setExhibits: (exhibits: Exhibit[]) => void;
  selectedNft: NFT | null;
  setSelectedNft: (nft: NFT | null) => void;
  selectedExhibit: Exhibit | null;
  setSelectedExhibit: (exhibit: Exhibit | null) => void;
}

export const useAppState = create<AppState>((set) => ({
  project: null,
  setProject: (project: Project | null) => set(() => ({ project: project })),
  exhibits: [],
  setExhibits: (exhibits: Exhibit[]) => set(() => ({ exhibits: exhibits })),
  selectedNft: null,
  setSelectedNft: (nft: NFT | null) => set(() => ({ selectedNft: nft })),
  selectedExhibit: null,
  setSelectedExhibit: (exhibit: Exhibit | null) =>
    set(() => ({
      selectedExhibit: exhibit,
    })),
}));
