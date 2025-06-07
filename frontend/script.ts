const albumsContainer = document.querySelector('.photos_container');
const albumsList = document.querySelector('.album_list_body');

const templates = [{
   first:
    `
    <div>
    <h3 class="album_title">{{title}}</h3>
    <div class="album_container">{{photos}}</div>
    </div>
    `
},
]

type Album = {
    photos: Photo[];
    name: string;
    description: string;
    dateCreated: string;
}

type Photo = {
    id: number;
    name: string;
    url: string;
}

const album : Album = {
    photos: [{
        id: 1,
        name: "image",
        url: "https://postimg.cc/rKQcYhKw"
    }],
    name: "First Album",
    description: "My first album",
    dateCreated: "07.06.2025"
};

function albumRender (album: Album) {
    
}