import mongoose from 'mongoose';
import { FAQ } from '../models/FAQ.js';
import { booleanField, orderField, textField } from '../utils/validation.js';

export function buildFallbackFAQs() {
  return [
    {
      _id: 'faq-fallback-1',
      question: 'What are your delivery timelines across Dubai and the UAE?',
      answer: 'In-stock materials are delivered within 24 to 48 hours across Dubai, Sharjah, and Ajman. Deliveries to Abu Dhabi, Ras Al Khaimah, Fujairah, and Umm Al Quwain are completed within 2 to 3 business days. Urgent same-day site dispatches and coordinated crane offloading for large commercial projects can also be arranged upon request.',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'faq-fallback-2',
      question: 'Can interior designers and contractors request physical material sample boxes?',
      answer: 'Yes, we provide complimentary VIP architectural sample boxes for registered interior designers, consultants, and contractors. Each box includes genuine cut samples of our SPC flooring, flexible stone veneers, PU rock panels, and WPC fluted louvers alongside full technical specification sheets, delivered to your office or job site within 24 to 48 hours.',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'faq-fallback-3',
      question: 'What is the Minimum Order Quantity (MOQ) for wholesale trade supply?',
      answer: 'There is zero minimum order quantity on in-stock warehouse inventory—you can purchase from a single box or panel up to full 20ft/40ft container volumes. Tiered wholesale contractor discounts apply automatically for full-pallet and multi-unit villa project volumes.',
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'faq-fallback-4',
      question: 'Are Classical Decor ID materials certified waterproof and fire retardant for UAE codes?',
      answer: 'Yes, our SPC rigid core flooring is 100% waterproof, termite-proof, and rated for high-humidity coastal environments. Our WPC cladding and PU stone panels feature Class B1 fire-retardant certification, non-toxic eco formulations, and full compliance with UAE building interior safety requirements.',
      order: 4,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'faq-fallback-5',
      question: 'Do you supply matching installation trims, profiles, and adhesives?',
      answer: 'Yes, we stock comprehensive collections of color-matched aluminum edge trims, skirting boards, stair nosing, structural bonding silicon, and expansion profiles designed specifically for seamless installation with our surfaces.',
      order: 5,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];
}

export async function getFAQs(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const showAll = req.query.all === 'true' && req.user?.role === 'admin';
      const query = showAll ? {} : { isActive: true };
      const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 });
      // Empty is authoritative: do not republish defaults after all FAQs are
      // disabled or deleted by the administrator.
      return res.json(faqs);
    }

    res.set('X-Data-Source', 'bundled');
    return res.json(req.query.all === 'true' ? [] : buildFallbackFAQs());
  } catch (error) {
    console.error('getFAQs error:', error.message);
    if (req.query.all === 'true') return res.status(503).json({ message: 'Could not load saved FAQs.' });
    res.set('X-Data-Source', 'bundled');
    return res.json(buildFallbackFAQs());
  }
}

export async function createFAQ(req, res) {
  try {
    const { question, answer, order, isActive } = req.body || {};
    const cleanQuestion = textField(question ?? '', 'Question', { required: true });
    const cleanAnswer = textField(answer ?? '', 'Answer', { required: true });

    let resolvedOrder;
    if (order === undefined || order === '') {
      const highest = await FAQ.findOne().sort({ order: -1 }).select('order');
      resolvedOrder = (highest?.order || 0) + 1;
    } else resolvedOrder = orderField(order);

    const faq = await FAQ.create({
      question: cleanQuestion,
      answer: cleanAnswer,
      order: resolvedOrder,
      isActive: booleanField(isActive)
    });

    return res.status(201).json(faq);
  } catch (error) {
    console.error('createFAQ error:', error.message);
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    const message = status === 400 ? error.message : 'Failed to create FAQ.';
    return res.status(status).json({ message });
  }
}

export async function updateFAQ(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid FAQ ID.' });
    }

    const payload = {};
    const body = req.body || {};
    if (body.question !== undefined) payload.question = textField(body.question, 'Question', { required: true });
    if (body.answer !== undefined) payload.answer = textField(body.answer, 'Answer', { required: true });
    if (body.order !== undefined) payload.order = orderField(body.order);
    if (body.isActive !== undefined) payload.isActive = booleanField(body.isActive);

    const faq = await FAQ.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    return res.json(faq);
  } catch (error) {
    console.error('updateFAQ error:', error.message);
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return res.status(status).json({ message: status === 400 ? error.message : 'Failed to update FAQ.' });
  }
}

export async function deleteFAQ(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid FAQ ID.' });
    }

    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    return res.json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    console.error('deleteFAQ error:', error.message);
    const message = process.env.NODE_ENV === 'production' ? 'Failed to delete FAQ.' : error.message;
    return res.status(500).json({ message });
  }
}

export async function reorderFAQs(req, res) {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || !items.length || items.length > 1000) {
      return res.status(400).json({ message: 'Invalid reorder payload. Array of { id, order } required.' });
    }

    const ids = new Set();
    const bulkOps = items.map(item => {
      if (!item || typeof item.id !== 'string' || !mongoose.isValidObjectId(item.id) || ids.has(item.id)) {
        throw Object.assign(new Error('Every FAQ must have a unique, valid ID.'), { status: 400 });
      }
      ids.add(item.id);
      return {
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: orderField(item.order) } }
        }
      };
    });

    if (await FAQ.countDocuments({ _id: { $in: [...ids] } }) !== ids.size) {
      return res.status(404).json({ message: 'One or more FAQs no longer exist. Refresh before reordering.' });
    }
    await FAQ.bulkWrite(bulkOps);

    const updated = await FAQ.find().sort({ order: 1, createdAt: 1 });
    return res.json(updated);
  } catch (error) {
    console.error('reorderFAQs error:', error.message);
    return res.status(error.status || 500).json({ message: error.status ? error.message : 'Failed to reorder FAQs.' });
  }
}
