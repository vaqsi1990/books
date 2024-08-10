const Product = require('../moddel/product')
const handler = require('../middleware/handler')

exports.addProduct = handler( async( req, res, next) => {
    try {
        const {name, author, sale,  quantity, category, description, price}  = req.body;
        switch (true) {
            case !name:
              return res.json({ error: "Name is required" });
            case !author:
              return res.json({ error: "Author is required" });
        
              case !quantity:
                return res.json({ error: "Quantity is required" });
                case !category:
                  return res.json({ error: "Category is required" });
         
            case !description:
              return res.json({ error: "Description is required" });

           
            case !price:
              return res.json({ error: "Price is required" });
          }

          const product = new Product({...req.body})
          await product.save()
          res.json(product)
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Internal server error" });
    }
} )

exports.updateProduct = handler(
  async (req, res) => {
    try {
      const updateData = {};
      const fields = ['name', 'sale',  'author', 'quantity', 'category', 'description', 'price', 'image', ];

      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


exports.removeProduct = handler( async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        res.json(product)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
} )

exports.fetchProducts = handler( async(req, res, next) => {
    try {
       const pageSize = 6
       const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
      const count = await Product.countDocuments({ ...keyword });
      const products = await Product.find({ ...keyword }).limit(pageSize);
  
      res.json({
        products,
        page: 1,
        pages: Math.ceil(count / pageSize),
        hasMore: false,
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
} )


exports.singleProduct= handler( async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            return res.json(product);
          } else {
            res.status(404);
            throw new Error("Product not found");
          }

    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Product not found" }); 
    }
} )


exports.fetchAllProducts = handler(async (req, res) => {
    try {
      const products = await Product.find({})
      .populate('category', 'name')
        .limit(12)
        .sort({ createAt: -1 });
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });

  exports.addProductReview = handler(async (req, res, next) => {
    try {
      const { rating, comment } = req.body;
      const product = await Product.findById(req.params.id);
      if (product) {
        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };
        
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
        
        await product.save();
        res.status(201).json({ message: "Review added" });      
      } else {
        res.status(404);
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });


 
  
  exports.topProduct = handler( async(req, res, next) => {
    try {
        const products = await Product.find({})
        .sort({rating: -1}).limit()
        res.json(products)
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  } )

  exports.fetchNewProducts = handler(async (req, res) => {
    try {
      const products = await Product.find().sort({ _id: -1 }).limit(5);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json(error.message);
    }
  });


  exports.filter = handler( async(req, res, next) => {
    try {
        const { checked, radio } = req.body;
    
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    
        const products = await Product.find(args);
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
      }
  })


