'use strict';

var require$$0 = require('react');
var addons = require('@storybook/addons');
var components = require('@storybook/components');

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
var f=require$$0,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
	function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

var reactJsxRuntime_development = {};

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_development;

function requireReactJsxRuntime_development () {
	if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
	hasRequiredReactJsxRuntime_development = 1;

	if (process.env.NODE_ENV !== "production") {
	  (function() {

	var React = require$$0;

	// ATTENTION
	// When adding new symbols to this file,
	// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
	// The Symbol used to tag the ReactElement-like types.
	var REACT_ELEMENT_TYPE = Symbol.for('react.element');
	var REACT_PORTAL_TYPE = Symbol.for('react.portal');
	var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
	var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
	var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
	var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
	var REACT_CONTEXT_TYPE = Symbol.for('react.context');
	var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
	var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
	var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
	var REACT_MEMO_TYPE = Symbol.for('react.memo');
	var REACT_LAZY_TYPE = Symbol.for('react.lazy');
	var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	var FAUX_ITERATOR_SYMBOL = '@@iterator';
	function getIteratorFn(maybeIterable) {
	  if (maybeIterable === null || typeof maybeIterable !== 'object') {
	    return null;
	  }

	  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

	  if (typeof maybeIterator === 'function') {
	    return maybeIterator;
	  }

	  return null;
	}

	var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

	function error(format) {
	  {
	    {
	      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      printWarning('error', format, args);
	    }
	  }
	}

	function printWarning(level, format, args) {
	  // When changing this logic, you might want to also
	  // update consoleWithStackDev.www.js as well.
	  {
	    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
	    var stack = ReactDebugCurrentFrame.getStackAddendum();

	    if (stack !== '') {
	      format += '%s';
	      args = args.concat([stack]);
	    } // eslint-disable-next-line react-internal/safe-string-coercion


	    var argsWithFormat = args.map(function (item) {
	      return String(item);
	    }); // Careful: RN currently depends on this prefix

	    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
	    // breaks IE9: https://github.com/facebook/react/issues/13610
	    // eslint-disable-next-line react-internal/no-production-logging

	    Function.prototype.apply.call(console[level], console, argsWithFormat);
	  }
	}

	// -----------------------------------------------------------------------------

	var enableScopeAPI = false; // Experimental Create Event Handle API.
	var enableCacheElement = false;
	var enableTransitionTracing = false; // No known bugs, but needs performance testing

	var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
	// stuff. Intended to enable React core members to more easily debug scheduling
	// issues in DEV builds.

	var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

	var REACT_MODULE_REFERENCE;

	{
	  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
	}

	function isValidElementType(type) {
	  if (typeof type === 'string' || typeof type === 'function') {
	    return true;
	  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


	  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
	    return true;
	  }

	  if (typeof type === 'object' && type !== null) {
	    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
	    // types supported by any Flight configuration anywhere since
	    // we don't know which Flight build this will end up being used
	    // with.
	    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
	      return true;
	    }
	  }

	  return false;
	}

	function getWrappedName(outerType, innerType, wrapperName) {
	  var displayName = outerType.displayName;

	  if (displayName) {
	    return displayName;
	  }

	  var functionName = innerType.displayName || innerType.name || '';
	  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
	} // Keep in sync with react-reconciler/getComponentNameFromFiber


	function getContextName(type) {
	  return type.displayName || 'Context';
	} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


	function getComponentNameFromType(type) {
	  if (type == null) {
	    // Host root, text node or just invalid type.
	    return null;
	  }

	  {
	    if (typeof type.tag === 'number') {
	      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
	    }
	  }

	  if (typeof type === 'function') {
	    return type.displayName || type.name || null;
	  }

	  if (typeof type === 'string') {
	    return type;
	  }

	  switch (type) {
	    case REACT_FRAGMENT_TYPE:
	      return 'Fragment';

	    case REACT_PORTAL_TYPE:
	      return 'Portal';

	    case REACT_PROFILER_TYPE:
	      return 'Profiler';

	    case REACT_STRICT_MODE_TYPE:
	      return 'StrictMode';

	    case REACT_SUSPENSE_TYPE:
	      return 'Suspense';

	    case REACT_SUSPENSE_LIST_TYPE:
	      return 'SuspenseList';

	  }

	  if (typeof type === 'object') {
	    switch (type.$$typeof) {
	      case REACT_CONTEXT_TYPE:
	        var context = type;
	        return getContextName(context) + '.Consumer';

	      case REACT_PROVIDER_TYPE:
	        var provider = type;
	        return getContextName(provider._context) + '.Provider';

	      case REACT_FORWARD_REF_TYPE:
	        return getWrappedName(type, type.render, 'ForwardRef');

	      case REACT_MEMO_TYPE:
	        var outerName = type.displayName || null;

	        if (outerName !== null) {
	          return outerName;
	        }

	        return getComponentNameFromType(type.type) || 'Memo';

	      case REACT_LAZY_TYPE:
	        {
	          var lazyComponent = type;
	          var payload = lazyComponent._payload;
	          var init = lazyComponent._init;

	          try {
	            return getComponentNameFromType(init(payload));
	          } catch (x) {
	            return null;
	          }
	        }

	      // eslint-disable-next-line no-fallthrough
	    }
	  }

	  return null;
	}

	var assign = Object.assign;

	// Helpers to patch console.logs to avoid logging during side-effect free
	// replaying on render function. This currently only patches the object
	// lazily which won't cover if the log function was extracted eagerly.
	// We could also eagerly patch the method.
	var disabledDepth = 0;
	var prevLog;
	var prevInfo;
	var prevWarn;
	var prevError;
	var prevGroup;
	var prevGroupCollapsed;
	var prevGroupEnd;

	function disabledLog() {}

	disabledLog.__reactDisabledLog = true;
	function disableLogs() {
	  {
	    if (disabledDepth === 0) {
	      /* eslint-disable react-internal/no-production-logging */
	      prevLog = console.log;
	      prevInfo = console.info;
	      prevWarn = console.warn;
	      prevError = console.error;
	      prevGroup = console.group;
	      prevGroupCollapsed = console.groupCollapsed;
	      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

	      var props = {
	        configurable: true,
	        enumerable: true,
	        value: disabledLog,
	        writable: true
	      }; // $FlowFixMe Flow thinks console is immutable.

	      Object.defineProperties(console, {
	        info: props,
	        log: props,
	        warn: props,
	        error: props,
	        group: props,
	        groupCollapsed: props,
	        groupEnd: props
	      });
	      /* eslint-enable react-internal/no-production-logging */
	    }

	    disabledDepth++;
	  }
	}
	function reenableLogs() {
	  {
	    disabledDepth--;

	    if (disabledDepth === 0) {
	      /* eslint-disable react-internal/no-production-logging */
	      var props = {
	        configurable: true,
	        enumerable: true,
	        writable: true
	      }; // $FlowFixMe Flow thinks console is immutable.

	      Object.defineProperties(console, {
	        log: assign({}, props, {
	          value: prevLog
	        }),
	        info: assign({}, props, {
	          value: prevInfo
	        }),
	        warn: assign({}, props, {
	          value: prevWarn
	        }),
	        error: assign({}, props, {
	          value: prevError
	        }),
	        group: assign({}, props, {
	          value: prevGroup
	        }),
	        groupCollapsed: assign({}, props, {
	          value: prevGroupCollapsed
	        }),
	        groupEnd: assign({}, props, {
	          value: prevGroupEnd
	        })
	      });
	      /* eslint-enable react-internal/no-production-logging */
	    }

	    if (disabledDepth < 0) {
	      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
	    }
	  }
	}

	var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
	var prefix;
	function describeBuiltInComponentFrame(name, source, ownerFn) {
	  {
	    if (prefix === undefined) {
	      // Extract the VM specific prefix used by each line.
	      try {
	        throw Error();
	      } catch (x) {
	        var match = x.stack.trim().match(/\n( *(at )?)/);
	        prefix = match && match[1] || '';
	      }
	    } // We use the prefix to ensure our stacks line up with native stack frames.


	    return '\n' + prefix + name;
	  }
	}
	var reentry = false;
	var componentFrameCache;

	{
	  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
	  componentFrameCache = new PossiblyWeakMap();
	}

	function describeNativeComponentFrame(fn, construct) {
	  // If something asked for a stack inside a fake render, it should get ignored.
	  if ( !fn || reentry) {
	    return '';
	  }

	  {
	    var frame = componentFrameCache.get(fn);

	    if (frame !== undefined) {
	      return frame;
	    }
	  }

	  var control;
	  reentry = true;
	  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

	  Error.prepareStackTrace = undefined;
	  var previousDispatcher;

	  {
	    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
	    // for warnings.

	    ReactCurrentDispatcher.current = null;
	    disableLogs();
	  }

	  try {
	    // This should throw.
	    if (construct) {
	      // Something should be setting the props in the constructor.
	      var Fake = function () {
	        throw Error();
	      }; // $FlowFixMe


	      Object.defineProperty(Fake.prototype, 'props', {
	        set: function () {
	          // We use a throwing setter instead of frozen or non-writable props
	          // because that won't throw in a non-strict mode function.
	          throw Error();
	        }
	      });

	      if (typeof Reflect === 'object' && Reflect.construct) {
	        // We construct a different control for this case to include any extra
	        // frames added by the construct call.
	        try {
	          Reflect.construct(Fake, []);
	        } catch (x) {
	          control = x;
	        }

	        Reflect.construct(fn, [], Fake);
	      } else {
	        try {
	          Fake.call();
	        } catch (x) {
	          control = x;
	        }

	        fn.call(Fake.prototype);
	      }
	    } else {
	      try {
	        throw Error();
	      } catch (x) {
	        control = x;
	      }

	      fn();
	    }
	  } catch (sample) {
	    // This is inlined manually because closure doesn't do it for us.
	    if (sample && control && typeof sample.stack === 'string') {
	      // This extracts the first frame from the sample that isn't also in the control.
	      // Skipping one frame that we assume is the frame that calls the two.
	      var sampleLines = sample.stack.split('\n');
	      var controlLines = control.stack.split('\n');
	      var s = sampleLines.length - 1;
	      var c = controlLines.length - 1;

	      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
	        // We expect at least one stack frame to be shared.
	        // Typically this will be the root most one. However, stack frames may be
	        // cut off due to maximum stack limits. In this case, one maybe cut off
	        // earlier than the other. We assume that the sample is longer or the same
	        // and there for cut off earlier. So we should find the root most frame in
	        // the sample somewhere in the control.
	        c--;
	      }

	      for (; s >= 1 && c >= 0; s--, c--) {
	        // Next we find the first one that isn't the same which should be the
	        // frame that called our sample function and the control.
	        if (sampleLines[s] !== controlLines[c]) {
	          // In V8, the first line is describing the message but other VMs don't.
	          // If we're about to return the first line, and the control is also on the same
	          // line, that's a pretty good indicator that our sample threw at same line as
	          // the control. I.e. before we entered the sample frame. So we ignore this result.
	          // This can happen if you passed a class to function component, or non-function.
	          if (s !== 1 || c !== 1) {
	            do {
	              s--;
	              c--; // We may still have similar intermediate frames from the construct call.
	              // The next one that isn't the same should be our match though.

	              if (c < 0 || sampleLines[s] !== controlLines[c]) {
	                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
	                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
	                // but we have a user-provided "displayName"
	                // splice it in to make the stack more readable.


	                if (fn.displayName && _frame.includes('<anonymous>')) {
	                  _frame = _frame.replace('<anonymous>', fn.displayName);
	                }

	                {
	                  if (typeof fn === 'function') {
	                    componentFrameCache.set(fn, _frame);
	                  }
	                } // Return the line we found.


	                return _frame;
	              }
	            } while (s >= 1 && c >= 0);
	          }

	          break;
	        }
	      }
	    }
	  } finally {
	    reentry = false;

	    {
	      ReactCurrentDispatcher.current = previousDispatcher;
	      reenableLogs();
	    }

	    Error.prepareStackTrace = previousPrepareStackTrace;
	  } // Fallback to just using the name if we couldn't make it throw.


	  var name = fn ? fn.displayName || fn.name : '';
	  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

	  {
	    if (typeof fn === 'function') {
	      componentFrameCache.set(fn, syntheticFrame);
	    }
	  }

	  return syntheticFrame;
	}
	function describeFunctionComponentFrame(fn, source, ownerFn) {
	  {
	    return describeNativeComponentFrame(fn, false);
	  }
	}

	function shouldConstruct(Component) {
	  var prototype = Component.prototype;
	  return !!(prototype && prototype.isReactComponent);
	}

	function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

	  if (type == null) {
	    return '';
	  }

	  if (typeof type === 'function') {
	    {
	      return describeNativeComponentFrame(type, shouldConstruct(type));
	    }
	  }

	  if (typeof type === 'string') {
	    return describeBuiltInComponentFrame(type);
	  }

	  switch (type) {
	    case REACT_SUSPENSE_TYPE:
	      return describeBuiltInComponentFrame('Suspense');

	    case REACT_SUSPENSE_LIST_TYPE:
	      return describeBuiltInComponentFrame('SuspenseList');
	  }

	  if (typeof type === 'object') {
	    switch (type.$$typeof) {
	      case REACT_FORWARD_REF_TYPE:
	        return describeFunctionComponentFrame(type.render);

	      case REACT_MEMO_TYPE:
	        // Memo may contain any component type so we recursively resolve it.
	        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

	      case REACT_LAZY_TYPE:
	        {
	          var lazyComponent = type;
	          var payload = lazyComponent._payload;
	          var init = lazyComponent._init;

	          try {
	            // Lazy may contain any component type so we recursively resolve it.
	            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
	          } catch (x) {}
	        }
	    }
	  }

	  return '';
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var loggedTypeFailures = {};
	var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

	function setCurrentlyValidatingElement(element) {
	  {
	    if (element) {
	      var owner = element._owner;
	      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
	      ReactDebugCurrentFrame.setExtraStackFrame(stack);
	    } else {
	      ReactDebugCurrentFrame.setExtraStackFrame(null);
	    }
	  }
	}

	function checkPropTypes(typeSpecs, values, location, componentName, element) {
	  {
	    // $FlowFixMe This is okay but Flow doesn't know it.
	    var has = Function.call.bind(hasOwnProperty);

	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.

	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            // eslint-disable-next-line react-internal/prod-error-codes
	            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
	            err.name = 'Invariant Violation';
	            throw err;
	          }

	          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
	        } catch (ex) {
	          error$1 = ex;
	        }

	        if (error$1 && !(error$1 instanceof Error)) {
	          setCurrentlyValidatingElement(element);

	          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

	          setCurrentlyValidatingElement(null);
	        }

	        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error$1.message] = true;
	          setCurrentlyValidatingElement(element);

	          error('Failed %s type: %s', location, error$1.message);

	          setCurrentlyValidatingElement(null);
	        }
	      }
	    }
	  }
	}

	var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

	function isArray(a) {
	  return isArrayImpl(a);
	}

	/*
	 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
	 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
	 *
	 * The functions in this module will throw an easier-to-understand,
	 * easier-to-debug exception with a clear errors message message explaining the
	 * problem. (Instead of a confusing exception thrown inside the implementation
	 * of the `value` object).
	 */
	// $FlowFixMe only called in DEV, so void return is not possible.
	function typeName(value) {
	  {
	    // toStringTag is needed for namespaced types like Temporal.Instant
	    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
	    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
	    return type;
	  }
	} // $FlowFixMe only called in DEV, so void return is not possible.


	function willCoercionThrow(value) {
	  {
	    try {
	      testStringCoercion(value);
	      return false;
	    } catch (e) {
	      return true;
	    }
	  }
	}

	function testStringCoercion(value) {
	  // If you ended up here by following an exception call stack, here's what's
	  // happened: you supplied an object or symbol value to React (as a prop, key,
	  // DOM attribute, CSS property, string ref, etc.) and when React tried to
	  // coerce it to a string using `'' + value`, an exception was thrown.
	  //
	  // The most common types that will cause this exception are `Symbol` instances
	  // and Temporal objects like `Temporal.Instant`. But any object that has a
	  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
	  // exception. (Library authors do this to prevent users from using built-in
	  // numeric operators like `+` or comparison operators like `>=` because custom
	  // methods are needed to perform accurate arithmetic or comparison.)
	  //
	  // To fix the problem, coerce this object or symbol value to a string before
	  // passing it to React. The most reliable way is usually `String(value)`.
	  //
	  // To find which value is throwing, check the browser or debugger console.
	  // Before this exception was thrown, there should be `console.error` output
	  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
	  // problem and how that type was used: key, atrribute, input value prop, etc.
	  // In most cases, this console output also shows the component and its
	  // ancestor components where the exception happened.
	  //
	  // eslint-disable-next-line react-internal/safe-string-coercion
	  return '' + value;
	}
	function checkKeyStringCoercion(value) {
	  {
	    if (willCoercionThrow(value)) {
	      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

	      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
	    }
	  }
	}

	var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
	var RESERVED_PROPS = {
	  key: true,
	  ref: true,
	  __self: true,
	  __source: true
	};
	var specialPropKeyWarningShown;
	var specialPropRefWarningShown;

	function hasValidRef(config) {
	  {
	    if (hasOwnProperty.call(config, 'ref')) {
	      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

	      if (getter && getter.isReactWarning) {
	        return false;
	      }
	    }
	  }

	  return config.ref !== undefined;
	}

	function hasValidKey(config) {
	  {
	    if (hasOwnProperty.call(config, 'key')) {
	      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

	      if (getter && getter.isReactWarning) {
	        return false;
	      }
	    }
	  }

	  return config.key !== undefined;
	}

	function warnIfStringRefCannotBeAutoConverted(config, self) {
	  {
	    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self) ;
	  }
	}

	function defineKeyPropWarningGetter(props, displayName) {
	  {
	    var warnAboutAccessingKey = function () {
	      if (!specialPropKeyWarningShown) {
	        specialPropKeyWarningShown = true;

	        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
	      }
	    };

	    warnAboutAccessingKey.isReactWarning = true;
	    Object.defineProperty(props, 'key', {
	      get: warnAboutAccessingKey,
	      configurable: true
	    });
	  }
	}

	function defineRefPropWarningGetter(props, displayName) {
	  {
	    var warnAboutAccessingRef = function () {
	      if (!specialPropRefWarningShown) {
	        specialPropRefWarningShown = true;

	        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
	      }
	    };

	    warnAboutAccessingRef.isReactWarning = true;
	    Object.defineProperty(props, 'ref', {
	      get: warnAboutAccessingRef,
	      configurable: true
	    });
	  }
	}
	/**
	 * Factory method to create a new React element. This no longer adheres to
	 * the class pattern, so do not use new to call it. Also, instanceof check
	 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
	 * if something is a React Element.
	 *
	 * @param {*} type
	 * @param {*} props
	 * @param {*} key
	 * @param {string|object} ref
	 * @param {*} owner
	 * @param {*} self A *temporary* helper to detect places where `this` is
	 * different from the `owner` when React.createElement is called, so that we
	 * can warn. We want to get rid of owner and replace string `ref`s with arrow
	 * functions, and as long as `this` and owner are the same, there will be no
	 * change in behavior.
	 * @param {*} source An annotation object (added by a transpiler or otherwise)
	 * indicating filename, line number, and/or other information.
	 * @internal
	 */


	var ReactElement = function (type, key, ref, self, source, owner, props) {
	  var element = {
	    // This tag allows us to uniquely identify this as a React Element
	    $$typeof: REACT_ELEMENT_TYPE,
	    // Built-in properties that belong on the element
	    type: type,
	    key: key,
	    ref: ref,
	    props: props,
	    // Record the component responsible for creating this element.
	    _owner: owner
	  };

	  {
	    // The validation flag is currently mutative. We put it on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.

	    Object.defineProperty(element._store, 'validated', {
	      configurable: false,
	      enumerable: false,
	      writable: true,
	      value: false
	    }); // self and source are DEV only properties.

	    Object.defineProperty(element, '_self', {
	      configurable: false,
	      enumerable: false,
	      writable: false,
	      value: self
	    }); // Two elements created in two different places should be considered
	    // equal for testing purposes and therefore we hide it from enumeration.

	    Object.defineProperty(element, '_source', {
	      configurable: false,
	      enumerable: false,
	      writable: false,
	      value: source
	    });

	    if (Object.freeze) {
	      Object.freeze(element.props);
	      Object.freeze(element);
	    }
	  }

	  return element;
	};
	/**
	 * https://github.com/reactjs/rfcs/pull/107
	 * @param {*} type
	 * @param {object} props
	 * @param {string} key
	 */

	function jsxDEV(type, config, maybeKey, source, self) {
	  {
	    var propName; // Reserved names are extracted

	    var props = {};
	    var key = null;
	    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
	    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
	    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
	    // but as an intermediary step, we will use jsxDEV for everything except
	    // <div {...props} key="Hi" />, because we aren't currently able to tell if
	    // key is explicitly declared to be undefined or not.

	    if (maybeKey !== undefined) {
	      {
	        checkKeyStringCoercion(maybeKey);
	      }

	      key = '' + maybeKey;
	    }

	    if (hasValidKey(config)) {
	      {
	        checkKeyStringCoercion(config.key);
	      }

	      key = '' + config.key;
	    }

	    if (hasValidRef(config)) {
	      ref = config.ref;
	      warnIfStringRefCannotBeAutoConverted(config, self);
	    } // Remaining properties are added to a new props object


	    for (propName in config) {
	      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    } // Resolve default props


	    if (type && type.defaultProps) {
	      var defaultProps = type.defaultProps;

	      for (propName in defaultProps) {
	        if (props[propName] === undefined) {
	          props[propName] = defaultProps[propName];
	        }
	      }
	    }

	    if (key || ref) {
	      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

	      if (key) {
	        defineKeyPropWarningGetter(props, displayName);
	      }

	      if (ref) {
	        defineRefPropWarningGetter(props, displayName);
	      }
	    }

	    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
	  }
	}

	var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
	var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

	function setCurrentlyValidatingElement$1(element) {
	  {
	    if (element) {
	      var owner = element._owner;
	      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
	      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
	    } else {
	      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
	    }
	  }
	}

	var propTypesMisspellWarningShown;

	{
	  propTypesMisspellWarningShown = false;
	}
	/**
	 * Verifies the object is a ReactElement.
	 * See https://reactjs.org/docs/react-api.html#isvalidelement
	 * @param {?object} object
	 * @return {boolean} True if `object` is a ReactElement.
	 * @final
	 */


	function isValidElement(object) {
	  {
	    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	  }
	}

	function getDeclarationErrorAddendum() {
	  {
	    if (ReactCurrentOwner$1.current) {
	      var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);

	      if (name) {
	        return '\n\nCheck the render method of `' + name + '`.';
	      }
	    }

	    return '';
	  }
	}

	function getSourceInfoErrorAddendum(source) {
	  {

	    return '';
	  }
	}
	/**
	 * Warn if there's no key explicitly set on dynamic arrays of children or
	 * object keys are not valid. This allows us to keep track of children between
	 * updates.
	 */


	var ownerHasKeyUseWarning = {};

	function getCurrentComponentErrorInfo(parentType) {
	  {
	    var info = getDeclarationErrorAddendum();

	    if (!info) {
	      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

	      if (parentName) {
	        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
	      }
	    }

	    return info;
	  }
	}
	/**
	 * Warn if the element doesn't have an explicit key assigned to it.
	 * This element is in an array. The array could grow and shrink or be
	 * reordered. All children that haven't already been validated are required to
	 * have a "key" property assigned to it. Error statuses are cached so a warning
	 * will only be shown once.
	 *
	 * @internal
	 * @param {ReactElement} element Element that requires a key.
	 * @param {*} parentType element's parent's type.
	 */


	function validateExplicitKey(element, parentType) {
	  {
	    if (!element._store || element._store.validated || element.key != null) {
	      return;
	    }

	    element._store.validated = true;
	    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

	    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
	      return;
	    }

	    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
	    // property, it may be the creator of the child that's responsible for
	    // assigning it a key.

	    var childOwner = '';

	    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
	      // Give the component that originally created this child.
	      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
	    }

	    setCurrentlyValidatingElement$1(element);

	    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

	    setCurrentlyValidatingElement$1(null);
	  }
	}
	/**
	 * Ensure that every element either is passed in a static location, in an
	 * array with an explicit keys property defined, or in an object literal
	 * with valid key property.
	 *
	 * @internal
	 * @param {ReactNode} node Statically passed child of any type.
	 * @param {*} parentType node's parent's type.
	 */


	function validateChildKeys(node, parentType) {
	  {
	    if (typeof node !== 'object') {
	      return;
	    }

	    if (isArray(node)) {
	      for (var i = 0; i < node.length; i++) {
	        var child = node[i];

	        if (isValidElement(child)) {
	          validateExplicitKey(child, parentType);
	        }
	      }
	    } else if (isValidElement(node)) {
	      // This element was passed in a valid location.
	      if (node._store) {
	        node._store.validated = true;
	      }
	    } else if (node) {
	      var iteratorFn = getIteratorFn(node);

	      if (typeof iteratorFn === 'function') {
	        // Entry iterators used to provide implicit keys,
	        // but now we print a separate warning for them later.
	        if (iteratorFn !== node.entries) {
	          var iterator = iteratorFn.call(node);
	          var step;

	          while (!(step = iterator.next()).done) {
	            if (isValidElement(step.value)) {
	              validateExplicitKey(step.value, parentType);
	            }
	          }
	        }
	      }
	    }
	  }
	}
	/**
	 * Given an element, validate that its props follow the propTypes definition,
	 * provided by the type.
	 *
	 * @param {ReactElement} element
	 */


	function validatePropTypes(element) {
	  {
	    var type = element.type;

	    if (type === null || type === undefined || typeof type === 'string') {
	      return;
	    }

	    var propTypes;

	    if (typeof type === 'function') {
	      propTypes = type.propTypes;
	    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
	    // Inner props are checked in the reconciler.
	    type.$$typeof === REACT_MEMO_TYPE)) {
	      propTypes = type.propTypes;
	    } else {
	      return;
	    }

	    if (propTypes) {
	      // Intentionally inside to avoid triggering lazy initializers:
	      var name = getComponentNameFromType(type);
	      checkPropTypes(propTypes, element.props, 'prop', name, element);
	    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
	      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

	      var _name = getComponentNameFromType(type);

	      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
	    }

	    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
	      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
	    }
	  }
	}
	/**
	 * Given a fragment, validate that it can only be provided with fragment props
	 * @param {ReactElement} fragment
	 */


	function validateFragmentProps(fragment) {
	  {
	    var keys = Object.keys(fragment.props);

	    for (var i = 0; i < keys.length; i++) {
	      var key = keys[i];

	      if (key !== 'children' && key !== 'key') {
	        setCurrentlyValidatingElement$1(fragment);

	        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

	        setCurrentlyValidatingElement$1(null);
	        break;
	      }
	    }

	    if (fragment.ref !== null) {
	      setCurrentlyValidatingElement$1(fragment);

	      error('Invalid attribute `ref` supplied to `React.Fragment`.');

	      setCurrentlyValidatingElement$1(null);
	    }
	  }
	}

	var didWarnAboutKeySpread = {};
	function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
	  {
	    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
	    // succeed and there will likely be errors in render.

	    if (!validType) {
	      var info = '';

	      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
	        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
	      }

	      var sourceInfo = getSourceInfoErrorAddendum();

	      if (sourceInfo) {
	        info += sourceInfo;
	      } else {
	        info += getDeclarationErrorAddendum();
	      }

	      var typeString;

	      if (type === null) {
	        typeString = 'null';
	      } else if (isArray(type)) {
	        typeString = 'array';
	      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
	        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
	        info = ' Did you accidentally export a JSX literal instead of a component?';
	      } else {
	        typeString = typeof type;
	      }

	      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
	    }

	    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
	    // TODO: Drop this when these are no longer allowed as the type argument.

	    if (element == null) {
	      return element;
	    } // Skip key warning if the type isn't valid since our key validation logic
	    // doesn't expect a non-string/function type and can throw confusing errors.
	    // We don't want exception behavior to differ between dev and prod.
	    // (Rendering will throw with a helpful message and as soon as the type is
	    // fixed, the key warnings will appear.)


	    if (validType) {
	      var children = props.children;

	      if (children !== undefined) {
	        if (isStaticChildren) {
	          if (isArray(children)) {
	            for (var i = 0; i < children.length; i++) {
	              validateChildKeys(children[i], type);
	            }

	            if (Object.freeze) {
	              Object.freeze(children);
	            }
	          } else {
	            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
	          }
	        } else {
	          validateChildKeys(children, type);
	        }
	      }
	    }

	    {
	      if (hasOwnProperty.call(props, 'key')) {
	        var componentName = getComponentNameFromType(type);
	        var keys = Object.keys(props).filter(function (k) {
	          return k !== 'key';
	        });
	        var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';

	        if (!didWarnAboutKeySpread[componentName + beforeExample]) {
	          var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';

	          error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);

	          didWarnAboutKeySpread[componentName + beforeExample] = true;
	        }
	      }
	    }

	    if (type === REACT_FRAGMENT_TYPE) {
	      validateFragmentProps(element);
	    } else {
	      validatePropTypes(element);
	    }

	    return element;
	  }
	} // These two functions exist to still get child warnings in dev
	// even with the prod transform. This means that jsxDEV is purely
	// opt-in behavior for better messages but that we won't stop
	// giving you warnings if you use production apis.

	function jsxWithValidationStatic(type, props, key) {
	  {
	    return jsxWithValidation(type, props, key, true);
	  }
	}
	function jsxWithValidationDynamic(type, props, key) {
	  {
	    return jsxWithValidation(type, props, key, false);
	  }
	}

	var jsx =  jsxWithValidationDynamic ; // we may want to special case jsxs internally to take advantage of static children.
	// for now we can ship identical prod functions

	var jsxs =  jsxWithValidationStatic ;

	reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_development.jsx = jsx;
	reactJsxRuntime_development.jsxs = jsxs;
	  })();
	}
	return reactJsxRuntime_development;
}

