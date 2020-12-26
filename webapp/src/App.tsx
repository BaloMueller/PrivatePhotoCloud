import React, {useEffect, useState, useCallback} from 'react';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";


export default function App()
{
    const [photos, setPhotos] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    useEffect(() => {
        fetch('/api/storage_controller?q=Kamera-Uploads%2F2015-02%2F')
            .then(response => response.json())
            .then(data => data.items.map((item) => ({ 
                src: item.src, 
                srcSet: [
                    `${item.thumbnail} 600w`,
                    `${item.url} 1600w`,
                ],
                sizes: ["(min-width: 550px) 30vw,(min-width: 1024px) 20vw,100vw"],
                width: 600,
                height: 600,
                key: item.name,
            })))
            .then(data => setPhotos(data))
    }, [])

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
      }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    return <div>
            <Gallery photos={photos} onClick={openLightbox} />
            <ModalGateway>
            {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
                <Carousel
                currentIndex={currentImage}
                views={photos.map(x => ({
                    ...x,
                    srcset: x.srcSet,
                    caption: x.title
                }))}
                />
            </Modal>
            ) : null}
        </ModalGateway>
        </div>;
}