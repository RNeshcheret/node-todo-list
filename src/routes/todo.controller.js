const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const {
  findAll,
  getById,
  markAsDoneItem,
  deleteItem,
  createItem,
} = require("../service");
const { getPagination } = require("../utils/query");

async function getItemByIdOrThrow(req) {
  const { id } = req.params;
  const item = await getById(id);
  if (!item) throw new NotFoundError();
  return item;
}

async function findAllHttp(req, res) {
  const pageParams = getPagination(req.query);
  const { done } = req.query;
  const items = await findAll({ done, ...pageParams });
  return formatResponse(res, items, "TodoItems");
}

async function createItemHttp(req, res) {
  const { body } = req;
  if (!body.text) throw new BadRequestError(`Text field is required`);

  const createdItem = await createItem(body);
  res.status(201);

  return formatResponse(res, createdItem);
}

async function getByIdHttp(req, res) {
  const item = await getItemByIdOrThrow(req);
  const mapped = {
    text: item.text,
    id: item.id,
    done: item.done,
    sds: item.__v,
    ssss: item._id,
  };
  // console.log({ item, mapped });
  return formatResponse(res, item);
}

async function markAsDoneHttp(req, res) {
  const item = await getItemByIdOrThrow(req);
  await markAsDoneItem(item);
  return res.send({ ok: true });
}

async function deleteByIdHttp(req, res) {
  const item = await getItemByIdOrThrow(req);
  await deleteItem(item);
  return res.send({ ok: true });
}

const formatResponse = (res, data, protobufType = "TodoItem") => {
  if (!res.protobuf) return res.send(data);

  const toObject = (item) => (item.toObject ? item.toObject() : item);
  if (Array.isArray(data))
    return res.protobuf(protobufType, {
      items: data.map(toObject),
    });

  return res.protobuf(protobufType, toObject(data));
};

module.exports = {
  findAllHttp,
  getByIdHttp,
  deleteByIdHttp,
  markAsDoneHttp,
  createItemHttp,
};