if (process.env.NODE_ENV === 'production') {
  jsxRuntime.exports = requireReactJsxRuntime_production_min();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}

var jsxRuntimeExports = jsxRuntime.exports;

/**
 * Constants for React Responsive Easy Storybook Addon
 */
const ADDON_ID = 'react-responsive-easy';
const PANEL_ID = `${ADDON_ID}/panel`;
const EVENTS = {
    BREAKPOINT_CHANGED: `${ADDON_ID}/breakpoint-changed`,
    CONFIG_UPDATED: `${ADDON_ID}/config-updated`,
    PERFORMANCE_DATA: `${ADDON_ID}/performance-data`,
    RESET_VIEWPORT: `${ADDON_ID}/reset-viewport`,
    TOGGLE_OVERLAY: `${ADDON_ID}/toggle-overlay`
};
const DEFAULT_BREAKPOINTS = [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
];
const TOOLBAR_ID = `${ADDON_ID}/toolbar`;

const ResponsiveControls = ({ state, onBreakpointChange, onConfigUpdate }) => {
    const [showAdvanced, setShowAdvanced] = require$$0.useState(false);
    const [customConfig, setCustomConfig] = require$$0.useState('');
    const handleBreakpointSelect = require$$0.useCallback((breakpoint) => {
        onBreakpointChange(breakpoint);
    }, [onBreakpointChange]);
    const handleConfigImport = require$$0.useCallback(() => {
        try {
            const config = JSON.parse(customConfig);
            onConfigUpdate(config);
            setCustomConfig('');
        }
        catch {
            // In production, this should be handled by a proper error reporting system
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-alert
                alert('Invalid JSON configuration');
            }
        }
    }, [customConfig, onConfigUpdate]);
    const exportCurrentConfig = require$$0.useCallback(() => {
        if (state.config) {
            const configStr = JSON.stringify(state.config, null, 2);
            navigator.clipboard.writeText(configStr).then(() => {
                // In production, this should be handled by a proper notification system
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-alert
                    alert('Configuration copied to clipboard!');
                }
            }).catch((error) => {
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.error('Failed to copy configuration:', error);
                }
            });
        }
    }, [state.config]);
    return (jsxRuntimeExports.jsxs("div", { className: "responsive-controls", children: [jsxRuntimeExports.jsxs("div", { className: "control-section", children: [jsxRuntimeExports.jsx("h3", { children: "Current Breakpoint" }), jsxRuntimeExports.jsx("div", { className: "breakpoint-selector", children: state.availableBreakpoints.map((breakpoint) => (jsxRuntimeExports.jsxs("button", { className: `breakpoint-button ${state.currentBreakpoint?.alias === breakpoint.alias ? 'active' : ''}`, onClick: () => handleBreakpointSelect(breakpoint), children: [jsxRuntimeExports.jsx("div", { className: "breakpoint-icon", children: getBreakpointIcon$3(breakpoint) }), jsxRuntimeExports.jsxs("div", { className: "breakpoint-info", children: [jsxRuntimeExports.jsx("div", { className: "breakpoint-name", children: breakpoint.name }), jsxRuntimeExports.jsxs("div", { className: "breakpoint-size", children: [breakpoint.width, "\u00D7", breakpoint.height] })] })] }, breakpoint.alias))) })] }), jsxRuntimeExports.jsxs("div", { className: "control-section", children: [jsxRuntimeExports.jsx("h3", { children: "Quick Actions" }), jsxRuntimeExports.jsxs("div", { className: "action-buttons", children: [jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => window.location.reload(), children: "\uD83D\uDD04 Refresh Story" }), jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => {
                                    if (state.config && process.env.NODE_ENV === 'development') {
                                        // eslint-disable-next-line no-console
                                        console.log('Current Responsive Config:', state.config);
                                    }
                                }, children: "\uD83D\uDC1B Debug Config" }), jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: exportCurrentConfig, disabled: !state.config, children: "\uD83D\uDCCB Copy Config" })] })] }), state.config && (jsxRuntimeExports.jsxs("div", { className: "control-section", children: [jsxRuntimeExports.jsx("h3", { children: "Configuration Info" }), jsxRuntimeExports.jsxs("div", { className: "config-info", children: [jsxRuntimeExports.jsxs("div", { className: "info-item", children: [jsxRuntimeExports.jsx("span", { className: "info-label", children: "Base Breakpoint:" }), jsxRuntimeExports.jsxs("span", { className: "info-value", children: [state.config.base.name, " (", state.config.base.width, "\u00D7", state.config.base.height, ")"] })] }), jsxRuntimeExports.jsxs("div", { className: "info-item", children: [jsxRuntimeExports.jsx("span", { className: "info-label", children: "Scaling Mode:" }), jsxRuntimeExports.jsx("span", { className: "info-value", children: state.config.strategy.mode })] }), jsxRuntimeExports.jsxs("div", { className: "info-item", children: [jsxRuntimeExports.jsx("span", { className: "info-label", children: "Origin:" }), jsxRuntimeExports.jsx("span", { className: "info-value", children: state.config.strategy.origin })] }), jsxRuntimeExports.jsxs("div", { className: "info-item", children: [jsxRuntimeExports.jsx("span", { className: "info-label", children: "Breakpoints:" }), jsxRuntimeExports.jsx("span", { className: "info-value", children: state.config.breakpoints.length })] })] })] })), jsxRuntimeExports.jsxs("div", { className: "control-section", children: [jsxRuntimeExports.jsxs("button", { className: "btn btn-ghost", onClick: () => setShowAdvanced(!showAdvanced), children: [showAdvanced ? '▼' : '▶', " Advanced Settings"] }), showAdvanced && (jsxRuntimeExports.jsxs("div", { className: "advanced-controls", children: [jsxRuntimeExports.jsxs("div", { className: "form-group", children: [jsxRuntimeExports.jsx("label", { children: "Import Configuration" }), jsxRuntimeExports.jsx("textarea", { value: customConfig, onChange: (e) => setCustomConfig(e.target.value), placeholder: "Paste your responsive configuration JSON here...", rows: 6 }), jsxRuntimeExports.jsx("button", { className: "btn btn-primary btn-sm", onClick: handleConfigImport, disabled: !customConfig.trim(), children: "Import Config" })] }), jsxRuntimeExports.jsxs("div", { className: "form-group", children: [jsxRuntimeExports.jsx("label", { children: "Performance Settings" }), jsxRuntimeExports.jsxs("div", { className: "checkbox-group", children: [jsxRuntimeExports.jsxs("label", { className: "checkbox-label", children: [jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }), jsxRuntimeExports.jsx("span", { children: "Enable performance monitoring" })] }), jsxRuntimeExports.jsxs("label", { className: "checkbox-label", children: [jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }), jsxRuntimeExports.jsx("span", { children: "Show performance warnings" })] }), jsxRuntimeExports.jsxs("label", { className: "checkbox-label", children: [jsxRuntimeExports.jsx("input", { type: "checkbox" }), jsxRuntimeExports.jsx("span", { children: "Enable debug mode" })] })] })] })] }))] }), jsxRuntimeExports.jsx("style", { children: `
        .responsive-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .control-section {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 16px;
        }

        .control-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .control-section h3 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .breakpoint-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakpoint-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .breakpoint-button:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .breakpoint-button.active {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }

        .breakpoint-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .breakpoint-name {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .breakpoint-size {
          font-size: 10px;
          opacity: 0.8;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-ghost {
          background: transparent;
          border: none;
          color: #666;
          padding: 4px 0;
          font-size: 11px;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 10px;
        }

        .config-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }

        .info-label {
          color: #666;
        }

        .info-value {
          font-weight: 500;
          color: #333;
        }

        .advanced-controls {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 10px;
          font-family: monospace;
          resize: vertical;
          margin-bottom: 8px;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }
      ` })] }));
};
function getBreakpointIcon$3(breakpoint) {
    if (breakpoint.width <= 480)
        return '📱';
    if (breakpoint.width <= 768)
        return '📱';
    if (breakpoint.width <= 1024)
        return '💻';
    if (breakpoint.width <= 1440)
        return '🖥️';
    return '🖥️';
}

