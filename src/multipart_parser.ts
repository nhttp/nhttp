// Credit & Original : https://github.com/deligenius/multiparser

import { decoder, encoder } from "./utils.ts";

const encode = {
  contentType: encoder.encode("Content-Type"),
  filename: encoder.encode("filename"),
  name: encoder.encode(`name="`),
  dashdash: encoder.encode("--"),
  boundaryEqual: encoder.encode("boundary="),
  returnNewline2: encoder.encode("\r\n\r\n"),
  carriageReturn: encoder.encode("\r"),
};

interface FormFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  arrayBuffer: () => Uint8Array | Promise<Uint8Array>;
}

interface Form {
  fields: Record<string, string>;
  files: Record<string, FormFile | FormFile[]>;
}

export async function multiParser(req: Request) {
  const arrayBuf = await req.arrayBuffer();
  const buf = new Uint8Array(arrayBuf);
  const boundaryByte = getBoundary(req.headers.get("content-type") as string);
  if (!boundaryByte) {
    return undefined;
  }
  const pieces = getFieldPieces(buf, boundaryByte!);
  const form = getForm(pieces);
  return form;
}

function getForm(pieces: Uint8Array[]) {
  const form: Form = { fields: {}, files: {} };
  for (const piece of pieces) {
    const { headerByte, contentByte } = splitPiece(piece);
    const headers = getHeaders(headerByte);
    // it's a string field
    if (typeof headers === "string") {
      // empty content, discard it
      if (contentByte.byteLength === 1 && contentByte[0] === 13) {
        continue;
      } else {
        // headers = "field1"
        form.fields[headers] = decoder.decode(contentByte);
      }
    } // it's a file field
    else {
      const file: FormFile = {
        name: headers.filename,
        type: headers.contentType,
        size: contentByte.byteLength,
        // just dummy
        lastModified: Date.now() - 1000,
        arrayBuffer: () => contentByte,
      };

      // array of files
      if (form.files[headers.name] instanceof Array) {
        (<FormFile[]> form.files[headers.name]).push(file);
      } // if file exists, convert it to array
      else if (form.files[headers.name]) {
        form.files[headers.name] = [<FormFile> form.files[headers.name], file];
      } // one file only
      else {
        form.files[headers.name] = file;
      }
    }
  }
  return { ...form.fields, ...form.files };
}

function getHeaders(headerByte: Uint8Array) {
  const contentTypeIndex = byteIndexOf(headerByte, encode.contentType);

  // no contentType, it may be a string field, return name only
  if (contentTypeIndex < 0) {
    return getNameOnly(headerByte);
  } // file field, return with name, filename and contentType
  else {
    return getHeaderNContentType(headerByte, contentTypeIndex);
  }
}

function getHeaderNContentType(
  headerByte: Uint8Array,
  contentTypeIndex: number,
) {
  let headers: Record<string, string> = {};

  const contentDispositionByte = headerByte.slice(0, contentTypeIndex - 2);
  headers = getHeaderOnly(contentDispositionByte);

  // jump over Content-Type: - e.g.: Content-Type: application/octet-stream'
  const contentTypeByte = headerByte.slice(
    contentTypeIndex + encode.contentType.byteLength + 2,
  );

  headers.contentType = decoder.decode(contentTypeByte);
  return headers;
}

function getHeaderOnly(headerLineByte: Uint8Array) {
  let headers: Record<string, string> = {};

  const filenameIndex = byteIndexOf(headerLineByte, encode.filename);
  if (filenameIndex < 0) {
    headers.name = getNameOnly(headerLineByte);
  } else {
    headers = getNameNFilename(headerLineByte, filenameIndex);
  }
  return headers;
}

function getNameNFilename(headerLineByte: Uint8Array, filenameIndex: number) {
  // fetch filename first
  const nameByte = headerLineByte.slice(0, filenameIndex - 2);
  const filenameByte = headerLineByte.slice(
    filenameIndex + encode.filename.byteLength + 2,
    headerLineByte.byteLength - 1,
  );

  const name = getNameOnly(nameByte);
  const filename = decoder.decode(filenameByte);
  return { name, filename };
}

function getNameOnly(headerLineByte: Uint8Array) {
  const nameIndex = byteIndexOf(headerLineByte, encode.name);
  // jump <name="> and get string inside double quote => "string"
  const nameByte = headerLineByte.slice(
    nameIndex + encode.name.byteLength,
    headerLineByte.byteLength - 1,
  );
  return decoder.decode(nameByte);
}

function splitPiece(piece: Uint8Array) {
  const contentIndex = byteIndexOf(piece, encode.returnNewline2);
  const headerByte = piece.slice(0, contentIndex);
  const contentByte = piece.slice(contentIndex + 4);

  return { headerByte, contentByte };
}

function getFieldPieces(buf: Uint8Array, boundaryByte: Uint8Array) {
  const startBoundaryByte = concat(encode.dashdash, boundaryByte);
  const endBoundaryByte = concat(startBoundaryByte, encode.dashdash);

  const pieces = [];

  while (!startsWith(buf, endBoundaryByte)) {
    // jump over boundary + '\r\n'
    buf = buf.slice(startBoundaryByte.byteLength + 2);
    const boundaryIndex = byteIndexOf(buf, startBoundaryByte);
    // get field content piece
    pieces.push(buf.slice(0, boundaryIndex - 2)); // -2 means remove /r/n
    buf = buf.slice(boundaryIndex);
  }

  return pieces;
}

function getBoundary(contentType: string): Uint8Array | undefined {
  const contentTypeByte = encoder.encode(contentType);
  const boundaryIndex = byteIndexOf(contentTypeByte, encode.boundaryEqual);
  if (boundaryIndex >= 0) {
    // jump over 'boundary=' to get the real boundary
    const boundary = contentTypeByte.slice(
      boundaryIndex + encode.boundaryEqual.byteLength,
    );
    return boundary;
  } else {
    return undefined;
  }
}

function byteIndexOf(
  source: string | Uint8Array,
  pattern: string | Uint8Array,
  fromIndex = 0,
) {
  if (fromIndex >= source.length) {
    return -1;
  }
  if (fromIndex < 0) {
    fromIndex = Math.max(0, source.length + fromIndex);
  }
  const s = pattern[0];
  for (let i = fromIndex; i < source.length; i++) {
    if (source[i] !== s) continue;
    const pin = i;
    let matched = 1;
    let j = i;
    while (matched < pattern.length) {
      j++;
      if (source[j] !== pattern[j - pin]) {
        break;
      }
      matched++;
    }
    if (matched === pattern.length) {
      return pin;
    }
  }
  return -1;
}
function startsWith(source: Uint8Array, prefix: Uint8Array) {
  for (let i = 0, max = prefix.length; i < max; i++) {
    if (source[i] !== prefix[i]) return false;
  }
  return true;
}
function concat(...buf: Uint8Array[]) {
  let length = 0;
  for (const b of buf) {
    length += b.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const b1 of buf) {
    output.set(b1, index);
    index += b1.length;
  }
  return output;
}
