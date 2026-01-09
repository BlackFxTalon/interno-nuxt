<script setup>
import Splide from '@splidejs/splide'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { VueImageZoomer } from 'vue-image-zoomer'
import '@splidejs/splide/dist/css/splide.min.css'
import 'vue-image-zoomer/dist/style.css'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  showThumbnails: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: Number,
    default: 3000,
  },
  height: {
    type: String,
    default: '400px',
  },
  thumbnailSize: {
    type: String,
    default: '100px',
  },
  showArrows: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['colorChange'])

const mainSplide = ref(null)
const thumbnailSplide = ref(null)
const mainSplideInstance = ref(null)
const thumbnailSplideInstance = ref(null)
const currentSlide = ref(0)

const hasMultipleImages = computed(() => {
  return props.images && Array.isArray(props.images) && props.images.length > 1
})

// Go to specific slide
function goToSlide(index) {
  if (mainSplideInstance.value && index >= 0 && index < props.images.length) {
    try {
      mainSplideInstance.value.go(index)
      currentSlide.value = index
    }
    catch (error) {
      console.warn('Error navigating to slide:', error)
    }
  }
}

// Handle thumbnail click - used by parent or for manual navigation
function handleThumbnailClick(index) {
  if (index < 0 || index >= props.images.length)
    return

  // Navigate to the slide
  goToSlide(index)

  // Emit color change event
  if (props.images[index] && props.images[index].label) {
    emit('colorChange', props.images[index].label)
  }
}

// Initialize thumbnail carousel separately
function initThumbnailCarousel(mainCarousel) {
  if (!thumbnailSplide.value || thumbnailSplideInstance.value)
    return

  try {
    const thumbnails = new Splide(thumbnailSplide.value, {
      fixedWidth: Number.parseInt(props.thumbnailSize),
      fixedHeight: Number.parseInt(props.thumbnailSize),
      gap: '0.5rem',
      pagination: false,
      isNavigation: true,
      arrows: false,
      focus: 0,
      breakpoints: {
        768: {
          fixedWidth: Math.min(80, Number.parseInt(props.thumbnailSize)),
          fixedHeight: Math.min(80, Number.parseInt(props.thumbnailSize)),
        },
      },
    })

    // Store the thumbnail instance
    thumbnailSplideInstance.value = thumbnails

    // Mount thumbnail carousel
    thumbnails.mount()
    // Sync with main carousel
    if (mainCarousel) {
      mainCarousel.sync(thumbnails)
    }
  }
  catch (error) {
    console.warn('Error in fallback thumbnail initialization:', error)
  }
}

// Initialize Splide carousel
function initCarousel() {
  if (!hasMultipleImages.value || !mainSplide.value)
    return
  // Wait for next tick to ensure DOM is fully rendered
  nextTick(() => {
    try {
      // Main carousel
      const main = new Splide(mainSplide.value, {
        arrows: props.showArrows,
        pagination: props.showPagination,
        autoplay: props.autoplay,
        interval: props.interval,
        speed: 400,
        gap: '1rem',
        perPage: 1,
        focus: 0,
        breakpoints: {
          1200: {
            drag: false,
          },
        },
      })

      // Store the instance
      mainSplideInstance.value = main

      // Add event listeners to main carousel
      main.on('moved', (newIndex) => {
        currentSlide.value = newIndex
        if (props.images[newIndex] && props.images[newIndex].label) {
          emit('colorChange', props.images[newIndex].label)
        }
      })

      // Mount main carousel first - only if it has slides
      if (mainSplide.value.querySelector('.splide__slide')) {
        main.mount()
      }

      // Thumbnail carousel - initialize after main carousel is mounted
      if (props.showThumbnails && thumbnailSplide.value && thumbnailSplide.value.querySelector('.splide__list')) {
        // Add a small delay to ensure main carousel is fully initialized
        setTimeout(() => {
          try {
            const thumbnails = new Splide(thumbnailSplide.value, {
              fixedWidth: Number.parseInt(props.thumbnailSize),
              fixedHeight: Number.parseInt(props.thumbnailSize),
              gap: '0.5rem',
              rewind: true,
              pagination: false,
              isNavigation: true,
              arrows: false,
              focus: 0,
              breakpoints: {
                768: {
                  fixedWidth: 40,
                  fixedHeight: 40,
                },
              },
            })

            // Store the thumbnail instance
            thumbnailSplideInstance.value = thumbnails

            // Mount thumbnail carousel
            thumbnails.mount()

            // Sync after both are mounted
            if (main && thumbnails) {
              main.sync(thumbnails)
            }
          }
          catch (error) {
            console.warn('Error initializing thumbnail carousel:', error)
          }
        }, 200) // Increased delay to ensure main carousel is fully ready
      }

      // Fallback: if thumbnail carousel wasn't initialized, try again after a longer delay
      if (props.showThumbnails && !thumbnailSplideInstance.value) {
        setTimeout(() => {
          if (!thumbnailSplideInstance.value && thumbnailSplide.value) {
            initThumbnailCarousel(main)
          }
        }, 500)
      }
    }
    catch (error) {
      console.warn('Error initializing main carousel:', error)
    }
  })
}