const PerformanceMetrics = ({ data, isVisible }) => {
    if (!isVisible) {
        return (jsxRuntimeExports.jsxs("div", { className: "performance-disabled", children: [jsxRuntimeExports.jsx("p", { children: "Performance monitoring is disabled for this story." }), jsxRuntimeExports.jsx("p", { children: "Enable it in the story parameters or addon settings." })] }));
    }
    if (!data) {
        return (jsxRuntimeExports.jsxs("div", { className: "performance-loading", children: [jsxRuntimeExports.jsx("div", { className: "loading-spinner" }), jsxRuntimeExports.jsx("p", { children: "Collecting performance metrics..." })] }));
    }
    const getMetricStatus = (value, thresholds) => {
        if (value <= thresholds.good)
            return 'good';
        if (value <= thresholds.warning)
            return 'warning';
        return 'poor';
    };
    const renderTimeStatus = getMetricStatus(data.renderTime, { good: 16, warning: 33 });
    const memoryStatus = getMetricStatus(data.memoryUsage / 1024, { good: 50, warning: 100 });
    const cacheStatus = getMetricStatus(100 - (data.cacheHitRate * 100), { good: 10, warning: 30 });
    return (jsxRuntimeExports.jsxs("div", { className: "performance-metrics", children: [jsxRuntimeExports.jsxs("div", { className: "metrics-overview", children: [jsxRuntimeExports.jsxs("div", { className: `metric-card ${renderTimeStatus}`, children: [jsxRuntimeExports.jsx("div", { className: "metric-icon", children: "\u26A1" }), jsxRuntimeExports.jsxs("div", { className: "metric-content", children: [jsxRuntimeExports.jsxs("div", { className: "metric-value", children: [data.renderTime.toFixed(1), "ms"] }), jsxRuntimeExports.jsx("div", { className: "metric-label", children: "Render Time" })] }), jsxRuntimeExports.jsx("div", { className: "metric-status", children: renderTimeStatus })] }), jsxRuntimeExports.jsxs("div", { className: `metric-card ${memoryStatus}`, children: [jsxRuntimeExports.jsx("div", { className: "metric-icon", children: "\uD83E\uDDE0" }), jsxRuntimeExports.jsxs("div", { className: "metric-content", children: [jsxRuntimeExports.jsxs("div", { className: "metric-value", children: [(data.memoryUsage / 1024).toFixed(1), "KB"] }), jsxRuntimeExports.jsx("div", { className: "metric-label", children: "Memory Usage" })] }), jsxRuntimeExports.jsx("div", { className: "metric-status", children: memoryStatus })] }), jsxRuntimeExports.jsxs("div", { className: `metric-card ${data.layoutShifts > 0 ? 'warning' : 'good'}`, children: [jsxRuntimeExports.jsx("div", { className: "metric-icon", children: "\uD83D\uDCD0" }), jsxRuntimeExports.jsxs("div", { className: "metric-content", children: [jsxRuntimeExports.jsx("div", { className: "metric-value", children: data.layoutShifts }), jsxRuntimeExports.jsx("div", { className: "metric-label", children: "Layout Shifts" })] }), jsxRuntimeExports.jsx("div", { className: "metric-status", children: data.layoutShifts > 0 ? 'warning' : 'good' })] }), jsxRuntimeExports.jsxs("div", { className: `metric-card ${cacheStatus}`, children: [jsxRuntimeExports.jsx("div", { className: "metric-icon", children: "\uD83D\uDCBE" }), jsxRuntimeExports.jsxs("div", { className: "metric-content", children: [jsxRuntimeExports.jsxs("div", { className: "metric-value", children: [(data.cacheHitRate * 100).toFixed(1), "%"] }), jsxRuntimeExports.jsx("div", { className: "metric-label", children: "Cache Hit Rate" })] }), jsxRuntimeExports.jsx("div", { className: "metric-status", children: cacheStatus })] })] }), jsxRuntimeExports.jsxs("div", { className: "detailed-metrics", children: [jsxRuntimeExports.jsx("h4", { children: "Detailed Performance" }), jsxRuntimeExports.jsxs("div", { className: "metric-row", children: [jsxRuntimeExports.jsx("span", { className: "metric-name", children: "Scaling Operations:" }), jsxRuntimeExports.jsx("span", { className: "metric-detail", children: data.scalingOperations })] }), jsxRuntimeExports.jsxs("div", { className: "metric-row", children: [jsxRuntimeExports.jsx("span", { className: "metric-name", children: "Average Operation Time:" }), jsxRuntimeExports.jsxs("span", { className: "metric-detail", children: [data.scalingOperations > 0 ? (data.renderTime / data.scalingOperations).toFixed(2) : 0, "ms"] })] }), jsxRuntimeExports.jsxs("div", { className: "metric-row", children: [jsxRuntimeExports.jsx("span", { className: "metric-name", children: "Memory per Operation:" }), jsxRuntimeExports.jsxs("span", { className: "metric-detail", children: [data.scalingOperations > 0 ? (data.memoryUsage / data.scalingOperations / 1024).toFixed(2) : 0, "KB"] })] })] }), jsxRuntimeExports.jsxs("div", { className: "performance-tips", children: [jsxRuntimeExports.jsx("h4", { children: "\uD83D\uDCA1 Performance Tips" }), jsxRuntimeExports.jsxs("div", { className: "tips-list", children: [data.renderTime > 16 && (jsxRuntimeExports.jsxs("div", { className: "tip warning", children: [jsxRuntimeExports.jsx("strong", { children: "Slow Rendering:" }), " Consider memoizing expensive calculations or using React.memo"] })), data.memoryUsage > 100 * 1024 && (jsxRuntimeExports.jsxs("div", { className: "tip warning", children: [jsxRuntimeExports.jsx("strong", { children: "High Memory Usage:" }), " Check for memory leaks or excessive object creation"] })), data.layoutShifts > 0 && (jsxRuntimeExports.jsxs("div", { className: "tip warning", children: [jsxRuntimeExports.jsx("strong", { children: "Layout Shifts Detected:" }), " Use CSS containment or reserve space for dynamic content"] })), data.cacheHitRate < 0.8 && (jsxRuntimeExports.jsxs("div", { className: "tip info", children: [jsxRuntimeExports.jsx("strong", { children: "Low Cache Hit Rate:" }), " Consider optimizing caching strategy for better performance"] })), data.renderTime <= 16 && data.memoryUsage <= 50 * 1024 && data.layoutShifts === 0 && (jsxRuntimeExports.jsxs("div", { className: "tip good", children: [jsxRuntimeExports.jsx("strong", { children: "Great Performance!" }), " Your component is performing well across all metrics"] }))] })] }), jsxRuntimeExports.jsx("style", { children: `
        .performance-metrics {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .performance-disabled,
        .performance-loading {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e0e0e0;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .metrics-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          position: relative;
        }

        .metric-card.good {
          border-left: 4px solid #28a745;
        }

        .metric-card.warning {
          border-left: 4px solid #ffc107;
        }

        .metric-card.poor {
          border-left: 4px solid #dc3545;
        }

        .metric-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          line-height: 1;
        }

        .metric-label {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
        }

        .metric-status {
          position: absolute;
          top: 4px;
          right: 4px;
          font-size: 8px;
          padding: 2px 4px;
          border-radius: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .metric-card.good .metric-status {
          background: #d4edda;
          color: #155724;
        }

        .metric-card.warning .metric-status {
          background: #fff3cd;
          color: #856404;
        }

        .metric-card.poor .metric-status {
          background: #f8d7da;
          color: #721c24;
        }

        .detailed-metrics {
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }

        .detailed-metrics h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 11px;
        }

        .metric-name {
          color: #666;
        }

        .metric-detail {
          font-weight: 500;
          color: #333;
        }

        .performance-tips {
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }

        .performance-tips h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tip {
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 11px;
          line-height: 1.4;
        }

        .tip.good {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .tip.info {
          background: #d1ecf1;
          border: 1px solid #bee5eb;
          color: #0c5460;
        }

        .tip.warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
        }

        .tip strong {
          font-weight: 600;
        }
      ` })] }));
};

