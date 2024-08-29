import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { supabase, supabaseUrl } from "../../supabase";

export function useUpdatePlayground() {
  const queryClient = useQueryClient();

  const { mutate: updatePlayground, isPending: isUpdating } = useMutation({
    mutationFn: ({ playgarden, image, rating, review }) =>
      uploadPhoto(playgarden, image, rating, review),
    // When mutate is called:
    onMutate: async ({ playgarden }) => {
      console.log("playgarden", playgarden);
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["playgrounds", playgarden.id],
      });
      // Snapshot the previous value
      const previousPlayground = queryClient.getQueryData([
        "playgrounds",
        playgarden.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["playgrounds", playgarden.id], playgarden);

      return { previousPlayground, playgarden };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, playgarden, context) => {
      queryClient.setQueryData(
        ["playgrounds", context.playgarden.id],
        context.previousPlayground
      );
    },
    // Always refetch after error or success:
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playgrounds"],
      });
    },
  });

  return { updatePlayground, isUpdating };
}

async function uploadPhoto(playgarden, image, rating, review) {
  let itemReviews = playgarden.reviews ? playgarden.reviews : [];
  const hasImagePath = playgarden.image?.startWith?.(supabase) || false;
  let imageName;
  let imagePath;
  if (image) {
    imageName = `${Math.random()}-${image.name}`.replaceAll("/", "");
    imagePath = hasImagePath
      ? playgarden.image
      : `${supabaseUrl}/storage/v1/object/public/playgroundsPictures/${imageName}`;
    console.log("imagePath", imagePath);
  }

  if (rating) {
    var ratingVal = rating;
  }

  try {
    const { data, error } = await supabase
      .from("playgrounds")
      .update({
        image: image ? imagePath : playgarden.image,
        rating: rating ? ratingVal : playgarden.rating,
        totalRates: rating ? playgarden.totalRates + 1 : playgarden.totalRates,
        reviews: review ? [...itemReviews, review] : itemReviews,
      })
      .eq("id", playgarden.id)
      .select();
    if (error) throw new Error("Playground could not be updated");

    if (image) {
      if (imageName) {
        const { error: errorStorage } = await supabase.storage
          .from("playgroundsPictures")
          .upload(imageName, image);
      }
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Playground rating could not be updated");
  }
}
