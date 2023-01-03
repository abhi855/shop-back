const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image.jpg" ||
    file.mimetype === "image/png"
  )
    cb(null, true);
  else cb(null, false);
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "seeds" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
//CREATE

router.post(
  "/",
  verifyTokenAndAdmin,
  upload.single("productImage"),
  async (req, res) => {
    req.body.img = req.file.path;
    // console.log(req);
    const newProduct = new Product(req.body);

    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      // products = await Product.find({
      //   categories: {
      //     $in: [qCategory],
      //   },
      // });
      products = await Product.find({
        category: {
          $eq: qCategory,
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
