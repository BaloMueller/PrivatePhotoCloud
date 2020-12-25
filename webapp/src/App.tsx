import React, {useEffect} from 'react';
import Gallery from 'react-photo-gallery';

const sampledata = {
    groups: [
    "Kamera-Uploads/2015-02/.gallery/"
    ],
    items: [
    {
    name: "2015-02-28 16.50.24-1.jpg",
    asset: "https://smueller.blob.core.windows.net/private/Kamera-Uploads%2F2015-02%2F2015-02-28%2016.50.24-1.jpg",
    url: "http://localhost:7071/api/redirect/Kamera-Uploads%2F2015-02%2F2015-02-28%2016.50.24-1.jpg",
    thumbnail: "http://localhost:7071/api/redirect/Kamera-Uploads%2F2015-02%2F.gallery%2F2015-02-28%2016.50.24-1.jpg",
    contentType: "image/jpeg",
    created: "2019-01-21T14:08:08.000Z"
    },
    {
    name: "2015-02-28 16.50.24.jpg",
    asset: "https://smueller.blob.core.windows.net/private/Kamera-Uploads%2F2015-02%2F2015-02-28%2016.50.24.jpg",
    url: "http://localhost:7071/api/redirect/Kamera-Uploads%2F2015-02%2F2015-02-28%2016.50.24.jpg",
    thumbnail: "http://localhost:7071/api/redirect/Kamera-Uploads%2F2015-02%2F.gallery%2F2015-02-28%2016.50.24.jpg",
    contentType: "image/jpeg",
    created: "2019-01-21T14:08:08.000Z"
    },
    {
    name: "2015-02-28 18.14.01.jpg",
    asset: "https://smueller.blob.core.windows.net/private/Kamera-Uploads%2F2015-02%2F2015-02-28%2018.14.01.jpg",
    url: "http://localhost:7071/api/redirect/Kamera-Uploads%2F2015-02%2F2015-02-28%2018.14.01.jpg",
    thumbnail: "http://localhost:7071/api/redirect/Kamera-Uploads%2F2015-02%2F.gallery%2F2015-02-28%2018.14.01.jpg",
    contentType: "image/jpeg",
    created: "2019-01-21T14:08:08.000Z"
    }
]};

export default function App()
{
    let photos = [];
    useEffect(() => {
        fetch('http://localhost:7071/api/storage_controller?q=Kamera-Uploads%2F2015-02%2F')
            .then(response => response.json())
            .then(data => photos = sampledata.items);
    })

    return <Gallery photos={photos} />;
}