// Expose methods to parent component
defineExpose({
  goToSlide,
  handleThumbnailClick,
})

// Watch for images changes
watch(() => props.images, () => {
  if (hasMultipleImages.value) {
    // Destroy existing carousel and reinitialize
    if (mainSplideInstance.value) {
      mainSplideInstance.value.destroy()
      mainSplideInstance.value = null
    }
    if (thumbnailSplideInstance.value) {
      thumbnailSplideInstance.value.destroy()
      thumbnailSplideInstance.value = null
    }

    // Wait for DOM update then reinitialize
    nextTick(() => {
      if (mainSplide.value) {
        initCarousel()
      }
    })
  }
}, { deep: true })

onMounted(() => {
  // Wait for the next tick to ensure all refs are properly bound
  nextTick(() => {
    if (hasMultipleImages.value && mainSplide.value) {
      initCarousel()
    }
  })
})

onUnmounted(() => {
  // Clean up Splide instances
  if (mainSplideInstance.value) {
    mainSplideInstance.value.destroy()
    mainSplideInstance.value = null
  }
  if (thumbnailSplideInstance.value) {
    thumbnailSplideInstance.value.destroy()
    thumbnailSplideInstance.value = null
  }
})
</script>

<template>
  <div class="image-carousel" :class="className">
    <!-- Main Image Carousel -->
    <div v-if="hasMultipleImages" ref="mainSplide" class="splide main-carousel">
      <div class="splide__track">
        <ul class="splide__list">
          <li v-for="(image, index) in props.images" :key="index" class="splide__slide">
            <ClientOnly>
              <VueImageZoomer
                :regular="image.url"
                :show-message="false"
                :show-message-touch="false"
                :right-click="false"
                :lazyload="index > 0"
              />
            </ClientOnly>
          </li>
        </ul>
      </div>
    </div>

    <!-- Single Image Fallback -->
    <div v-else-if="images.length > 0" class="single-image">
      <ClientOnly>
        <VueImageZoomer
          :regular="images[0].url"
          :show-message="false"
          :show-message-touch="false"
          :right-click="false"
        />
      </ClientOnly>
    </div>
    <!-- No Images Fallback -->
    <div v-else class="no-images">
      <p class="text-gray-400">
        Изображение отсутствует
      </p>
    </div>

    <!-- Thumbnails Carousel -->
    <div v-if="hasMultipleImages && showThumbnails" ref="thumbnailSplide" class="splide thumbnail-carousel">
      <div class="splide__track">
        <ul class="splide__list thumbnail-carousel__splide-list">
          <li v-for="(image, index) in images" :key="index" class="splide__slide">
            <NuxtImg
              :src="image.url"
              :alt="image.alt || `Thumbnail ${index + 1}`"
              format="webp"
              class="thumbnail-image"
              @click="handleThumbnailClick(index)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-carousel {
  .main-carousel {
    margin-bottom: 1rem;
  }

  .thumbnail-carousel {
    margin-top: 1rem;
  }

  .thumbnail-carousel__splide-list {
    flex-wrap: wrap;
  }

  .main-image {
    width: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
    cursor: pointer;
  }

  .single-image {
    @media (max-width: 768px) {
       display: flex;
       align-items: center;
       justify-content: center;
    }
  }

  .single-image :deep(img) {
    @media (max-width: 768px) {
      max-width: 500px;
    }
    @media (max-width: 500px) {
      max-width: 300px;
    }
  }
}

.main-carousel :deep(.splide__slide img) {
  @media (max-width: 768px) {
      max-width: 500px;
    }
    @media (max-width: 500px) {
      max-width: 300px;
    }
}

// Splide carousel custom styles
:deep(.splide__arrow) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    fill: #374151;
  }
}

:deep(.splide__arrow--prev) {
  left: -30px;

  @media (max-width: 768px) {
    left: -10px;
  }
}

:deep(.splide__arrow--next) {
  right: -30px;

  @media (max-width: 768px) {
    right: -10px;
  }
}

:deep(.splide__slide) {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Thumbnail styles
:deep(.splide--nav) {
  .splide__slide {
    opacity: 0.6;
    transition: opacity 0.3s ease;

    &.is-active {
      opacity: 0.8;
    }
  }
}

:deep(.splide__track--nav>.splide__list>.splide__slide.is-active) {
  border: 2px solid black;
}

// Responsive adjustments
@media (max-width: 768px) {
  :deep(.splide__arrow) {
    width: 20px;
    height: 20px;

    svg {
      width: 10px;
      height: 10px;
    }
  }
}
</style>
