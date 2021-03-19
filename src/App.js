import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listArtworks } from './graphql/queries';
import { createArtwork as createArtworkMutation, deleteArtwork as deleteArtworkMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '', price: '' };

function App() {
    const [artworks, setArtworks] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchArtworks();
    }, []);

    async function fetchArtworks() {
        const apiData = await API.graphql({ query: listArtworks });
        const artworksFromAPI = apiData.data.listArtworks.items;
        await Promise.all(
            artworksFromAPI.map(async (note) => {
                if (note.image) {
                    const image = await Storage.get(note.image);
                    note.image = image;
                }
                return note;
            })
        );
        setArtworks(apiData.data.listArtworks.items);
    }

    async function createArtwork() {
        if (!formData.name || !formData.description || !formData.price) return;
        await API.graphql({ query: createArtworkMutation, variables: { input: formData } });
        if (formData.image) {
            const image = await Storage.get(formData.image);
            formData.image = image;
        }
        setArtworks([...artworks, formData]);
        setFormData(initialFormState);
    }

    async function deleteArtwork({ id }) {
        const newArtworksArray = artworks.filter((note) => note.id !== id);
        setArtworks(newArtworksArray);
        await API.graphql({ query: deleteArtworkMutation, variables: { input: { id } } });
    }

    async function onChange(e) {
        if (!e.target.files[0]) return;
        const file = e.target.files[0];
        setFormData({ ...formData, image: file.name });
        await Storage.put(file.name, file);
        fetchArtworks();
    }

    return (
        <div className='App'>
            <h1>My Artworks App</h1>
            <input type='file' onChange={onChange} />
            <input
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Artwork name'
                value={formData.name}
            />
            <input
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder='Artwork description'
                value={formData.description}
            />
            <input
                type='number'
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder='Artwork Price'
                value={formData.price}
            />
            <button onClick={createArtwork}>Create Artwork</button>
            <div style={{ marginBottom: 30 }}>
                {artworks.map((artwork) => (
                    <div key={artwork.id || artwork.name}>
                        <h2>{artwork.name}</h2>
                        <p>{artwork.description}</p>
                        <p>{artwork.price}</p>
                        <button onClick={() => deleteArtwork(artwork)}>Delete artwork</button>
                        {artwork.image && <img src={artwork.image} alt='artpsace chicago artwork for sale' style={{ width: 400 }} />}
                    </div>
                ))}
            </div>
            <AmplifySignOut />
        </div>
    );
}

export default withAuthenticator(App);
