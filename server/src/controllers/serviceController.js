import Service from '../models/Service.js';

export async function listServices(req, res, next) {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function getServiceBySlug(req, res, next) {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    next(err);
  }
}

// POST /api/services — admin only
export async function createService(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/services/:id — admin only
export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/services/:id — admin only
export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
}