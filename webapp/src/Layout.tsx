import React, {useEffect, useState, useCallback} from 'react';
import {useLocationHash} from './lib/reactHashHook';

import MyGallery from './MyGallery';


export default function Layout()
{   
    const hash = useLocationHash();
    const [photos, setPhotos] = useState([]);
    const [folders, setFolders] = useState([]);
    
    useEffect(() => {
        const encodedPath = encodeURIComponent(hash);
        fetch(`/api/storage_controller?q=${encodedPath}`)
        .then(response => response.json())
        .then(data => {
            setFolders(data.groups);
            return data.items.map((item) => ({ 
                src: item.src, 
                srcSet: [
                    `${item.thumbnail} 600w`,
                    `${item.url} 1600w`,
                ],
                sizes: ["(min-width: 550px) 30vw,(min-width: 1024px) 20vw,100vw"],
                width: 600,
                height: 600,
                key: item.name,
            }))
        })
        .then(data => setPhotos(data))
    }, [hash])
    

    return (
        <div>
            {/* Breadcrump */}
            <div className="breadcrump">
                {hash.split('/').map((seg, i, arr) => {
                    if (seg === "") return;
                    const url = arr.slice(0, i+1).join('/');
                    return (<>{ !!i && ' >> '}<a href={`#${url}/`}>{decodeURIComponent(seg)}</a></>)
                })} 
            </div>

            {folders.map((folder) => (<div><a href={`#${folder}`}>{folder}</a></div>))}
            
            <MyGallery photos={ photos } />
            
        </div>
    )
}