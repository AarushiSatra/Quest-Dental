import Product from '../models/Product.js';
import Service from '../models/Service.js';
import QuoteRequest from '../models/QuoteRequest.js';
import User from '../models/User.js';

// GET /api/admin/summary
export async function getSummary(req, res, next) {
  try {
    const [productCount, serviceCount, customerCount, quotesByStatus, recentQuotes] =
      await Promise.all([
        Product.countDocuments(),
        Service.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        QuoteRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        QuoteRequest.find().sort({ createdAt: -1 }).limit(5),
      ]);

    const statusCounts = { new: 0, contacted: 0, closed: 0 };
    quotesByStatus.forEach((s) => {
      statusCounts[s._id] = s.count;
    });

    res.json({
      productCount,
      serviceCount,
      customerCount,
      totalRequests: statusCounts.new + statusCounts.contacted + statusCounts.closed,
      statusCounts,
      recentQuotes,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/customers
export async function listCustomers(req, res, next) {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-passwordHash -resetOtpHash -pendingEmailOtpHash')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    next(err);
  }
}