const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pinata_key = require('./pinata_key');

var cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({ limit : "10mb", extended: true , parameterLimit : 50000}));
app.use(bodyParser.json({ limit : "10mb" , extended : true}))


// const mongooes = require('mongoose');
// mongooes.connect(config.mongoURI,{})
// .then(()=>console.log('MongoDB Connected..'))
// .catch(err => console.log(err));

app.get('/egg', (req, res) => {
    User.findOne({ address : req.query.egg}, (err, user) => {
        if(!err) {
            res.send(data)
        } else {
            res.send(err)
        }
    })
})

var fs = require('fs');
const pinata_key = require('./pinata_key');

const pinFileToIPFS = async function(image) {
    var ipfshash;

    fs.writeFileSync('image.png', image.replace(/^data:image\/png;base64,/, ""), 'base64');

    const pinataSDK = require('@pinata/sdk');
    const pinata = pinataSDK(pinata_key.pinata_api_key, pinata_key.pinata_secret_api_key);

    var i = 8;  //gimme_duck index
    var result_ = '';
    const readableStreamForFile = fs.createReadStream('image.png');

    const options = {
        pinataMetadata: {
            name: "GIMMEDUCK_TEST"+i,
            keyvalues: {
                customKey: 'gimmeduck_test'+i,
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        console.log("File Uploaded!");
        console.log(result);
        result_ = result.IpfsHash;

        /*pin JSON to IPFS*/
        const body = {
            "name":"Gimme_duck"+i,
            "description":"Gimme_duck upload practice!",
            "image":"ipfs://"+result_,
            "attributes":[{"trait_type": "Unknown","value": "Unknown"}]
        };

        const options2 = {
            pinataMetadata: {
                name: "GIMMEDUCK_TEST_JSON"+i,
                keyvalues: {
                    customKey: 'gimmeduck_test_json',
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        pinata.pinJSONToIPFS(body, options2).then((result2) => {
            console.log("JSON Uploaded!");
            console.log(result2);
            ipfshash = result2;
        }).catch((err2) => {
            console.log(err2);
        });
        
    }).catch((err) => {
        console.log(err);
    });

    return ipfshash;
} 

app.post('/test', (req, res) => {
    const image = req.body.image;
    const result = await pinFileToIPFS(image);
    console.log(result);

    //res.send(ipfshash);
});


const port = 8000; 
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});