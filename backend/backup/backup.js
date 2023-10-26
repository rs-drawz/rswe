exports.updateprod = async(req,res,next)=>{
    const prod=await Product.findById(req.params.id);
    if(!prod){
      res.status(401).json({
        message: "product not found"
      })
    }
    prod=await Product.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })
    res.status(200).json(
      prod
    )
  }
  ----------
  exports.updateprod = async (req, res, next) => {
    try {
      const prod = await Product.findById(req.params.id);
      
      if (!prod) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
  
      // Update the product
      const updatedProd = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true, // Returns the updated product
          runValidators: true, // Run validation on the updated data
        }
      );
  
      res.status(200).json(updatedProd);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
  exports.deleteprod = async (req, res, next) => {
    try {
      const prod = await Product.findById(req.params.id);
      
      if (!prod) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
  
      // Delete the product
      await Product.findByIdAndRemove(req.params.id);
  
      res.status(200).json({
        message: "Product deleted successfully"
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
--
  exports.deleteprod=async(res,req,next)=>{
 

    await Product.remove()
    res.status(200).json({
      message:"product sucessfully deleted"
    })
  }