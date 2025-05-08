let cards = document.querySelectorAll('.card');
let likeButton = document.getElementById('like');
let dislikeButton = document.getElementById('dislike');
let infoButton = document.getElementById('info');

let activeCardIndex = 0;

// Add the 'active' class to the first card
cards[activeCardIndex].classList.add('active');

// Handle the "Like" and "Dislike" buttons
likeButton.addEventListener('click', () => swipeCard('right'));
dislikeButton.addEventListener('click', () => swipeCard('left'));

// Handle the "More Info" button
infoButton.addEventListener('click', () => toggleMoreInfo());

function swipeCard(direction) {
    const activeCard = cards[activeCardIndex];

    // Add swipe effect (left or right)
    if (direction === 'right') {
        activeCard.classList.add('swiped-right');
    } else {
        activeCard.classList.add('swiped-left');
    }

    // Remove 'active' class from the current card
    activeCard.classList.remove('active');

    // Move to the next card
    activeCardIndex++;

    // Check if we have more cards to display
    if (activeCardIndex < cards.length) {
        const nextCard = cards[activeCardIndex];
        nextCard.classList.add('active');
    } else {
        // If no more cards, reset
        setTimeout(() => {
            activeCardIndex = 0;
            cards.forEach(card => card.classList.remove('swiped-left', 'swiped-right', 'active'));
            cards[activeCardIndex].classList.add('active');
        }, 500);
    }
}

// Toggle the display of the "more-info" paragraph
function toggleMoreInfo() {
    const activeCard = cards[activeCardIndex];
    const moreInfo = activeCard.querySelector('.more-info');
    moreInfo.style.display = (moreInfo.style.display === 'none' || moreInfo.style.display === '') ? 'block' : 'none';
}
