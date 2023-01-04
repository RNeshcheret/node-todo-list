const protobuf = require("protobufjs");
const express = require("express");
const path = require("path");

const BadRequestError = require("../errors/bad-request");

const CONTENT_TYPE = "application/protobuf";

const protoPath = path.resolve("proto", "todo.proto");

let protoTypes;

async function loadProtobuf() {
  try {
    protoTypes = await protobuf.load(protoPath);
  } catch (error) {
    console.error(error);
  }
}

loadProtobuf();

function decodeRequest(req) {
  const { body, headers } = req;
  const hasBody = Boolean(headers["content-length"]);

  if (!hasBody) return body;
  const messageType = extractMessageType(req);

  const protoType = protoTypes.lookupType(messageType);
  try {
    const decodedData = protoType.decode(body);
    return decodedData;
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Failed to decoded protobuf data");
  }
}

function useProtobuf(req) {
  const { query, headers } = req;
  if ("proto" in query) return true;

  const contentType = headers["content-type"];
  return contentType && contentType.includes(CONTENT_TYPE);
}

function extractMessageType(req) {
  const { headers } = req;
  const [_, messageType] = headers["content-type"]?.split("messageType=") || [];
  if (!messageType)
    throw new BadRequestError(
      "Protobuf decoder error: messageType is missing in headers"
    );
  return messageType;
}

function protobufParser(req, res, next) {
  const isProtobuf = useProtobuf(req);
  if (!isProtobuf) return next();

  const toProtobuf = (type, data) => {
    if (!type || !data)
      throw new Error(`toProtobuf requires 2 args: type and data`);

    const protobufType = protoTypes.lookupType(type);
    const err = protobufType.verify(data);
    if (err) throw new Error(`Protobuf Verification Error: ${err}`);
    const encodedData = protobufType.encode(data).finish();

    res.set("Content-Type", `${CONTENT_TYPE}; messageType=${type}`);
    res.send(encodedData);
  };

  req.body = decodeRequest(req);
  res.protobuf = toProtobuf;

  next();
}

const bodyParser = express.raw({ type: CONTENT_TYPE });

module.exports = [bodyParser, protobufParser];
