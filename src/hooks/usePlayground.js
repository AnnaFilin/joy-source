import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";
import { toRaw } from "vue";
import { useRoute } from "vue-router";

export function usePlayground() {
  const route = useRoute();
  const { id } = route.params;
  const {
    data: playgroundData,
    isFetched,
    error,
  } = useQuery({
    queryKey: ["playgrounds", id],
    queryFn: getPlayground,
    // keepPreviousData: true,
  });
  console.log("use playgroundg ", playgroundData, isFetched);
  const data = toRaw(playgroundData);
  return { data, isFetched, error };
}

async function getPlayground() {
  const { data, error, status } = await supabase
    .from("playgrounds")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
