const express = require('express');
const router = express.Router();

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { Readable } = require('stream');

const pinFileToIPFS = (image) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const buffer = Buffer.from(image);
    const stream = Readable.from(buffer);
    const filename = `an-awesome-nft_${Date.now()}.png`;
    stream.path = filename;

    const formData = new FormData();
    formData.append("file", stream);

return axios.post(url,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`,
                'pinata_api_key': "71084a474f5f077b9699",
                'pinata_secret_api_key': "5d9f0655f5b4194f2e0bfac0eff6fe0005a242c8af72bed24cf78cb61619d7da",
            }
        }
    ).then(function (response) {
        console.log("Success: ", response);
    }).catch(function (error) {
        console.log("Fail! ", error.response.data);
    });
};

router.route('/').post((req, res) => {
    const image = req.body.image;
    pinFileToIPFS(image);
});

module.exports = router;