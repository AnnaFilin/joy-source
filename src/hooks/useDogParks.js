import { useQuery } from "@tanstack/vue-query";
import { supabase } from "../../supabase";

// export function useDogParks() {
//   const { data } = useQuery({
//     queryKey: ["dogGardens"],
//     queryFn: getDogParks,
//   });
//   // return useQuery(["dogGardens"], async () => {
//   //   const { data, error } = await supabase.from("dogGardens").select("*");
//   //   if (error) {
//   //     throw new Error(error.message);
//   //   }
//   return data;
//   // });
// }

export async function getDogParks() {
  const { data, error } = await supabase.from("dogGardens").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
