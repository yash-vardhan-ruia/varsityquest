import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export interface CompareCollegeItem {
  id: string;
  name: string;
  city: string;
  imageUrl: string | null;
  category: string;
}

interface ComparisonState {
  colleges: CompareCollegeItem[];
  isOpen: boolean;
  addCollege: (college: CompareCollegeItem) => void;
  removeCollege: (id: string) => void;
  clear: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      colleges: [],
      isOpen: false,
      addCollege: (college) => {
        const { colleges } = get();
        
        // Check if already exists
        if (colleges.some((c) => c.id === college.id)) {
          toast.error("This college is already in the comparison list");
          return;
        }

        // Check limit
        if (colleges.length >= 3) {
          toast.error("You can select a maximum of 3 colleges to compare");
          return;
        }

        set({
          colleges: [...colleges, college],
          isOpen: true, // open tray automatically on add
        });
        toast.success(`${college.name} added to comparison`);
      },
      removeCollege: (id) => {
        const { colleges } = get();
        const college = colleges.find((c) => c.id === id);
        
        set({
          colleges: colleges.filter((c) => c.id !== id),
        });

        if (college) {
          toast.success(`${college.name} removed from comparison`);
        }
      },
      clear: () => set({ colleges: [], isOpen: false }),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "varsityquest-comparison-storage", // local storage key
    }
  )
);
