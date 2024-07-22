import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";

export function useDogParks() {
  const { data, isFetched } = useQuery({
    queryKey: ["dogGardens"],
    queryFn: getDogParks,
  });
  console.log("use dogs : data -> ", data, isFetched);
  return { data, isFetched };
}

async function getDogParks() {
  const { data, error } = await supabase.from("dogGardens").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
