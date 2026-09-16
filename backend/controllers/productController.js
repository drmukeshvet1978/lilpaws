const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/Product');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all products (public: active only, admin: ?all=true)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, featured, all } = req.query;
  const query = {};
  if (!all) query.isActive = true;
  if (category) query.category = category;
  if (featured) query.isFeatured = true;

  const products = await Product.find(query).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, products });
});

const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const product = await Product.findOne({
    $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, isAvailable, isFeatured, isActive, displayOrder } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Product name is required');
  }

  let slug = slugify(name, { lower: true, strict: true });
  const existing = await Product.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  let images = [];
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'lilpaws/products')));
    images = uploads.map((r) => ({ url: r.secure_url, publicId: r.public_id, altText: name }));
  }

  const product = await Product.create({
    name,
    slug,
    description,
    category,
    price: price || null,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isFeatured: isFeatured || false,
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: displayOrder || 0,
    images,
  });

  res.status(201).json({ success: true, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = ['name', 'description', 'category', 'price', 'isAvailable', 'isFeatured', 'isActive', 'displayOrder'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  if (req.body.name && req.body.name !== product.name) {
    let slug = slugify(req.body.name, { lower: true, strict: true });
    const existing = await Product.findOne({ slug, _id: { $ne: product._id } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;
    product.slug = slug;
  }

  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'lilpaws/products')));
    const newImages = uploads.map((r) => ({ url: r.secure_url, publicId: r.public_id, altText: product.name }));
    product.images = [...product.images, ...newImages];
  }

  await product.save();
  res.json({ success: true, product });
});

// @desc    Remove a single image from a product
// @route   DELETE /api/products/:id/images/:publicId
const removeProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const { publicId } = req.params;
  await deleteFromCloudinary(publicId);
  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();
  res.json({ success: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await Promise.all(product.images.map((img) => deleteFromCloudinary(img.publicId)));
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  removeProductImage,
  deleteProduct,
};
