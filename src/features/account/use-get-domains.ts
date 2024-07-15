import { useQuery } from "@tanstack/react-query";
import { api } from "../../infra/http";
import { Domain } from "./types";

async function fetchDomains(): Promise<Domain> {
  const req = await api.get<Domain>("/domains");
  return req.data;
}

export function useGetDomains() {
  const { data, isPending } = useQuery({
    queryKey: ["domains"],
    queryFn: fetchDomains,
    staleTime: Infinity,
  });

  return {
    data,
    isPending,
  };
}
