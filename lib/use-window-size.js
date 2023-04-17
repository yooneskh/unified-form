import { ref, onMounted, onUnmounted } from 'vue';


export function useWindowSize() {

  const width = ref(0);
  const height = ref(0);


  function getSize() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }


  onMounted(() => {
    getSize();
    window.addEventListener('resize', getSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', getSize);
  });


  return {
    width,
    height,
  };

}