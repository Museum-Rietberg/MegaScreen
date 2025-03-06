let currentIndex = 0;
const languages = ['content-de', 'content-en', 'content-fr'];
const duration = 60000; // [ms] 60000 = 1 minute

function showNextLanguage() {
  const currentElements = document.getElementsByClassName(languages[currentIndex]);
  for (let i = 0; i < currentElements.length; i++) {
    currentElements[i].classList.remove('show');
  }
  currentIndex = (currentIndex + 1) % languages.length;
  const nextElements = document.getElementsByClassName(languages[currentIndex]);
  for (let i = 0; i < nextElements.length; i++) {
    nextElements[i].classList.add('show');
  }
}