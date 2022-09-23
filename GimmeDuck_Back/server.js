const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/key');
const {User} = require('./models/User');
const test = require('./Router/test');
const hashlips = require('./Router/hashlips');

var cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use("/test", test);
app.use("/hashlips",hashlips);

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



const port = 8000; 
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});