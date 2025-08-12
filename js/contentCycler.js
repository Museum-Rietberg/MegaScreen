let currentContentIndex = 0;
const contentSlides = ['slide-1', 'slide-2']; // Add more slide IDs as needed
const contentDuration = 180000; // [ms] 180000 = 3 minutes

function showNextContent() {
  // Hide current slide
  const currentSlides = document.getElementsByClassName(contentSlides[currentContentIndex]);
  for (let i = 0; i < currentSlides.length; i++) {
    currentSlides[i].classList.remove('show');
  }
  
  // Move to next slide
  currentContentIndex = (currentContentIndex + 1) % contentSlides.length;
  
  // Show next slide
  const nextSlides = document.getElementsByClassName(contentSlides[currentContentIndex]);
  for (let i = 0; i < nextSlides.length; i++) {
    nextSlides[i].classList.add('show');
  }
  
  console.log(`Content cycled to slide: ${contentSlides[currentContentIndex]}`);
}

// Initialize content cycling
function initContentCycling() {
  // Hide all slides first
  for (let slideClass of contentSlides) {
    const slides = document.getElementsByClassName(slideClass);
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove('show');
    }
  }
  
  // Show the first slide initially
  const initialSlides = document.getElementsByClassName(contentSlides[currentContentIndex]);
  for (let i = 0; i < initialSlides.length; i++) {
    initialSlides[i].classList.add('show');
  }
  
  console.log(`Content cycling initialized. Starting with slide: ${contentSlides[currentContentIndex]}`);
  console.log(`Content will cycle every ${contentDuration / 1000} seconds`);
  
  // Start cycling through content every 3 minutes
  setInterval(showNextContent, contentDuration);
}
