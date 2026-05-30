import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface CourseItem {
  id: string;
  name: string;
  fees: number;
}

interface PlacementData {
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
}

interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  pros: string | null;
  cons: string | null;
}

interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  totalFees: number;
  established: number | null;
  type: string;
  category: string;
  imageUrl: string | null;
  placements?: PlacementData | null;
  courses: CourseItem[];
  reviews: ReviewItem[];
}

interface CollegesApiResponse {
  success: boolean;
  data: College[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

export function useColleges() {
  const searchParams = useSearchParams();

  // Build query string from active URL parameters
  const queryString = searchParams.toString();

  const fetchColleges = async (): Promise<CollegesApiResponse> => {
    const res = await fetch(`/api/colleges?${queryString}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Failed to fetch colleges");
    }
    return json;
  };

  // Cache key based on active query string parameters
  const queryInfo = useQuery({
    queryKey: ["colleges", queryString],
    queryFn: fetchColleges,
    placeholderData: (previousData) => previousData, // smooth shimmer transition instead of blank loader on parameter toggle
  });

  return {
    ...queryInfo,
    colleges: queryInfo.data?.data || [],
    pagination: queryInfo.data?.pagination || {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    },
  };
}
