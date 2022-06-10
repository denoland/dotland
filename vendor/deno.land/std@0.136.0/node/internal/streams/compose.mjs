// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent and Node contributors. All rights reserved. MIT license.
// deno-lint-ignore-file

import { destroyer } from "./destroy.mjs";
import { isNodeStream, isReadable, isWritable } from "./utils.mjs";
import { pipeline } from "./pipeline.mjs";
import {
  AbortError,
  ERR_INVALID_ARG_VALUE,
  ERR_MISSING_ARGS,
} from "../errors.ts";
import Duplex from "./duplex.mjs";

// This is needed for pre node 17.
class ComposeDuplex extends Duplex {
  constructor(options) {
    super(options);

    // https://github.com/nodejs/node/pull/34385

    if (options?.readable === false) {
      this._readableState.readable = false;
      this._readableState.ended = true;
      this._readableState.endEmitted = true;
    }

    if (options?.writable === false) {
      this._writableState.writable = false;
      this._writableState.ending = true;
      this._writableState.ended = true;
      this._writableState.finished = true;
    }
  }
}

function compose(...streams) {
  if (streams.length === 0) {
    throw new ERR_MISSING_ARGS("streams");
  }

  if (streams.length === 1) {
    return Duplex.from(streams[0]);
  }

  const orgStreams = [...streams];

  if (typeof streams[0] === "function") {
    streams[0] = Duplex.from(streams[0]);
  }

  if (typeof streams[streams.length - 1] === "function") {
    const idx = streams.length - 1;
    streams[idx] = Duplex.from(streams[idx]);
  }

  for (let n = 0; n < streams.length; ++n) {
    if (!isNodeStream(streams[n])) {
      // TODO(ronag): Add checks for non streams.
      continue;
    }
    if (n < streams.length - 1 && !isReadable(streams[n])) {
      throw new ERR_INVALID_ARG_VALUE(
        `streams[${n}]`,
        orgStreams[n],
        "must be readable",
      );
    }
    if (n > 0 && !isWritable(streams[n])) {
      throw new ERR_INVALID_ARG_VALUE(
        `streams[${n}]`,
        orgStreams[n],
        "must be writable",
      );
    }
  }

  let ondrain;
  let onfinish;
  let onreadable;
  let onclose;
  let d;

  function onfinished(err) {
    const cb = onclose;
    onclose = null;

    if (cb) {
      cb(err);
    } else if (err) {
      d.destroy(err);
    } else if (!readable && !writable) {
      d.destroy();
    }
  }

  const head = streams[0];
  const tail = pipeline(streams, onfinished);

  const writable = !!isWritable(head);
  const readable = !!isReadable(tail);

  // TODO(ronag): Avoid double buffering.
  // Implement Writable/Readable/Duplex traits.
  // See, https://github.com/nodejs/node/pull/33515.
  d = new ComposeDuplex({
    // TODO (ronag): highWaterMark?
    writableObjectMode: !!head?.writableObjectMode,
    readableObjectMode: !!tail?.writableObjectMode,
    writable,
    readable,
  });

  if (writable) {
    d._write = function (chunk, encoding, callback) {
      if (head.write(chunk, encoding)) {
        callback();
      } else {
        ondrain = callback;
      }
    };

    d._final = function (callback) {
      head.end();
      onfinish = callback;
    };

    head.on("drain", function () {
      if (ondrain) {
        const cb = ondrain;
        ondrain = null;
        cb();
      }
    });

    tail.on("finish", function () {
      if (onfinish) {
        const cb = onfinish;
        onfinish = null;
        cb();
      }
    });
  }

  if (readable) {
    tail.on("readable", function () {
      if (onreadable) {
        const cb = onreadable;
        onreadable = null;
        cb();
      }
    });

    tail.on("end", function () {
      d.push(null);
    });

    d._read = function () {
      while (true) {
        const buf = tail.read();

        if (buf === null) {
          onreadable = d._read;
          return;
        }

        if (!d.push(buf)) {
          return;
        }
      }
    };
  }

  d._destroy = function (err, callback) {
    if (!err && onclose !== null) {
      err = new AbortError();
    }

    onreadable = null;
    ondrain = null;
    onfinish = null;

    if (onclose === null) {
      callback(err);
    } else {
      onclose = callback;
      destroyer(tail, err);
    }
  };

  return d;
}

export default compose;
