import QuoteRequest from '../models/QuoteRequest.js';

// POST /api/quotes — public, submitted from the site's quote/contact forms
export async function createQuote(req, res, next) {
  try {
    if (req.user?.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot submit requests' });
    }

    const {
      clinicName,
      contactName,
      email,
      phone,
      city,
      productInterest,
      productName,
      serviceInterest,
      serviceName,
      preferredDate,
      message,
    } = req.body;

    if (!clinicName || !contactName || !email || !phone || !city) {
      return res.status(400).json({
        message: 'Clinic name, contact name, email, phone and city are required',
      });
    }

    const quote = await QuoteRequest.create({
      clinicName,
      contactName,
      email,
      phone,
      city,
      productInterest,
      productName,
      serviceInterest,
      serviceName,
      preferredDate,
      message,
    });

    res.status(201).json({ message: 'Quote request received', id: quote._id });
  } catch (err) {
    next(err);
  }
}

// GET /api/quotes — admin only, gated by requireAdminKey middleware
export async function listQuotes(req, res, next) {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/quotes/:id — admin only, update status
export async function updateQuoteStatus(req, res, next) {
  try {
    const { status } = req.body;
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ message: 'Quote request not found' });
    res.json(quote);
  } catch (err) {
    next(err);
  }
}