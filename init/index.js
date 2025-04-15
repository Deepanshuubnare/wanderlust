const mongoose =require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("connection is created!")
}).catch((err)=>{
    console.log(err);
})
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"67f928775ec2b228aeff8f1e"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initilised!");
};
initDB();