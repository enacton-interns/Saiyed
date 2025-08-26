// all services
const Service = require('../model/ServiceSchema');

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createService = async (req, res) => {
  try {
    //also increment by 1 shouldnt mention in req body
    const lastService = await Service.findOne().sort({ id: -1 });
    req.body.id = lastService ? lastService.id + 1 : 1;
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findOne({id: id});
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateService = async (req, res) => {
  try {
    // just like in get service we will use id as params to update service
    const service = await Service.findOneAndUpdate({id: req.params.id}, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({id:req.params.id});
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });QA
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllServices,
  createService,
  getService,
  updateService,
  deleteService
};
