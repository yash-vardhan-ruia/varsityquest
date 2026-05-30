import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CollegeData {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  totalFees: number;
  category: string;
  imageUrl: string | null;
  type: string;
  placements?: {
    avgPackage: number;
    highestPackage: number;
    placementRate: number;
  } | null;
}

export function useSavedColleges() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const fetchSavedColleges = async (): Promise<CollegeData[]> => {
    const res = await fetch("/api/saved/colleges");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch saved colleges");
    return json.data;
  };

  const { data: savedColleges = [], isLoading, error } = useQuery({
    queryKey: ["savedColleges"],
    queryFn: fetchSavedColleges,
    enabled: !!session?.user?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      if (!session) {
        toast.error("Please login to save colleges");
        router.push("/auth/login");
        throw new Error("Unauthorized");
      }
      const res = await fetch("/api/saved/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save college");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedColleges"] });
      toast.success("College saved successfully");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message !== "Unauthorized") {
        toast.error(message);
      }
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch(`/api/saved/colleges/${collegeId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to unsave college");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedColleges"] });
      toast.success("College removed from saved list");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to unsave college";
      toast.error(message);
    },
  });

  const isSaved = (collegeId: string) => {
    return savedColleges.some((c) => c.id === collegeId);
  };

  const toggleSave = (collegeId: string) => {
    if (!session) {
      toast.error("Please login to save colleges");
      router.push("/auth/login");
      return;
    }
    
    if (isSaved(collegeId)) {
      unsaveMutation.mutate(collegeId);
    } else {
      saveMutation.mutate(collegeId);
    }
  };

  return {
    savedColleges,
    isLoading: isLoading && !!session,
    error,
    isSaved,
    toggleSave,
    isMutating: saveMutation.isPending || unsaveMutation.isPending,
  };
}
