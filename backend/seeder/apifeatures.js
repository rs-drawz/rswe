class APIfeat{
    constructor(query,querySTR){
        this.query = query,
        this.querySTR = querySTR
    }

    search(){
        let keyword = this.querySTR.keyword?{
            name:{
                $regex:this.querySTR.keyword,
                $options:'i'
            }
        }:{};
        this.query.find({...keyword});
        return this;
    }

    filter(){
        const querystrcopy={...this.querySTR};
        const removeFields = ['keyword','limit','page'];
        removeFields.forEach(i=>delete querystrcopy[i]);
        let price = JSON.stringify(querystrcopy);
        price = price.replace(/\b(gt|gte|lt|lte)/g,i=>`$${i}`)
        this.query.find(JSON.parse(price));
        return this;      
    }

    page(count){
        const currentpage = Number(this.querySTR.page) || 1;
        const skip = count * (currentpage-1);
        this.query.limit(count).skip(skip);
        return this;
    }
}
module.exports=APIfeat;