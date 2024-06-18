// import { useRef, useEffect } from "react";

import { onMounted, onUnmounted } from "vue";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = ref();
  console.log("ref", ref);
  //   useEffect(
  //     function () {
  //       function handleClick(e) {
  //         if (ref.current && !ref.current.contains(e.target)) {
  //           handler();
  //         }
  //       }
  //       document.addEventListener("click", handleClick, listenCapturing);

  //       return () =>
  //         document.removeEventListener("click", handleClick, listenCapturing);
  //     },
  //     [handler, listenCapturing]
  //   );
  onMounted(() => {
    document.addEventListener("click", handleClick, listenCapturing);

    //   return () =>
    //     document.removeEventListener("click", handleClick, listenCapturing);
  });
  // })
  function handleClick(e) {
    if (ref.current && !ref.current.contains(e.target)) {
      handler();
    }
  }
  //   return ref;
  onUnmounted(() => {
    document.removeEventListener("click", handleClick, listenCapturing);
  });
}
