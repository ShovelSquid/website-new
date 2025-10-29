// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const display = document.getElementById('display');
    const description = document.getElementById('description');
    let galleryItems = [];

    // Function to load gallery data from JSON
    async function loadGalleryData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data.galleryItems;
        } catch (error) {
            console.error('Error loading gallery data:', error);
            return [];
        }
    }

    // Function to create a gallery item element
    function createGalleryItem(itemData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-type', itemData.type);
        galleryItem.setAttribute('data-src', itemData.src);
        galleryItem.setAttribute('data-description', itemData.description);

        if (itemData.type === 'image') {
            const img = document.createElement('img');
            img.src = itemData.src;
            img.title = itemData.title;
            galleryItem.appendChild(img);
        } else if (itemData.type === 'video') {
            const video = document.createElement('video');
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.controls = false;
            video.disablePictureInPicture = true;
            video.controlsList = "nodownload nofullscreen noremoteplayback";
            const source = document.createElement('source');
            source.src = itemData.src;
            source.type = 'video/mp4';
            video.appendChild(source);
            galleryItem.appendChild(video);
        }

        // Add click event listener
        galleryItem.addEventListener('click', function() {
            updateShowcase(this);
        });

        return galleryItem;
    }

    // Function to update display and description
    function updateShowcase(item) {
        const type = item.getAttribute('data-type');
        const src = item.getAttribute('data-src');
        const desc = item.getAttribute('data-description');

        // Clear previous content
        display.innerHTML = '';
        
        // Create and add new content based on type
        if (type === 'image') {
            const img = document.createElement('img');
            img.src = src;
            img.title = 'Gallery item';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            display.appendChild(img);
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = false;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.disablePictureInPicture = true;
            video.controlsList = "nodownload nofullscreen noremoteplayback";
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'contain';
            display.appendChild(video);
        }

        // Update description
        description.innerHTML = `<p>${desc}</p>`;

        // Remove active class from all items and add to current
        galleryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    }

    // Function to add a new gallery item (for future use)
    function addGalleryItem(itemData) {
        const newItem = createGalleryItem(itemData);
        gallery.appendChild(newItem);
        galleryItems.push(newItem);
        return newItem;
    }

    // Initialize gallery
    async function initializeGallery() {
        const galleryData = await loadGalleryData();
        
        // Clear existing gallery items
        gallery.innerHTML = '';
        galleryItems = [];

        // Create and add gallery items
        galleryData.forEach(itemData => {
            const galleryItem = createGalleryItem(itemData);
            gallery.appendChild(galleryItem);
            galleryItems.push(galleryItem);
        });

        // Initialize with first item if available
        if (galleryItems.length > 0) {
            updateShowcase(galleryItems[0]);
        }
    }

    // Start the gallery initialization
    initializeGallery();
});

// Optional: Keyboard navigation
document.addEventListener('keydown', function(e) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const activeItem = document.querySelector('.gallery-item.active');
    
    if (!activeItem) return;
    
    const currentIndex = Array.from(galleryItems).indexOf(activeItem);
    let nextIndex;
    
    switch(e.key) {
        case 'ArrowRight':
            nextIndex = (currentIndex + 1) % galleryItems.length;
            break;
        case 'ArrowLeft': 
            nextIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            break;
        default:
            return;
    }
    
    if (nextIndex !== undefined) {
        updateShowcase(galleryItems[nextIndex]);
        e.preventDefault();
    }
});

function addGalleryItem(myclass, type, src, descriptionText) {
    const gallery = document.getElementById('gallery');
    const item = document.createElement('div');
    item.className = myclass;
    item.setAttribute('data-type', type);
    item.setAttribute('data-src', src);
    item.setAttribute('data-description', descriptionText);
    item.innerHTML = type === 'image' ? `<img src="${src}" title="Gallery item">` : `<video src="${src}" muted></video>`;

    item.addEventListener('click', function() {
        updateShowcase(this);
    });
}

// Discord username copy functionality
function copyDiscordUsername() {
    const username = 'shovelsquid';
    
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(username).then(function() {
            showCopyNotification('Discord username copied to clipboard!');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(username, 'Discord username copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(username, 'Discord username copied to clipboard!');
    }
}

// Email address copy functionality
function copyEmailAddress() {
    const email = 'kaelenscook@shovelsquid.com';
    
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function() {
            showCopyNotification('Email address copied to clipboard!');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(email, 'Email address copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(email, 'Email address copied to clipboard!');
    }
}

// Fallback copy method
function fallbackCopyTextToClipboard(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification(successMessage || 'Copied to clipboard!');
        } else {
            showCopyNotification('Copy failed. Text: ' + text);
        }
    } catch (err) {
        showCopyNotification('Copy failed. Text: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(48, 143, 146, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}