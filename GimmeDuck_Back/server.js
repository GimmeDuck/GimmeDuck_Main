const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/key');
const {User} = require('./models/User');
//const test = require('./Router/test');

var cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({ limit : "10mb", extended: true , parameterLimit : 50000}));
app.use(bodyParser.json({ limit : "10mb" , extended : true}))
//app.use(express.limit('4M'));

//app.use("/test", test);

const mongooes = require('mongoose');
mongooes.connect(config.mongoURI,{})
.then(()=>console.log('MongoDB Connected..'))
.catch(err => console.log(err));

app.get('/egg', (req, res) => {
    User.findOne({ address : req.query.egg}, (err, user) => {
        if(!err) {
            res.send(data)
        } else {
            res.send(err)
        }
    })
})

app.post('/login',(req,res)=>{
    //요청된 이메일을 데베에서 찾는다
    User.findOne({ address : req.body.address}, (err, user) => {
        if(!user){

            const user = new User({ address: req.body.address, egg: 0 });

            //mongoDB의 save 메소드
            user.save((err, userInfo) => {
                if(err) return res.json({ success: false, err})
                return res.status(200).json({
                    success: true,
                    egg: userInfo.egg
                })  
            //성공 시, status 200번(성공)을 알리고, 제이슨 전달
            })

            
        } else {

            return res.status(200).json({
                loginSuccess : true,
                message : "성공",
                egg: user.egg
            })
        }

        

    });
});

const { Readable } = require('stream');
var axios = require('axios');
var FormData = require('form-data');


const pinFileToIPFS = async function(image) {

    var data = new FormData();
    
    const buffer = new Buffer.from(image, "base64");
    const stream = Readable.from(buffer);

    data.append('file', stream,"GimmeDuck.png");
    data.append('pinataOptions', '{"cidVersion": 1}');
    data.append('pinataMetadata', '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}');

    var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    headers: { 
        pinata_api_key: '71084a474f5f077b9699',
        pinata_secret_api_key: '5d9f0655f5b4194f2e0bfac0eff6fe0005a242c8af72bed24cf78cb61619d7da',
        ...data.getHeaders()
    },
    data : data
    };


    const res = await axios(config);
    console.log(res.data);
    console.log('!!!!!!!!!!!!!!!!!!!start!!!!!!!!!!!!!!!!!!');


    var data2 = JSON.stringify({
        "pinataOptions": {
          "cidVersion": 1
        },
        "pinataMetadata": {
          "name": "Real_Test",
          "keyvalues": {
            "customKey": "customValue",
            "customKey2": "customValue2"
          }
        },
        "pinataContent": {
            "name":"Gimme_duck_test",
            "description":"Gimme_duck upload practice!",
            "image":"ipfs://"+res.data.IpfsHash,
            "attributes":[{"trait_type": "Unknown","value": "Unknown"}]
        }
      });
      
      var config2 = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
          'Content-Type': 'application/json', 
          pinata_api_key: '71084a474f5f077b9699',
            pinata_secret_api_key: '5d9f0655f5b4194f2e0bfac0eff6fe0005a242c8af72bed24cf78cb61619d7da'
        },
        data : data2
      };

      
    const res2 = await axios(config2);
    console.log(res2.data);

} 

app.post('/test', (req, res) => {
    const image = req.body.image;
    pinFileToIPFS(image);
});


const port = 8000; 
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});