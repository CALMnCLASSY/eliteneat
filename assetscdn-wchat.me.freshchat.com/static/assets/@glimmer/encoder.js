define("@glimmer/encoder", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.InstructionEncoderImpl = void 0;

  var InstructionEncoderImpl = /*#__PURE__*/function () {
    function InstructionEncoderImpl(buffer) {
      this.buffer = buffer;
      this.size = 0;
    }

    var _proto = InstructionEncoderImpl.prototype;

    _proto.encode = function encode(type, machine) {
      if (type > 255
      /* TYPE_SIZE */
      ) {
        throw new Error("Opcode type over 8-bits. Got " + type + ".");
      }

      var first = type | machine | arguments.length - 2 << 8
      /* ARG_SHIFT */
      ;
      this.buffer.push(first);

      for (var i = 2; i < arguments.length; i++) {
        var op = arguments[i];

        if (false
        /* DEBUG */
        && typeof op === 'number' && op > 2147483647
        /* MAX_SIZE */
        ) {
          throw new Error("Operand over 32-bits. Got " + op + ".");
        }

        this.buffer.push(op);
      }

      this.size = this.buffer.length;
    };

    _proto.patch = function patch(position, target) {
      if (this.buffer[position + 1] === -1) {
        this.buffer[position + 1] = target;
      } else {
        throw new Error('Trying to patch operand in populated slot instead of a reserved slot.');
      }
    };

    return InstructionEncoderImpl;
  }();

  _exports.InstructionEncoderImpl = InstructionEncoderImpl;
});