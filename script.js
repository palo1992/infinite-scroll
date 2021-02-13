const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;
let initialCount = 5;

//  Unsplash API
const apiKey = "BlfHjVw4m1vZk0kq2hmjMh0JjnFQJ-vEWY2SvU8s87Q";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

//  Check if images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

//  After initial load change number of loading photos from 5 to the value setted in getPhotos function
function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

//  Helper function to set attributes on Dom Elements
function setAtributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//  Create elements for links & photos, add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    
    //  Create <a> to link to unsplash
    const item = document.createElement("a");
    setAtributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    
    //  Create img for photo
    const img = document.createElement("img");
    setAtributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    
    //  event listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);
    
    //  put <img> inside <a>, put both inside imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

//  Get photos from unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    
    //  after initial loading set count of loading photos to 30
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    //  catch error here
    console.log(error);
  }
}

//  Check to see if scrolling near bottom of page, load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

getPhotos();
