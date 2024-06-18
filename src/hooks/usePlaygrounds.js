import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";

// export function usePlaygrounds() {
//   const { data } = useQuery({
//     queryKey: ["playgrounds"],
//     queryFn: getPlaygrounds,
//   });
//   // return useQuery(["dogGardens"], async () => {
//   //   const { data, error } = await supabase.from("dogGardens").select("*");
//   //   if (error) {
//   //     throw new Error(error.message);
//   //   }
//   return data;
//   // return useQuery(["playgrounds"], async () => {
//   //   const { data, error } = await supabase.from("playgrounds").select("*");
//   //   if (error) {
//   //     throw new Error(error.message);
//   //   }
//   //   return data;
//   // });
// }

export async function getPlaygrounds() {
  const { data, error } = await supabase.from("playgrounds").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
