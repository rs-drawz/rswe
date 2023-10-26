const data=require('../data/products.json');
const product=require('../models/productsModel');
const dotenv=require('dotenv');
const connectdb=require('../config/database');

dotenv.config({path:'backend/config/config.env'});
connectdb();

const seeder=async ()=>{
    try {
        await product.deleteMany();
    console.log("previous product deleted!")
    await product.insertMany(data);
    console.log("products added!");
    } catch (error) {
        console.log(error.message);
    }
    process.exit()
    
}

seeder()