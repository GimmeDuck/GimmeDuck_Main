const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    address: {
        type: String,
        trim:true,  //공백 없애줌
        unique: 1  //이메일 하나씩만 가능하게 
    },
    egg : {
        type : Number
    }
    
})


const User = mongoose.model('User', userSchema)  //몽구스로 User모델 생성
module.exports = { User }  //모델을 다른 파일에서 쓸 수 있게 export 함 