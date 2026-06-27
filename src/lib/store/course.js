import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCourseStore = create(
    persist(
        (set) => ({
            selectedCourse: null,

            setSelectedCourse: (course) =>
                set({ selectedCourse: course }),

            clearCourse: () =>
                set({ selectedCourse: null }),
        }),
        {
            name: "course-storage",
        }
    )
);

export default useCourseStore;