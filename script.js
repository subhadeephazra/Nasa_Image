const form = document.getElementById("search-form");
const list = document.getElementsByTagName("ul")[0];

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("beforeunload", function () {
        localStorage.removeItem("savedData");
    });
    fetchNASAData();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = document.getElementById("search-input").value;
    fetchNASAData(date);
    form.reset();
});

async function fetchNASAData(date) {
    const apiKey = "nyecVfdfCD1f0knFHqzSMnxAwqwH0g0NHXdLTHsE";
    let urlDate;
    if (date) {
        urlDate = date;
    } else {
        const currentDate = new Date().toISOString().split("T")[0];
        urlDate = currentDate;
    }
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${urlDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data.code === 400) {
            alert(data.msg);
        } else {
            displayImageInUI(data);
            addToSearchHistory(urlDate);
            saveSearch(urlDate, data);
        }
    } catch (error) {
        alert(error);
    }
};

function displayImageInUI(data) {
    const image = document.getElementById("image");
    const video = document.getElementById("video");
    const title = document.getElementById("h3");
    const para = document.getElementById("para");
    if (data.media_type === "image") {
        image.style.display = "block";
        video.style.display = "none";
        image.src = data.url;
    } else if (data.media_type === "video") {
        video.style.display = "block";
        image.style.display = "none";
        video.src = data.url;
    }
    title.textContent = data.title;
    para.textContent = data.explanation;
}

function saveSearch(date, data) {
    let savedData = JSON.parse(localStorage.getItem('savedData')) || {};
    savedData[date] = data;
    localStorage.setItem('savedData', JSON.stringify(savedData));
}

function addToSearchHistory(date) {
    const historyList = document.getElementById("search-history");
    const listItem = document.createElement("li");
    listItem.textContent = date;
    listItem.setAttribute("id", date);
    historyList.append(listItem);
}

list.addEventListener("click", (event) => {
    event.preventDefault();
    const id = event.target.id;
    let savedData = JSON.parse(localStorage.getItem("savedData"));
    displayImageInUI(savedData[id]);
});