const BreakpointPreview = ({ breakpoints, currentBreakpoint, onBreakpointChange }) => {
    if (!breakpoints.length) {
        return (jsxRuntimeExports.jsxs("div", { className: "preview-empty", children: [jsxRuntimeExports.jsx("p", { children: "No breakpoints configured for this story." }), jsxRuntimeExports.jsx("p", { children: "Add breakpoints to your story parameters to see previews." })] }));
    }
    return (jsxRuntimeExports.jsxs("div", { className: "breakpoint-preview", children: [jsxRuntimeExports.jsxs("div", { className: "preview-header", children: [jsxRuntimeExports.jsx("h3", { children: "Breakpoint Overview" }), jsxRuntimeExports.jsx("p", { children: "Click on a breakpoint to switch the viewport" })] }), jsxRuntimeExports.jsx("div", { className: "preview-grid", children: breakpoints.map((breakpoint) => (jsxRuntimeExports.jsxs("div", { className: `preview-card ${currentBreakpoint?.alias === breakpoint.alias ? 'active' : ''}`, onClick: () => onBreakpointChange(breakpoint), children: [jsxRuntimeExports.jsxs("div", { className: "preview-header-card", children: [jsxRuntimeExports.jsx("div", { className: "preview-icon", children: getBreakpointIcon$2(breakpoint) }), jsxRuntimeExports.jsxs("div", { className: "preview-info", children: [jsxRuntimeExports.jsx("div", { className: "preview-name", children: breakpoint.name }), jsxRuntimeExports.jsxs("div", { className: "preview-size", children: [breakpoint.width, " \u00D7 ", breakpoint.height] })] })] }), jsxRuntimeExports.jsx("div", { className: "preview-viewport", children: jsxRuntimeExports.jsx("div", { className: "viewport-frame", style: {
                                    aspectRatio: `${breakpoint.width} / ${breakpoint.height}`,
                                    maxWidth: '100%',
                                    maxHeight: '120px'
                                }, children: jsxRuntimeExports.jsx("div", { className: "viewport-content", children: jsxRuntimeExports.jsxs("div", { className: "viewport-placeholder", children: [breakpoint.name, " View"] }) }) }) }), jsxRuntimeExports.jsxs("div", { className: "preview-details", children: [jsxRuntimeExports.jsxs("div", { className: "detail-item", children: [jsxRuntimeExports.jsx("span", { className: "detail-label", children: "Width:" }), jsxRuntimeExports.jsxs("span", { className: "detail-value", children: [breakpoint.width, "px"] })] }), jsxRuntimeExports.jsxs("div", { className: "detail-item", children: [jsxRuntimeExports.jsx("span", { className: "detail-label", children: "Height:" }), jsxRuntimeExports.jsxs("span", { className: "detail-value", children: [breakpoint.height, "px"] })] }), jsxRuntimeExports.jsxs("div", { className: "detail-item", children: [jsxRuntimeExports.jsx("span", { className: "detail-label", children: "Ratio:" }), jsxRuntimeExports.jsx("span", { className: "detail-value", children: (breakpoint.width / breakpoint.height).toFixed(2) })] })] })] }, breakpoint.alias))) }), jsxRuntimeExports.jsxs("div", { className: "preview-controls", children: [jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", children: "\uD83D\uDCF1 Test All Breakpoints" }), jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", children: "\uD83D\uDCF8 Take Screenshots" }), jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", children: "\uD83D\uDCCA Compare Performance" })] }), jsxRuntimeExports.jsx("style", { children: `
        .breakpoint-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-empty {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .preview-header h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .preview-header p {
          margin: 0;
          font-size: 11px;
          color: #666;
        }

        .preview-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .preview-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .preview-card:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
        }

        .preview-card.active {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
        }

        .preview-header-card {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .preview-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .preview-name {
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .preview-size {
          font-size: 10px;
          color: #666;
        }

        .preview-viewport {
          margin-bottom: 8px;
          display: flex;
          justify-content: center;
        }

        .viewport-frame {
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f8f9fa;
          overflow: hidden;
          position: relative;
        }

        .viewport-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .viewport-placeholder {
          font-size: 10px;
          color: #666;
          text-align: center;
        }

        .preview-details {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .detail-label {
          color: #666;
        }

        .detail-value {
          font-weight: 500;
          color: #333;
        }

        .preview-controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn:hover {
          opacity: 0.8;
        }
      ` })] }));
};
function getBreakpointIcon$2(breakpoint) {
    if (breakpoint.width <= 480)
        return '📱';
    if (breakpoint.width <= 768)
        return '📱';
    if (breakpoint.width <= 1024)
        return '💻';
    if (breakpoint.width <= 1440)
        return '🖥️';
    return '🖥️';
}

const ResponsiveDocumentation = ({ config, breakpoints }) => {
    const [activeSection, setActiveSection] = require$$0.useState('overview');
    return (jsxRuntimeExports.jsxs("div", { className: "responsive-documentation", children: [jsxRuntimeExports.jsxs("div", { className: "doc-nav", children: [jsxRuntimeExports.jsx("button", { className: `nav-button ${activeSection === 'overview' ? 'active' : ''}`, onClick: () => setActiveSection('overview'), children: "\uD83D\uDCCB Overview" }), jsxRuntimeExports.jsx("button", { className: `nav-button ${activeSection === 'examples' ? 'active' : ''}`, onClick: () => setActiveSection('examples'), children: "\uD83D\uDCA1 Examples" }), jsxRuntimeExports.jsx("button", { className: `nav-button ${activeSection === 'api' ? 'active' : ''}`, onClick: () => setActiveSection('api'), children: "\uD83D\uDCD6 API" }), jsxRuntimeExports.jsx("button", { className: `nav-button ${activeSection === 'best-practices' ? 'active' : ''}`, onClick: () => setActiveSection('best-practices'), children: "\u2728 Best Practices" })] }), jsxRuntimeExports.jsxs("div", { className: "doc-content", children: [activeSection === 'overview' && (jsxRuntimeExports.jsxs("div", { className: "doc-section", children: [jsxRuntimeExports.jsx("h3", { children: "\uD83D\uDCCB Responsive Component Overview" }), jsxRuntimeExports.jsxs("div", { className: "overview-content", children: [jsxRuntimeExports.jsx("p", { children: "This component uses React Responsive Easy to automatically scale and adapt across different screen sizes and devices." }), config && (jsxRuntimeExports.jsxs("div", { className: "config-summary", children: [jsxRuntimeExports.jsx("h4", { children: "Configuration Summary" }), jsxRuntimeExports.jsxs("div", { className: "config-details", children: [jsxRuntimeExports.jsxs("div", { className: "config-item", children: [jsxRuntimeExports.jsx("strong", { children: "Base Breakpoint:" }), " ", config.base.name, " (", config.base.width, "\u00D7", config.base.height, ")"] }), jsxRuntimeExports.jsxs("div", { className: "config-item", children: [jsxRuntimeExports.jsx("strong", { children: "Scaling Strategy:" }), " ", config.strategy.mode] }), jsxRuntimeExports.jsxs("div", { className: "config-item", children: [jsxRuntimeExports.jsx("strong", { children: "Origin Point:" }), " ", config.strategy.origin] }), jsxRuntimeExports.jsxs("div", { className: "config-item", children: [jsxRuntimeExports.jsx("strong", { children: "Target Breakpoints:" }), " ", config.breakpoints.length] })] })] })), breakpoints.length > 0 && (jsxRuntimeExports.jsxs("div", { className: "breakpoints-summary", children: [jsxRuntimeExports.jsx("h4", { children: "Supported Breakpoints" }), jsxRuntimeExports.jsx("div", { className: "breakpoints-list", children: breakpoints.map(bp => (jsxRuntimeExports.jsxs("div", { className: "breakpoint-summary", children: [jsxRuntimeExports.jsx("span", { className: "bp-icon", children: getBreakpointIcon$1(bp) }), jsxRuntimeExports.jsx("span", { className: "bp-name", children: bp.name }), jsxRuntimeExports.jsxs("span", { className: "bp-size", children: [bp.width, "\u00D7", bp.height] })] }, bp.alias))) })] }))] })] })), activeSection === 'examples' && (jsxRuntimeExports.jsxs("div", { className: "doc-section", children: [jsxRuntimeExports.jsx("h3", { children: "\uD83D\uDCA1 Usage Examples" }), jsxRuntimeExports.jsxs("div", { className: "examples-content", children: [jsxRuntimeExports.jsxs("div", { className: "example-block", children: [jsxRuntimeExports.jsx("h4", { children: "Basic Usage" }), jsxRuntimeExports.jsx("pre", { className: "code-block", children: `import { ResponsiveProvider, useResponsiveValue } from '@react-responsive-easy/core';

function MyComponent() {
  const fontSize = useResponsiveValue(24); // Base font size
  const padding = useResponsiveValue({ top: 16, left: 20 });
  
  return (
    <div style={{ fontSize, padding }}>
      Responsive content that scales automatically
    </div>
  );
}` })] }), jsxRuntimeExports.jsxs("div", { className: "example-block", children: [jsxRuntimeExports.jsx("h4", { children: "Advanced Scaling" }), jsxRuntimeExports.jsx("pre", { className: "code-block", children: `import { useScaledStyle } from '@react-responsive-easy/core';

function Card() {
  const styles = useScaledStyle({
    width: 300,
    height: 200,
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  });
  
  return <div style={styles}>Scaled card component</div>;
}` })] }), jsxRuntimeExports.jsxs("div", { className: "example-block", children: [jsxRuntimeExports.jsx("h4", { children: "Breakpoint-Specific Values" }), jsxRuntimeExports.jsx("pre", { className: "code-block", children: `import { useBreakpoint } from '@react-responsive-easy/core';

function ResponsiveLayout() {
  const breakpoint = useBreakpoint();
  
  const columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }[breakpoint.alias] ?? 1;
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: \`repeat(\${columns}, 1fr)\` 
    }}>
      {/* Grid items */}
    </div>
  );
}` })] })] })] })), activeSection === 'api' && (jsxRuntimeExports.jsxs("div", { className: "doc-section", children: [jsxRuntimeExports.jsx("h3", { children: "\uD83D\uDCD6 API Reference" }), jsxRuntimeExports.jsxs("div", { className: "api-content", children: [jsxRuntimeExports.jsxs("div", { className: "api-section", children: [jsxRuntimeExports.jsx("h4", { children: "Hooks" }), jsxRuntimeExports.jsxs("div", { className: "api-item", children: [jsxRuntimeExports.jsx("div", { className: "api-signature", children: jsxRuntimeExports.jsx("code", { children: "useResponsiveValue(value: any): any" }) }), jsxRuntimeExports.jsx("p", { children: "Scales a single value based on the current breakpoint." }), jsxRuntimeExports.jsxs("div", { className: "api-params", children: [jsxRuntimeExports.jsx("strong", { children: "Parameters:" }), jsxRuntimeExports.jsx("ul", { children: jsxRuntimeExports.jsxs("li", { children: [jsxRuntimeExports.jsx("code", { children: "value" }), " - The base value to scale"] }) })] })] }), jsxRuntimeExports.jsxs("div", { className: "api-item", children: [jsxRuntimeExports.jsx("div", { className: "api-signature", children: jsxRuntimeExports.jsx("code", { children: "useScaledStyle(styles: CSSProperties): CSSProperties" }) }), jsxRuntimeExports.jsx("p", { children: "Scales an entire style object based on the current breakpoint." }), jsxRuntimeExports.jsxs("div", { className: "api-params", children: [jsxRuntimeExports.jsx("strong", { children: "Parameters:" }), jsxRuntimeExports.jsx("ul", { children: jsxRuntimeExports.jsxs("li", { children: [jsxRuntimeExports.jsx("code", { children: "styles" }), " - The base styles object to scale"] }) })] })] }), jsxRuntimeExports.jsxs("div", { className: "api-item", children: [jsxRuntimeExports.jsx("div", { className: "api-signature", children: jsxRuntimeExports.jsx("code", { children: "useBreakpoint(): Breakpoint" }) }), jsxRuntimeExports.jsx("p", { children: "Returns the current active breakpoint information." }), jsxRuntimeExports.jsxs("div", { className: "api-returns", children: [jsxRuntimeExports.jsx("strong", { children: "Returns:" }), " Object with ", jsxRuntimeExports.jsx("code", { children: "name" }), ", ", jsxRuntimeExports.jsx("code", { children: "width" }), ", ", jsxRuntimeExports.jsx("code", { children: "height" }), ", and ", jsxRuntimeExports.jsx("code", { children: "alias" })] })] })] }), jsxRuntimeExports.jsxs("div", { className: "api-section", children: [jsxRuntimeExports.jsx("h4", { children: "Components" }), jsxRuntimeExports.jsxs("div", { className: "api-item", children: [jsxRuntimeExports.jsx("div", { className: "api-signature", children: jsxRuntimeExports.jsx("code", { children: '<ResponsiveProvider config={config}>' }) }), jsxRuntimeExports.jsx("p", { children: "Provides responsive context to child components." }), jsxRuntimeExports.jsxs("div", { className: "api-params", children: [jsxRuntimeExports.jsx("strong", { children: "Props:" }), jsxRuntimeExports.jsxs("ul", { children: [jsxRuntimeExports.jsxs("li", { children: [jsxRuntimeExports.jsx("code", { children: "config" }), " - Responsive configuration object"] }), jsxRuntimeExports.jsxs("li", { children: [jsxRuntimeExports.jsx("code", { children: "initialBreakpoint" }), " - Initial breakpoint (optional)"] }), jsxRuntimeExports.jsxs("li", { children: [jsxRuntimeExports.jsx("code", { children: "debug" }), " - Enable debug mode (optional)"] })] })] })] })] })] })] })), activeSection === 'best-practices' && (jsxRuntimeExports.jsxs("div", { className: "doc-section", children: [jsxRuntimeExports.jsx("h3", { children: "\u2728 Best Practices" }), jsxRuntimeExports.jsxs("div", { className: "practices-content", children: [jsxRuntimeExports.jsxs("div", { className: "practice-item", children: [jsxRuntimeExports.jsx("div", { className: "practice-icon", children: "\uD83C\uDFAF" }), jsxRuntimeExports.jsxs("div", { className: "practice-content", children: [jsxRuntimeExports.jsx("h4", { children: "Design for the Base Breakpoint" }), jsxRuntimeExports.jsx("p", { children: "Always design and develop for your base breakpoint first (usually desktop at 1920\u00D71080). Let React Responsive Easy handle the scaling to other breakpoints automatically." })] })] }), jsxRuntimeExports.jsxs("div", { className: "practice-item", children: [jsxRuntimeExports.jsx("div", { className: "practice-icon", children: "\u26A1" }), jsxRuntimeExports.jsxs("div", { className: "practice-content", children: [jsxRuntimeExports.jsx("h4", { children: "Optimize Performance" }), jsxRuntimeExports.jsx("p", { children: "Use memoization for expensive calculations and avoid unnecessary re-renders. The performance panel in this addon helps you identify bottlenecks." })] })] }), jsxRuntimeExports.jsxs("div", { className: "practice-item", children: [jsxRuntimeExports.jsx("div", { className: "practice-icon", children: "\uD83E\uDDEA" }), jsxRuntimeExports.jsxs("div", { className: "practice-content", children: [jsxRuntimeExports.jsx("h4", { children: "Test Across Breakpoints" }), jsxRuntimeExports.jsx("p", { children: "Use the breakpoint preview in this addon to test your components across all supported screen sizes and ensure consistent behavior." })] })] }), jsxRuntimeExports.jsxs("div", { className: "practice-item", children: [jsxRuntimeExports.jsx("div", { className: "practice-icon", children: "\uD83C\uDFA8" }), jsxRuntimeExports.jsxs("div", { className: "practice-content", children: [jsxRuntimeExports.jsx("h4", { children: "Maintain Visual Hierarchy" }), jsxRuntimeExports.jsx("p", { children: "Ensure that relative sizes and relationships between elements are preserved across breakpoints. Use proportional scaling for consistent design." })] })] }), jsxRuntimeExports.jsxs("div", { className: "practice-item", children: [jsxRuntimeExports.jsx("div", { className: "practice-icon", children: "\u267F" }), jsxRuntimeExports.jsxs("div", { className: "practice-content", children: [jsxRuntimeExports.jsx("h4", { children: "Consider Accessibility" }), jsxRuntimeExports.jsx("p", { children: "Ensure text remains readable, touch targets stay accessible, and focus indicators are visible across all breakpoints." })] })] }), jsxRuntimeExports.jsxs("div", { className: "practice-item", children: [jsxRuntimeExports.jsx("div", { className: "practice-icon", children: "\uD83D\uDCCA" }), jsxRuntimeExports.jsxs("div", { className: "practice-content", children: [jsxRuntimeExports.jsx("h4", { children: "Monitor Performance" }), jsxRuntimeExports.jsx("p", { children: "Regularly check the performance metrics to ensure your responsive components don't negatively impact user experience." })] })] })] })] }))] }), jsxRuntimeExports.jsx("style", { children: `
        .responsive-documentation {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .doc-nav {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
          overflow-x: auto;
        }

        .nav-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: none;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-button:hover {
          color: #333;
          background: #e9ecef;
        }

        .nav-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background: white;
        }

        .doc-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .doc-section h3 {
          margin: 0 0 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .overview-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .config-summary,
        .breakpoints-summary {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 12px;
        }

        .config-summary h4,
        .breakpoints-summary h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
        }

        .config-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .config-item {
          font-size: 11px;
          color: #6c757d;
        }

        .breakpoints-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .breakpoint-summary {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }

        .bp-icon {
          width: 16px;
          text-align: center;
        }

        .bp-name {
          font-weight: 500;
          color: #495057;
        }

        .bp-size {
          color: #6c757d;
          margin-left: auto;
        }

        .examples-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .example-block h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
        }

        .code-block {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 12px;
          font-size: 10px;
          font-family: 'SF Mono', monospace;
          overflow-x: auto;
          white-space: pre;
          margin: 0;
          line-height: 1.4;
        }

        .api-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .api-section h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 4px;
        }

        .api-item {
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .api-signature {
          margin-bottom: 8px;
        }

        .api-signature code {
          background: #e9ecef;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 10px;
          font-family: 'SF Mono', monospace;
        }

        .api-item p {
          margin: 0 0 8px 0;
          font-size: 11px;
          color: #6c757d;
        }

        .api-params,
        .api-returns {
          font-size: 10px;
          color: #495057;
        }

        .api-params ul,
        .api-returns ul {
          margin: 4px 0 0 16px;
          padding: 0;
        }

        .api-params li {
          margin-bottom: 2px;
        }

        .practices-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .practice-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .practice-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .practice-content h4 {
          margin: 0 0 6px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
        }

        .practice-content p {
          margin: 0;
          font-size: 11px;
          color: #6c757d;
          line-height: 1.4;
        }
      ` })] }));
};
function getBreakpointIcon$1(breakpoint) {
    if (breakpoint.width <= 480)
        return '📱';
    if (breakpoint.width <= 768)
        return '📱';
    if (breakpoint.width <= 1024)
        return '💻';
    if (breakpoint.width <= 1440)
        return '🖥️';
    return '🖥️';
}

