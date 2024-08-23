import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";
import { toRaw } from "vue";

export function usePlaygrounds() {
  const { data: playgroundsData, isFetched } = useQuery({
    queryKey: ["playgrounds"],
    queryFn: getPlaygrounds,
    // keepPreviousData: true,
  });
  console.log("use playgroundg ", playgroundsData, isFetched);
  const data = toRaw(playgroundsData);
  return { data, isFetched };
}

async function getPlaygrounds(id) {
  const { data, error, status } = await supabase
    .from("playgrounds")

    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
