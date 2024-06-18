import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";

export function useBikeParkings() {
  const { data, isFetched } = useQuery({
    queryKey: ["bikeParkings"],
    queryFn: getBikeParkings,
  });
  return { data, isFetched };
}

async function getBikeParkings() {
  const { data, error } = await supabase.from("bikeParkings").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
