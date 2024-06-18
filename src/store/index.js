import { defineStore } from "pinia";
import { supabase, supabaseUrl } from "../../supabase";
import { toRaw } from "vue"; // Import toRaw from Vue

export const useDataStore = defineStore("data", {
  state: () => ({
    playgrounds: [],
    dogParks: [],
    bikeParkings: [],
    filteredPlaygrounds: [],
    filteredDogParks: [],
    filteredBikeParkings: [],
    currentLocation: { lat: 0, lon: 0 },
    layersVisibility: {
      playgrounds: false,
      dogParks: false,
      bikeParkings: false,
    },
    isLoading: false,
  }),
  actions: {
    setCurrentLocation(latLng) {
      console.log(latLng);
      this.currentLocation.lat = latLng.lat;
      this.currentLocation.lon = latLng.lon;
    },
    async fetchData() {
      this.isLoading = true;
      try {
        const { data: playgrounds, error: errorPlaygrounds } = await supabase
          .from("playgrounds")
          .select("*");
        const { data: dogGardens, error: errorDogGardens } = await supabase
          .from("dogGardens")
          .select("*");

        const { data: bikeParkings, error: bikesError } = await supabase
          .from("bikeParkings")
          .select("*");
        this.playgrounds = playgrounds;
        this.dogParks = dogGardens;
        this.bikeParkings = bikeParkings;
        this.filteredPlaygrounds = playgrounds; // Initialize filtered lists
        this.filteredDogParks = dogGardens;
        this.filteredBikeParkings = bikeParkings;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    async updateRating(item, rating) {
      console.log("id, rating", item.id, rating);
      try {
        const { data, error } = await supabase
          .from("playgrounds")
          .update({
            rating: item.rating + rating,
            totalRates: item.totalRates + 1,
          })
          .eq("id", item.id)
          .select();
        console.log("data", data);
      } catch (error) {
        console.log(error.message);
        throw new Error("Playground rating could not be updated");
      }
    },
    async addReview(item, review) {
      console.log("id, review", item.id, review);
      const currentReviews = item.reviews || [];
      const updatedReviews = [...currentReviews, review];
      try {
        const { data, error } = await supabase
          .from("playgrounds")
          .update({
            reviews: updatedReviews,
          })
          .eq("id", item.id)
          .select();
        console.log("data", data);
      } catch (error) {
        console.log(error.message);
        throw new Error("Playground review could not be added");
      }
    },
    async uploadPhoto(item, image) {
      const hasImagePath = item.image?.startWith?.(supabase);
      console.log("id, file", item.id, image, hasImagePath);
      const imageName = `${Math.random()}-${image.name}`.replaceAll("/", "");
      console.log(imageName);
      const imagePath = hasImagePath
        ? item.image
        : `${supabaseUrl}/storage/v1/object/public/playgroundsPictures/${imageName}`;
      console.log(imagePath);
      try {
        const { data, error } = await supabase
          .from("playgrounds")
          .update({
            image: imagePath,
          })
          .eq("id", item.id)
          .select();
        if (error) throw new Error("Playground could not be updated");

        const { error: errorStorage } = await supabase.storage
          .from("playgroundsPictures")
          .upload(imageName, image);

        console.log("data", data);
      } catch (error) {
        console.log(error.message);
        throw new Error("Playground rating could not be updated");
      }
    },
    toggleLayerVisibility(layer) {
      this.layersVisibility[layer] = !this.layersVisibility[layer];
    },

    filterLocations(radius) {
      const currentLocation = L.latLng(
        this.currentLocation.lat,
        this.currentLocation.lon
      );

      this.filteredPlaygrounds = this.playgrounds.filter((point) => {
        return (
          currentLocation.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
          radius * 1000
        );
      });

      this.filteredDogParks = this.dogParks.filter(
        (point) =>
          currentLocation.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
          radius * 1000
      );
      this.filteredBikeParkings = this.bikeParkings.filter(
        (point) =>
          currentLocation.distanceTo([toRaw(point).lat, toRaw(point).lon]) <=
          radius * 1000
      );
    },
  },
});
