
import React, {useCallback, useState, useRef} from 'react';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";

import {useInfiniteScroll} from './lib/InfiniteScrollHook';

export default function MyGallery({ photos })
{
    const [pageNum, setPageNum] = useState(0);
    const [loadedAll, setLoadedAll] = useState(false);
    const PAGE_SIZE = 10;
    const total_pages = photos.length / PAGE_SIZE;
    const loadMorePhotos = () => {
      if (pageNum > total_pages) {
        setLoadedAll(true);
        return;
      }
  
      setPageNum(pageNum + 1);
    };

    if(pageNum < 1 && photos.length > 0) {
        loadMorePhotos();
    }

    let bottomBoundaryRef = useRef(null);
    useInfiniteScroll(bottomBoundaryRef, () => loadMorePhotos());

    // Lightbox stuff
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);
    
    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    let images = [];
    if(loadedAll) {
        images = photos;
    } else {
        images = photos.slice(0, pageNum * PAGE_SIZE);
    }
    if (images.length < 1) {
        return (<>Keine Bilder vorhanden</>);
    }
    return (
        <>
        {loadedAll ? "Fertig" : "Mehr Bilder"} {images.length}/{photos.length} Pagenum: {pageNum}
        <Gallery photos={images} onClick={openLightbox} />
        {loadedAll ? "Fertig" : "Mehr Bilder"} {images.length}/{photos.length} Pagenum: {pageNum}
        {!loadedAll && (
            <div className="loading-msg" id="msg-loading-more">
            Loading
            </div>
        )}
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
        <div id='page-bottom-boundary' style={{ border: '1px solid red' }} ref={bottomBoundaryRef}></div>
        </>
    )
}