const ResponsivePanel = ({ active, api }) => {
    const [state, setState] = require$$0.useState({
        currentBreakpoint: null,
        availableBreakpoints: [],
        isOverlayVisible: false,
        isPerformanceVisible: true,
        performanceData: null,
        config: null
    });
    const [activeTab, setActiveTab] = require$$0.useState('controls');
    // Load story parameters and update state
    require$$0.useEffect(() => {
        const updateFromStory = () => {
            const storyData = api.getCurrentStoryData();
            const parameters = storyData?.parameters?.responsiveEasy;
            if (parameters) {
                setState(prevState => ({
                    ...prevState,
                    config: parameters.config ?? null,
                    availableBreakpoints: parameters.breakpoints ?? [],
                    currentBreakpoint: parameters.breakpoints?.[0] ?? null
                }));
            }
        };
        // Listen for story changes
        api.on('storyChanged', updateFromStory);
        updateFromStory();
        return () => {
            api.off('storyChanged', updateFromStory);
        };
    }, [api]);
    // Handle breakpoint changes
    const handleBreakpointChange = require$$0.useCallback((breakpoint) => {
        setState(prevState => ({
            ...prevState,
            currentBreakpoint: breakpoint
        }));
        // Emit event to update viewport
        api.emit(EVENTS.BREAKPOINT_CHANGED, { breakpoint });
    }, [api]);
    // Handle overlay toggle
    const handleOverlayToggle = require$$0.useCallback(() => {
        setState(prevState => {
            const newOverlayState = !prevState.isOverlayVisible;
            // Emit event to toggle overlay in preview
            api.emit(EVENTS.TOGGLE_OVERLAY, { visible: newOverlayState });
            return {
                ...prevState,
                isOverlayVisible: newOverlayState
            };
        });
    }, [api]);
    // Handle config updates
    const handleConfigUpdate = require$$0.useCallback((config) => {
        setState(prevState => ({
            ...prevState,
            config
        }));
        // Emit event to update config in preview
        api.emit(EVENTS.CONFIG_UPDATED, { config });
    }, [api]);
    // Handle reset viewport
    const handleResetViewport = require$$0.useCallback(() => {
        api.emit(EVENTS.RESET_VIEWPORT);
    }, [api]);
    // Listen for performance data updates
    require$$0.useEffect(() => {
        const handlePerformanceData = (data) => {
            setState(prevState => ({
                ...prevState,
                performanceData: data
            }));
        };
        api.on(EVENTS.PERFORMANCE_DATA, handlePerformanceData);
        return () => {
            api.off(EVENTS.PERFORMANCE_DATA, handlePerformanceData);
        };
    }, [api]);
    if (!active) {
        return null;
    }
    return (jsxRuntimeExports.jsxs(components.AddonPanel, { active: active, children: [jsxRuntimeExports.jsxs("div", { className: "rre-addon-panel", children: [jsxRuntimeExports.jsxs("div", { className: "panel-header", children: [jsxRuntimeExports.jsxs("div", { className: "panel-title", children: [jsxRuntimeExports.jsx("h2", { children: "React Responsive Easy" }), state.currentBreakpoint && (jsxRuntimeExports.jsxs("div", { className: "current-breakpoint", children: [state.currentBreakpoint.name, " (", state.currentBreakpoint.width, "\u00D7", state.currentBreakpoint.height, ")"] }))] }), jsxRuntimeExports.jsxs("div", { className: "panel-actions", children: [jsxRuntimeExports.jsx("button", { className: `btn btn-sm ${state.isOverlayVisible ? 'btn-primary' : 'btn-secondary'}`, onClick: handleOverlayToggle, title: "Toggle responsive overlay", children: "\uD83D\uDC41\uFE0F Overlay" }), jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-secondary", onClick: handleResetViewport, title: "Reset viewport", children: "\uD83D\uDD04 Reset" })] })] }), jsxRuntimeExports.jsxs("div", { className: "panel-tabs", children: [jsxRuntimeExports.jsx("button", { className: `tab-button ${activeTab === 'controls' ? 'active' : ''}`, onClick: () => setActiveTab('controls'), children: "\u2699\uFE0F Controls" }), jsxRuntimeExports.jsx("button", { className: `tab-button ${activeTab === 'performance' ? 'active' : ''}`, onClick: () => setActiveTab('performance'), children: "\uD83D\uDCCA Performance" }), jsxRuntimeExports.jsx("button", { className: `tab-button ${activeTab === 'preview' ? 'active' : ''}`, onClick: () => setActiveTab('preview'), children: "\uD83D\uDC41\uFE0F Preview" }), jsxRuntimeExports.jsx("button", { className: `tab-button ${activeTab === 'docs' ? 'active' : ''}`, onClick: () => setActiveTab('docs'), children: "\uD83D\uDCDA Docs" })] }), jsxRuntimeExports.jsxs("div", { className: "panel-content", children: [activeTab === 'controls' && (jsxRuntimeExports.jsx(ResponsiveControls, { state: state, onBreakpointChange: handleBreakpointChange, onConfigUpdate: handleConfigUpdate })), activeTab === 'performance' && (jsxRuntimeExports.jsx(PerformanceMetrics, { data: state.performanceData, isVisible: state.isPerformanceVisible })), activeTab === 'preview' && (jsxRuntimeExports.jsx(BreakpointPreview, { breakpoints: state.availableBreakpoints, currentBreakpoint: state.currentBreakpoint, onBreakpointChange: handleBreakpointChange })), activeTab === 'docs' && (jsxRuntimeExports.jsx(ResponsiveDocumentation, { config: state.config, breakpoints: state.availableBreakpoints }))] })] }), jsxRuntimeExports.jsx("style", { children: `
        .rre-addon-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .panel-title h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .current-breakpoint {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }

        .panel-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .panel-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background: white;
        }

        .tab-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: none;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          color: #333;
          background: #f8f9fa;
        }

        .tab-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
      ` })] }));
};

const BreakpointToolbar = ({ api }) => {
    const [currentBreakpoint, setCurrentBreakpoint] = require$$0.useState(null);
    const [availableBreakpoints, setAvailableBreakpoints] = require$$0.useState(() => [...DEFAULT_BREAKPOINTS]);
    const [isExpanded, setIsExpanded] = require$$0.useState(false);
    // Load breakpoints from story parameters
    require$$0.useEffect(() => {
        const updateBreakpoints = () => {
            const storyData = api.getCurrentStoryData();
            const parameters = storyData?.parameters?.responsiveEasy;
            if (parameters?.breakpoints) {
                setAvailableBreakpoints([...parameters.breakpoints]);
                setCurrentBreakpoint(parameters.breakpoints[0]);
            }
            else {
                setAvailableBreakpoints([...DEFAULT_BREAKPOINTS]);
                setCurrentBreakpoint(DEFAULT_BREAKPOINTS[0]);
            }
        };
        api.on('storyChanged', updateBreakpoints);
        updateBreakpoints();
        return () => {
            api.off('storyChanged', updateBreakpoints);
        };
    }, [api]);
    // Listen for breakpoint changes from panel
    require$$0.useEffect(() => {
        const handleBreakpointChange = ({ breakpoint }) => {
            setCurrentBreakpoint(breakpoint);
            // Update Storybook viewport
            api.setQueryParams({
                viewMode: 'story',
                viewport: `${breakpoint.width}x${breakpoint.height}`
            });
        };
        api.on(EVENTS.BREAKPOINT_CHANGED, handleBreakpointChange);
        return () => {
            api.off(EVENTS.BREAKPOINT_CHANGED, handleBreakpointChange);
        };
    }, [api]);
    const handleBreakpointSelect = (breakpoint) => {
        setCurrentBreakpoint(breakpoint);
        setIsExpanded(false);
        // Emit breakpoint change event
        api.emit(EVENTS.BREAKPOINT_CHANGED, { breakpoint });
        // Update viewport in Storybook
        api.setQueryParams({
            viewMode: 'story',
            viewport: `${breakpoint.width}x${breakpoint.height}`
        });
    };
    const breakpointOptions = availableBreakpoints.map((breakpoint) => ({
        id: breakpoint.alias,
        title: breakpoint.name,
        value: breakpoint,
        right: `${breakpoint.width}×${breakpoint.height}`,
        active: currentBreakpoint?.alias === breakpoint.alias,
        onClick: () => handleBreakpointSelect(breakpoint)
    }));
    const currentIcon = getBreakpointIcon(currentBreakpoint);
    const currentLabel = currentBreakpoint ?
        `${currentBreakpoint.name} (${currentBreakpoint.width}×${currentBreakpoint.height})` :
        'Select Breakpoint';
    return (jsxRuntimeExports.jsx(components.WithTooltip, { placement: "top", trigger: "click", tooltipShown: isExpanded, onVisibilityChange: setIsExpanded, tooltip: 
        // @ts-ignore - React type conflict with bigint in ReactNode
        jsxRuntimeExports.jsx(components.TooltipLinkList, { links: breakpointOptions }), children: 
        // @ts-ignore - React type conflict with bigint in ReactNode
        jsxRuntimeExports.jsxs(components.IconButton, { title: currentLabel, active: isExpanded, placeholder: "", onPointerEnterCapture: () => { }, onPointerLeaveCapture: () => { }, children: [jsxRuntimeExports.jsx("span", { style: { fontSize: '14px' }, children: currentIcon }), jsxRuntimeExports.jsx("span", { style: {
                        marginLeft: '4px',
                        fontSize: '11px',
                        maxWidth: '80px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }, children: currentBreakpoint?.name ?? 'Responsive' })] }, "responsive-breakpoint-selector") }));
};
function getBreakpointIcon(breakpoint) {
    if (!breakpoint)
        return '📱';
    if (breakpoint.width <= 480)
        return '📱'; // Mobile
    if (breakpoint.width <= 768)
        return '📱'; // Mobile
    if (breakpoint.width <= 1024)
        return '💻'; // Tablet
    if (breakpoint.width <= 1440)
        return '🖥️'; // Laptop
    return '🖥️'; // Desktop
}

// Register the addon
addons.addons.register(ADDON_ID, (api) => {
    // Register the panel
    addons.addons.add(PANEL_ID, {
        type: addons.types.PANEL,
        title: 'Responsive',
        match: ({ viewMode }) => viewMode === 'story',
        render: ({ active, key }) => (jsxRuntimeExports.jsx(ResponsivePanel, { active: active ?? false, api: api }, String(key ?? 'responsive-panel'))),
        paramKey: 'responsiveEasy'
    });
    // Register the toolbar
    addons.addons.add(TOOLBAR_ID, {
        type: addons.types.TOOL,
        title: 'Breakpoint Selector',
        match: ({ viewMode }) => viewMode === 'story',
        render: () => jsxRuntimeExports.jsx(BreakpointToolbar, { api: api })
    });
});
//# sourceMappingURL=manager.js.map
