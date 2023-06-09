import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

const ipfs = create({ host: 'localhost', port: '5001' }); // Initialize IPFS client with the appropriate endpoint

const Form = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const auth =
        "Basic " +
        Buffer.from(
            "2DQRq820rLbznhFlkIbTkuYAyCS" + ":" + "33d97cf6366f9565421e36ff7e018e60"
        ).toString("base64");

    const client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
            authorization: auth,
        },
    });

    const uploadOnIpfs = async (e) => {
        let dataStringify = JSON.stringify(e);
        const ipfsResult = await client.add(dataStringify);
        // @Disha If you want to add name after the url or generated Cid then add 
        // "?filename=gamer_bull.json"
        const contentUri = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}?filename=gamer_bull.json`;
        return contentUri;
    }




    const uploadImageOnIpfs = async () => {
        const { cid } = await client.add(image); // Upload the image file to IPFS
        const imageUrl = `https://superfun.infura-ipfs.io/ipfs/${cid}?filename=gamer_bull.png`;
        return imageUrl;
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageUrl = await uploadImageOnIpfs();
        console.log('Uploaded Image URL:', imageUrl);

        const formData = {
            title: title,
            description: description,
            image: `imageUrl?filename=gamer_bull.png`
        };

        let metadataurl = await uploadOnIpfs(formData);
        console.log('metadataurl', metadataurl);

        setTitle('');
        setDescription('');
        setImage(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" value={title} onChange={handleTitleChange} required />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={description} onChange={handleDescriptionChange} required />
            </div>
            <div>
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;
