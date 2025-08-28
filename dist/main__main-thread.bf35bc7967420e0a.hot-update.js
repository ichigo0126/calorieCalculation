(function(){
  'use strict';
  var g = (new Function('return this;'))();
  function __init_card_bundle__(lynxCoreInject) {
    g.__bundle__holder = undefined;
    var globDynamicComponentEntry = g.globDynamicComponentEntry || '__Card__';
    var tt = lynxCoreInject.tt;
    tt.define("main__main-thread.bf35bc7967420e0a.hot-update.js", function(require, module, exports, __Card,setTimeout,setInterval,clearInterval,clearTimeout,NativeModules,tt,console,__Component,__ReactLynx,nativeAppId,__Behavior,LynxJSBI,lynx,window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,__WebSocket__,webkit,Reporter,print,global,requestAnimationFrame,cancelAnimationFrame) {
lynx = lynx || {};
lynx.targetSdkVersion=lynx.targetSdkVersion||"3.2";
var Promise = lynx.Promise;
fetch = fetch || lynx.fetch;
requestAnimationFrame = requestAnimationFrame || lynx.requestAnimationFrame;
cancelAnimationFrame = cancelAnimationFrame || lynx.cancelAnimationFrame;

// This needs to be wrapped in an IIFE because it needs to be isolated against Lynx injected variables.
(() => {
// lynx chunks entries
if (!lynx.__chunk_entries__) {
  // Initialize once
  lynx.__chunk_entries__ = {};
}
if (!lynx.__chunk_entries__["main__main-thread"]) {
  lynx.__chunk_entries__["main__main-thread"] = globDynamicComponentEntry;
} else {
  globDynamicComponentEntry = lynx.__chunk_entries__["main__main-thread"];
}

"use strict";
exports.ids = ["main__main-thread"];
exports.modules = {
"(react:main-thread)/./src/components/common/InputField.tsx": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  InputField: () => (InputField)
});
/* ESM import */var _lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js");
/* ESM import */var _lynx_js_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/index.js");
/* ESM import */var _InputModal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("(react:main-thread)/./src/components/common/InputModal.tsx");



const __snapshot_ecdc7_d1471_1 = /*#__PURE__*/ (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .createSnapshot */.createSnapshot)("__snapshot_ecdc7_d1471_1", function() {
    const pageId = (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__pageId */.__pageId);
    const el = __CreateView(pageId);
    __SetClasses(el, "input-container");
    const el1 = __CreateView(pageId);
    __AppendElement(el, el1);
    const el2 = __CreateText(pageId);
    __SetClasses(el2, "input-text");
    __AppendElement(el1, el2);
    const el3 = __CreateView(pageId);
    __SetClasses(el3, "input-icon");
    __AppendElement(el1, el3);
    const el4 = __CreateText(pageId);
    __SetClasses(el4, "input-icon-text");
    __AppendElement(el3, el4);
    const el5 = __CreateRawText("\u270F\uFE0F");
    __AppendElement(el4, el5);
    return [
        el,
        el1,
        el2,
        el3,
        el4,
        el5
    ];
}, [
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[1], ctx.__values[0] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 1, "bindEvent", "tap", '')
], [
    [
        (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartChildren */.__DynamicPartChildren),
        2
    ]
], undefined, globDynamicComponentEntry, null);
function InputField({ value, placeholder, type = 'text', className = '', onInput }) {
    const [showModal, setShowModal] = (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, []);
    const handleModalConfirm = (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, [
        onInput
    ]);
    const handleModalCancel = (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, []);
    const displayValue = ()=>{
        if (!value) return placeholder;
        if (type === 'password') return "\u25CF".repeat(value.length);
        return value;
    };
    const getClassName = ()=>{
        let baseClass = 'input-field';
        if (!value) baseClass += ' input-field-placeholder';
        if (className) baseClass += ` ${className}`;
        return baseClass;
    };
    const getModalTitle = ()=>{
        if (type === 'password') return "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\uFF086\u6587\u5B57\u4EE5\u4E0A\uFF09";
        else if (type === 'email') return "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B";
        return placeholder;
    };
    return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(__snapshot_ecdc7_d1471_1, {
                values: [
                    getClassName(),
                    1
                ],
                children: displayValue()
            }, void 0, false, {
                fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/components/common/InputField.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_InputModal_js__WEBPACK_IMPORTED_MODULE_2__.InputModal, {
                visible: showModal,
                title: getModalTitle(),
                placeholder: placeholder,
                value: type === 'password' ? '' : value,
                type: type,
                onConfirm: handleModalConfirm,
                onCancel: handleModalCancel
            }, void 0, false, {
                fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/components/common/InputField.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
// noop fns to prevent runtime errors during initialization
if (typeof globalThis !== "undefined") {
    globalThis.$RefreshReg$ = function() {};
    globalThis.$RefreshSig$ = function() {
        return function(type) {
            return type;
        };
    };
}


}),

};
exports.runtime = function(__webpack_require__) {
// webpack/runtime/get_full_hash
(() => {
__webpack_require__.h = () => ("ca57bcc857bf3280")
})();
// webpack/runtime/lynx css hot update
(() => {

__webpack_require__.cssHotUpdateList = [["main__main-thread",".rspeedy/main__main-thread/main__main-thread.bf35bc7967420e0a.css.hot-update.json"]];

})();

}
;
;

})();
    });
    return tt.require("main__main-thread.bf35bc7967420e0a.hot-update.js");
  };
  if (g && g.bundleSupportLoadScript){
    var res = {init: __init_card_bundle__};
    g.__bundle__holder = res;
    return res;
  } else {
    __init_card_bundle__({"tt": tt});
  };
})();

//# sourceMappingURL=http://192.168.0.239:3000/main__main-thread.bf35bc7967420e0a.hot-update.js.map