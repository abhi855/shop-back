const Product = require("../models/Product");
var sharp = require("sharp");
const path = require("path");
const fs = require("fs");

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
    cb(null, "product" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1.5 * 1024 * 1024 },
});
//CREATE

router.post(
  "/",
  verifyTokenAndAdmin,
  upload.single("productImage"),
  async (req, res) => {
    console.log(req.file);
    if (req.file) {
      req.body.img = req.file.path;

      const dir = path.join(__dirname, "..");

      await sharp(dir + `/uploads/${req.file.filename}`)
        .resize({ width: 275, height: 325, options: { fit: "fill" } })
        .jpeg({ quality: 100 })
        .toFile(dir + `/uploads/thumb_${req.file.filename}`)
        .then(() => {
          req.body.thumb = `uploads/thumb_${req.file.filename}`;
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });

      // Configuring Preview Image
      await sharp(dir + `/uploads/${req.file.filename}`)
        .resize(800, 1000, { fit: "fill" })
        .jpeg({ quality: 100 })
        .toFile(dir + `/uploads/preview_${req.file.filename}`)
        .then(() => {
          req.body.preview = `uploads/preview_${req.file.filename}`;
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }

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
router.put(
  "/:id",
  verifyTokenAndAdmin,
  upload.single("productImage"),
  async (req, res) => {
    try {
      if (req.file) {
        const f = imageDelete(req, res, () => {});
        req.body.img = req.file.path;

        const dir = path.join(__dirname, "..");

        await sharp(dir + `/uploads/${req.file.filename}`)
          .resize({ width: 275, height: 325, options: { fit: "fill" } })
          .jpeg({ quality: 100 })
          .toFile(dir + `/uploads/thumb_${req.file.filename}`)
          .then(() => {
            req.body.thumb = `uploads/thumb_${req.file.filename}`;
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });

        // Configuring Preview Image
        await sharp(dir + `/uploads/${req.file.filename}`)
          .resize(800, 1000, { fit: "fill" })
          .jpeg({ quality: 100 })
          .toFile(dir + `/uploads/preview_${req.file.filename}`)
          .then(() => {
            req.body.preview = `uploads/preview_${req.file.filename}`;
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
      console.log(req.body);
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      console.log(updatedProduct);
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//DELETE
const imageDelete = async (req, res, next) => {
  const dir = path.join(__dirname, "..");
  var product;
  try {
    product = await Product.findById(req.params.id);

    console.log(product);
    fs.unlink(dir + "/" + product.img, (err) => {
      if (err) console.log(err);
    });
    fs.unlink(dir + "/" + product.thumb, (err) => {
      if (err) console.log(err);
    });
    fs.unlink(dir + "/" + product.preview, (err) => {
      if (err) console.log(err);
    });
    next();
  } catch (e) {
    console.log(e, "Hello");
    res.status(500).json(e);
  }
};
router.delete("/:id", verifyTokenAndAdmin, imageDelete, async (req, res) => {
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
