const Category = require('../moddel/category')
const handler = require('../middleware/handler')
exports.create = handler(
    async (req, res, next) => {
      try {
        const { name } = req.body;
    
        if (!name) {
          return res.json({ error: "Name is required" });
        }
    
        const existingCategory = await Category.findOne({ name });
    
        if (existingCategory) {
          return res.json({ error: "Already exists" });
        }
    
        const category = await new Category({ name }).save();
        res.json(category);
      } catch (error) {
        console.log(error);
        return res.status(400).json(error);
      }
    }
)

exports.updateCategory = handler(
    async (req, res, next) => {
        try {
            const { name } = req.body;
            const { id } = req.params;
        
            const category = await Category.findOne({ _id: id });
        
            if (!category) {
              return res.status(404).json({ error: "Category not found" });
            }
        
            category.name = name;
        
            const updatedCategory = await category.save();
            res.json(updatedCategory);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
          }
    }
)

exports.removeCategory = handler(
    async (req, res, next) => {
        try {
           const remove = await Category.findByIdAndDelete(req.params.categoryId)
           res.json(remove)
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
          }
    }
)

exports.allCategory = handler(
    async(req, res, next) => {
        try {
            const all= await Category.find({})
            res.json(all)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
)

exports.readCategory = handler(
    async(req, res, next) => {


        try {
            const category = await Category.findOne({ _id: req.params.id }).populate('name')
            res.json(category);
          } catch (error) {
            console.log(error);
            return res.status(400).json(error.message);
          }
    }
)