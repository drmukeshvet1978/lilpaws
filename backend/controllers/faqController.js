const asyncHandler = require('express-async-handler');
const FAQ = require('../models/FAQ');

const getFaqs = asyncHandler(async (req, res) => {
  const { all } = req.query;
  const query = all ? {} : { isActive: true };
  const faqs = await FAQ.find(query).sort({ displayOrder: 1, createdAt: 1 });
  res.json({ success: true, faqs });
});

const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, isActive, displayOrder } = req.body;
  if (!question || !answer) {
    res.status(400);
    throw new Error('Question and answer are required');
  }
  const faq = await FAQ.create({ question, answer, isActive: isActive !== undefined ? isActive : true, displayOrder: displayOrder || 0 });
  res.status(201).json({ success: true, faq });
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  ['question', 'answer', 'isActive', 'displayOrder'].forEach((f) => {
    if (req.body[f] !== undefined) faq[f] = req.body[f];
  });
  await faq.save();
  res.json({ success: true, faq });
});

const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  await faq.deleteOne();
  res.json({ success: true, message: 'FAQ deleted' });
});

module.exports = { getFaqs, createFaq, updateFaq, deleteFaq };
