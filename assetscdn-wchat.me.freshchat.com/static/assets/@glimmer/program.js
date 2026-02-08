define("@glimmer/program", ["exports", "ember-babel", "@glimmer/util", "@glimmer/manager", "@glimmer/opcode-compiler"], function (_exports, _emberBabel, _util, _manager, _opcodeCompiler) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RuntimeProgramImpl = _exports.RuntimeOpImpl = _exports.RuntimeHeapImpl = _exports.RuntimeConstantsImpl = _exports.HeapImpl = _exports.ConstantsImpl = _exports.CompileTimeConstantImpl = void 0;
  _exports.artifacts = artifacts;
  _exports.hydrateHeap = hydrateHeap;

  /**
   * Default component template, which is a plain yield
   */
  var DEFAULT_TEMPLATE_BLOCK = [[[18
  /* Yield */
  , 1, null]], ['&default'], false, []];
  var DEFAULT_TEMPLATE = {
    // random uuid
    id: '1b32f5c2-7623-43d6-a0ad-9672898920a1',
    moduleName: '__default__.hbs',
    block: JSON.stringify(DEFAULT_TEMPLATE_BLOCK),
    scope: null,
    isStrictMode: true
  };
  var WELL_KNOWN_EMPTY_ARRAY = Object.freeze([]);
  var STARTER_CONSTANTS = (0, _util.constants)(WELL_KNOWN_EMPTY_ARRAY);
  var WELL_KNOWN_EMPTY_ARRAY_POSITION = STARTER_CONSTANTS.indexOf(WELL_KNOWN_EMPTY_ARRAY);

  var CompileTimeConstantImpl = /*#__PURE__*/function () {
    function CompileTimeConstantImpl() {
      // `0` means NULL
      this.values = STARTER_CONSTANTS.slice();
      this.indexMap = new Map(this.values.map(function (value, index) {
        return [value, index];
      }));
    }

    var _proto = CompileTimeConstantImpl.prototype;

    _proto.value = function value(_value) {
      var indexMap = this.indexMap;
      var index = indexMap.get(_value);

      if (index === undefined) {
        index = this.values.push(_value) - 1;
        indexMap.set(_value, index);
      }

      return index;
    };

    _proto.array = function array(values) {
      if (values.length === 0) {
        return WELL_KNOWN_EMPTY_ARRAY_POSITION;
      }

      var handles = new Array(values.length);

      for (var i = 0; i < values.length; i++) {
        handles[i] = this.value(values[i]);
      }

      return this.value(handles);
    };

    _proto.toPool = function toPool() {
      return this.values;
    };

    return CompileTimeConstantImpl;
  }();

  _exports.CompileTimeConstantImpl = CompileTimeConstantImpl;

  var RuntimeConstantsImpl = /*#__PURE__*/function () {
    function RuntimeConstantsImpl(pool) {
      this.values = pool;
    }

    var _proto2 = RuntimeConstantsImpl.prototype;

    _proto2.getValue = function getValue(handle) {
      return this.values[handle];
    };

    _proto2.getArray = function getArray(value) {
      var handles = this.getValue(value);
      var reified = new Array(handles.length);

      for (var i = 0; i < handles.length; i++) {
        var n = handles[i];
        reified[i] = this.getValue(n);
      }

      return reified;
    };

    return RuntimeConstantsImpl;
  }();

  _exports.RuntimeConstantsImpl = RuntimeConstantsImpl;

  var ConstantsImpl = /*#__PURE__*/function (_CompileTimeConstantI) {
    (0, _emberBabel.inheritsLoose)(ConstantsImpl, _CompileTimeConstantI);

    function ConstantsImpl() {
      var _this$reifiedArrs;

      var _this;

      _this = _CompileTimeConstantI.apply(this, arguments) || this;
      _this.reifiedArrs = (_this$reifiedArrs = {}, _this$reifiedArrs[WELL_KNOWN_EMPTY_ARRAY_POSITION] = WELL_KNOWN_EMPTY_ARRAY, _this$reifiedArrs);
      _this.defaultTemplate = (0, _opcodeCompiler.templateFactory)(DEFAULT_TEMPLATE)(); // Used for tests and debugging purposes, and to be able to analyze large apps
      // This is why it's enabled even in production

      _this.helperDefinitionCount = 0;
      _this.modifierDefinitionCount = 0;
      _this.componentDefinitionCount = 0;
      _this.helperDefinitionCache = new WeakMap();
      _this.modifierDefinitionCache = new WeakMap();
      _this.componentDefinitionCache = new WeakMap();
      return _this;
    }

    var _proto3 = ConstantsImpl.prototype;

    _proto3.helper = function helper(definitionState, // TODO: Add a way to expose resolved name for debugging
    _resolvedName, isOptional) {
      if (_resolvedName === void 0) {
        _resolvedName = null;
      }

      var handle = this.helperDefinitionCache.get(definitionState);

      if (handle === undefined) {
        var managerOrHelper = (0, _manager.getInternalHelperManager)(definitionState, isOptional);

        if (managerOrHelper === null) {
          this.helperDefinitionCache.set(definitionState, null);
          return null;
        }

        var helper = typeof managerOrHelper === 'function' ? managerOrHelper : managerOrHelper.getHelper(definitionState);
        handle = this.value(helper);
        this.helperDefinitionCache.set(definitionState, handle);
        this.helperDefinitionCount++;
      }

      return handle;
    };

    _proto3.modifier = function modifier(definitionState, resolvedName, isOptional) {
      if (resolvedName === void 0) {
        resolvedName = null;
      }

      var handle = this.modifierDefinitionCache.get(definitionState);

      if (handle === undefined) {
        var manager = (0, _manager.getInternalModifierManager)(definitionState, isOptional);

        if (manager === null) {
          this.modifierDefinitionCache.set(definitionState, null);
          return null;
        }

        var definition = {
          resolvedName: resolvedName,
          manager: manager,
          state: definitionState
        };
        handle = this.value(definition);
        this.modifierDefinitionCache.set(definitionState, handle);
        this.modifierDefinitionCount++;
      }

      return handle;
    };

    _proto3.component = function component(definitionState, owner, isOptional) {
      var _a;

      var definition = this.componentDefinitionCache.get(definitionState);

      if (definition === undefined) {
        var manager = (0, _manager.getInternalComponentManager)(definitionState, isOptional);

        if (manager === null) {
          this.componentDefinitionCache.set(definitionState, null);
          return null;
        }

        var capabilities = (0, _manager.capabilityFlagsFrom)(manager.getCapabilities(definitionState));
        var templateFactory$$1 = (0, _manager.getComponentTemplate)(definitionState);
        var compilable = null;
        var template;

        if (!(0, _manager.managerHasCapability)(manager, capabilities, 1
        /* DynamicLayout */
        )) {
          template = (_a = templateFactory$$1 === null || templateFactory$$1 === void 0 ? void 0 : templateFactory$$1(owner)) !== null && _a !== void 0 ? _a : this.defaultTemplate;
        } else {
          template = templateFactory$$1 === null || templateFactory$$1 === void 0 ? void 0 : templateFactory$$1(owner);
        }

        if (template !== undefined) {
          template = (0, _util.unwrapTemplate)(template);
          compilable = (0, _manager.managerHasCapability)(manager, capabilities, 1024
          /* Wrapped */
          ) ? template.asWrappedLayout() : template.asLayout();
        }

        definition = {
          resolvedName: null,
          handle: -1,
          manager: manager,
          capabilities: capabilities,
          state: definitionState,
          compilable: compilable
        };
        definition.handle = this.value(definition);
        this.componentDefinitionCache.set(definitionState, definition);
        this.componentDefinitionCount++;
      }

      return definition;
    };

    _proto3.resolvedComponent = function resolvedComponent(resolvedDefinition, resolvedName) {
      var definition = this.componentDefinitionCache.get(resolvedDefinition);

      if (definition === undefined) {
        var manager = resolvedDefinition.manager,
            state = resolvedDefinition.state,
            template = resolvedDefinition.template;
        var capabilities = (0, _manager.capabilityFlagsFrom)(manager.getCapabilities(resolvedDefinition));
        var compilable = null;

        if (!(0, _manager.managerHasCapability)(manager, capabilities, 1
        /* DynamicLayout */
        )) {
          template = template !== null && template !== void 0 ? template : this.defaultTemplate;
        }

        if (template !== null) {
          template = (0, _util.unwrapTemplate)(template);
          compilable = (0, _manager.managerHasCapability)(manager, capabilities, 1024
          /* Wrapped */
          ) ? template.asWrappedLayout() : template.asLayout();
        }

        definition = {
          resolvedName: resolvedName,
          handle: -1,
          manager: manager,
          capabilities: capabilities,
          state: state,
          compilable: compilable
        };
        definition.handle = this.value(definition);
        this.componentDefinitionCache.set(resolvedDefinition, definition);
        this.componentDefinitionCount++;
      }

      return definition;
    };

    _proto3.getValue = function getValue(index) {
      return this.values[index];
    };

    _proto3.getArray = function getArray(index) {
      var reifiedArrs = this.reifiedArrs;
      var reified = reifiedArrs[index];

      if (reified === undefined) {
        var names = this.getValue(index);
        reified = new Array(names.length);

        for (var i = 0; i < names.length; i++) {
          reified[i] = this.getValue(names[i]);
        }

        reifiedArrs[index] = reified;
      }

      return reified;
    };

    return ConstantsImpl;
  }(CompileTimeConstantImpl);

  _exports.ConstantsImpl = ConstantsImpl;

  var RuntimeOpImpl = /*#__PURE__*/function () {
    function RuntimeOpImpl(heap) {
      this.heap = heap;
      this.offset = 0;
    }

    (0, _emberBabel.createClass)(RuntimeOpImpl, [{
      key: "size",
      get: function get() {
        var rawType = this.heap.getbyaddr(this.offset);
        return ((rawType & 768
        /* OPERAND_LEN_MASK */
        ) >> 8
        /* ARG_SHIFT */
        ) + 1;
      }
    }, {
      key: "isMachine",
      get: function get() {
        var rawType = this.heap.getbyaddr(this.offset);
        return rawType & 1024
        /* MACHINE_MASK */
        ? 1 : 0;
      }
    }, {
      key: "type",
      get: function get() {
        return this.heap.getbyaddr(this.offset) & 255
        /* TYPE_MASK */
        ;
      }
    }, {
      key: "op1",
      get: function get() {
        return this.heap.getbyaddr(this.offset + 1);
      }
    }, {
      key: "op2",
      get: function get() {
        return this.heap.getbyaddr(this.offset + 2);
      }
    }, {
      key: "op3",
      get: function get() {
        return this.heap.getbyaddr(this.offset + 3);
      }
    }]);
    return RuntimeOpImpl;
  }();

  _exports.RuntimeOpImpl = RuntimeOpImpl;
  var PAGE_SIZE = 0x100000;

  var RuntimeHeapImpl = /*#__PURE__*/function () {
    function RuntimeHeapImpl(serializedHeap) {
      var buffer = serializedHeap.buffer,
          table = serializedHeap.table;
      this.heap = new Int32Array(buffer);
      this.table = table;
    } // It is illegal to close over this address, as compaction
    // may move it. However, it is legal to use this address
    // multiple times between compactions.


    var _proto4 = RuntimeHeapImpl.prototype;

    _proto4.getaddr = function getaddr(handle) {
      return this.table[handle];
    };

    _proto4.getbyaddr = function getbyaddr(address) {
      return this.heap[address];
    };

    _proto4.sizeof = function sizeof(handle) {
      return _sizeof(this.table, handle);
    };

    return RuntimeHeapImpl;
  }();

  _exports.RuntimeHeapImpl = RuntimeHeapImpl;

  function hydrateHeap(serializedHeap) {
    return new RuntimeHeapImpl(serializedHeap);
  }
  /**
   * The Heap is responsible for dynamically allocating
   * memory in which we read/write the VM's instructions
   * from/to. When we malloc we pass out a VMHandle, which
   * is used as an indirect way of accessing the memory during
   * execution of the VM. Internally we track the different
   * regions of the memory in an int array known as the table.
   *
   * The table 32-bit aligned and has the following layout:
   *
   * | ... | hp (u32) |       info (u32)   | size (u32) |
   * | ... |  Handle  | Scope Size | State | Size       |
   * | ... | 32bits   | 30bits     | 2bits | 32bit      |
   *
   * With this information we effectively have the ability to
   * control when we want to free memory. That being said you
   * can not free during execution as raw address are only
   * valid during the execution. This means you cannot close
   * over them as you will have a bad memory access exception.
   */


  var HeapImpl = /*#__PURE__*/function () {
    function HeapImpl() {
      this.offset = 0;
      this.handle = 0;
      this.heap = new Int32Array(PAGE_SIZE);
      this.handleTable = [];
      this.handleState = [];
    }

    var _proto5 = HeapImpl.prototype;

    _proto5.push = function push(item) {
      this.sizeCheck();
      this.heap[this.offset++] = item;
    };

    _proto5.sizeCheck = function sizeCheck() {
      var heap = this.heap;

      if (this.offset === this.heap.length) {
        var newHeap = new Int32Array(heap.length + PAGE_SIZE);
        newHeap.set(heap, 0);
        this.heap = newHeap;
      }
    };

    _proto5.getbyaddr = function getbyaddr(address) {
      return this.heap[address];
    };

    _proto5.setbyaddr = function setbyaddr(address, value) {
      this.heap[address] = value;
    };

    _proto5.malloc = function malloc() {
      // push offset, info, size
      this.handleTable.push(this.offset);
      return this.handleTable.length - 1;
    };

    _proto5.finishMalloc = function finishMalloc(handle) {};

    _proto5.size = function size() {
      return this.offset;
    } // It is illegal to close over this address, as compaction
    // may move it. However, it is legal to use this address
    // multiple times between compactions.
    ;

    _proto5.getaddr = function getaddr(handle) {
      return this.handleTable[handle];
    };

    _proto5.sizeof = function sizeof(handle) {
      return _sizeof(this.handleTable, handle);
    };

    _proto5.free = function free(handle) {
      this.handleState[handle] = 1
      /* Freed */
      ;
    }
    /**
     * The heap uses the [Mark-Compact Algorithm](https://en.wikipedia.org/wiki/Mark-compact_algorithm) to shift
     * reachable memory to the bottom of the heap and freeable
     * memory to the top of the heap. When we have shifted all
     * the reachable memory to the top of the heap, we move the
     * offset to the next free position.
     */
    ;

    _proto5.compact = function compact() {
      var compactedSize = 0;
      var handleTable = this.handleTable,
          handleState = this.handleState,
          heap = this.heap;

      for (var i = 0; i < length; i++) {
        var offset = handleTable[i];
        var size = handleTable[i + 1] - offset;
        var state = handleState[i];

        if (state === 2
        /* Purged */
        ) {
          continue;
        } else if (state === 1
        /* Freed */
        ) {
          // transition to "already freed" aka "purged"
          // a good improvement would be to reuse
          // these slots
          handleState[i] = 2
          /* Purged */
          ;
          compactedSize += size;
        } else if (state === 0
        /* Allocated */
        ) {
          for (var j = offset; j <= i + size; j++) {
            heap[j - compactedSize] = heap[j];
          }

          handleTable[i] = offset - compactedSize;
        } else if (state === 3
        /* Pointer */
        ) {
          handleTable[i] = offset - compactedSize;
        }
      }

      this.offset = this.offset - compactedSize;
    };

    _proto5.capture = function capture(offset) {
      if (offset === void 0) {
        offset = this.offset;
      }

      // Only called in eager mode
      var buffer = slice(this.heap, 0, offset).buffer;
      return {
        handle: this.handle,
        table: this.handleTable,
        buffer: buffer
      };
    };

    return HeapImpl;
  }();

  _exports.HeapImpl = HeapImpl;

  var RuntimeProgramImpl = /*#__PURE__*/function () {
    function RuntimeProgramImpl(constants$$1, heap) {
      this.constants = constants$$1;
      this.heap = heap;
      this._opcode = new RuntimeOpImpl(this.heap);
    }

    var _proto6 = RuntimeProgramImpl.prototype;

    _proto6.opcode = function opcode(offset) {
      this._opcode.offset = offset;
      return this._opcode;
    };

    return RuntimeProgramImpl;
  }();

  _exports.RuntimeProgramImpl = RuntimeProgramImpl;

  function slice(arr, start, end) {
    if (arr.slice !== undefined) {
      return arr.slice(start, end);
    }

    var ret = new Int32Array(end);

    for (; start < end; start++) {
      ret[start] = arr[start];
    }

    return ret;
  }

  function _sizeof(table, handle) {
    {
      return -1;
    }
  }

  function artifacts() {
    return {
      constants: new ConstantsImpl(),
      heap: new HeapImpl()
    };
  }
});