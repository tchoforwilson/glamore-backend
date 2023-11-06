import APIFeatures from '../utilities/apiFeatures.js';
import AppError from '../utilities/appError.js';
import catchAsync from '../utilities/catchAsync.js';
import eStatusCode from '../utilities/enums/e.status-code.js';

/**
 * @breif Create a new document in a database collection
 * @param {Collection} Model -> Database collection
 * @returns {Function}
 */
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(eStatusCode.CREATED).json({
      status: 'success',
      message: 'Successfully created',
      data: doc,
    });
  });

/**
 * @breif Get a single document in the database collection
 * using the parameter request id
 * @param {Collection} Model -> Database collection
 * @param {String} popOptions -> Populate option for other collection
 * @returns {Function}
 */
const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // 1. Get doc by id
    let query = await Model.findById(req.params.id);

    // 2. Populate
    if (popOptions) query = query.populate(popOptions);

    // 3. Perform query
    const doc = await query;

    // 4. Check if item exists
    if (!doc)
      return next(
        new AppError('document not found with that ID!', eStatusCode.NOT_FOUND),
      );

    // 5. Send response
    res.status(eStatusCode.SUCCESS).json({
      status: 'success',
      message: 'Data receive successfully',
      data: doc,
    });
  });

/**
 * @breif Update a single a documnent in the collection, from the
 * request paramter id
 * @param {Collection} Model -> Database collection
 * @returns {Function}
 */
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(
        new AppError('No document found with that ID!', eStatusCode.NOT_FOUND),
      );

    res.status(eStatusCode.SUCCESS).json({
      status: 'success',
      message: 'Successfully updated',
      data: doc,
    });
  });

/**
 * @breif Retrieve all document from a collection, documents are filtered, sorted,
 * limited and paginated
 * @param {Collection} Model -> Database collection
 * @returns {Function}
 */
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. To allow for nested GET routes
    let filter = {};

    if (req.params.categoryId) filter = { category: req.params.categoryId };
    if (req.params.productId) filter = { product: req.params.productId };
    if (req.params.storeId) filter = { store: req.params.storeId };
    if (req.params.orderId) filter = { order: req.params.orderId };
    if (req.params.reviewId) filter = { review: req.params.reviewId };
    if (req.params.cartId) filter = { cart: req.params.cartId };

    // 2. Build search regex for name
    if (req.query.name)
      req.query['name'] = { $regex: req.query.name, $options: 'i' };

    // 3. EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    // 4. SEND RESPONSE
    res.status(eStatusCode.SUCCESS).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });

/**
 * @breif Delete a single document in the database collection
 * @param {Collection} Model -> Database collection
 * @returns function
 */
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Get item
    const doc = await Model.findByIdAndDelete(req.params.id);

    // 2. Check if item exists
    if (!doc) {
      return next(
        new AppError('No document found with that ID', eStatusCode.NOT_FOUND),
      );
    }

    // 3. Send response
    res.status(eStatusCode.NO_CONTENT).json({
      status: 'success',
      message: 'Successfully deleted',
      data: null,
    });
  });

/**
 * @breif Search for documents marching request name
 * @param {Collection} Model Database collection/model
 * @returns {function}
 */
const search = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Get the query
    const { q } = req.query;

    // 2. Get the results
    const results = await Model.find({
      name: { $regex: q, $options: 'i' },
    });

    // 3. Send the response
    res.status(200).json({
      status: 'success',
      data: results,
    });
  });

/**
 * @brief Count the number of document in a collection
 * @param {Collection} Model  Database model/collection
 * @returns {Function}
 */
const count = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Build filter
    let filtered = {};
    if (req.params.categoryId) filtered.category = req.params.categoryId;
    if (req.params.storeId) filtered.store = req.params.storeId;
    if (req.params.productId) filtered.product = req.params.productId;

    // 2. Create search query
    const searchQuery = { ...filtered, ...req.query };
    console.log(searchQuery);

    // 3. Execute query
    const count = await Model.count(searchQuery);

    // 4. Send response
    res.status(200).json({
      status: 'success',
      data: count,
    });
  });

export default {
  createOne,
  getOne,
  updateOne,
  getAll,
  deleteOne,
  search,
  count,
};
