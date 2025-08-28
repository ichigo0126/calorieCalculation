(function(){
  'use strict';
  var g = (new Function('return this;'))();
  function __init_card_bundle__(lynxCoreInject) {
    g.__bundle__holder = undefined;
    var globDynamicComponentEntry = g.globDynamicComponentEntry || '__Card__';
    var tt = lynxCoreInject.tt;
    tt.define("main__main-thread.db18e25076d1a36f.hot-update.js", function(require, module, exports, __Card,setTimeout,setInterval,clearInterval,clearTimeout,NativeModules,tt,console,__Component,__ReactLynx,nativeAppId,__Behavior,LynxJSBI,lynx,window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,__WebSocket__,webkit,Reporter,print,global,requestAnimationFrame,cancelAnimationFrame) {
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
"(react:main-thread)/./src/App.tsx": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  App: () => (App)
});
/* ESM import */var _lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js");
/* ESM import */var _lynx_js_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/index.js");
/* ESM import */var _contexts_AuthContext_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("(react:main-thread)/./src/contexts/AuthContext.tsx");
/* ESM import */var _components_TabNavigation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("(react:main-thread)/./src/components/TabNavigation.tsx");
/* ESM import */var _components_auth_AuthScreen_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("(react:main-thread)/./src/components/auth/AuthScreen.tsx");
/* ESM import */var _components_auth_ProfileSetupScreen_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("(react:main-thread)/./src/components/auth/ProfileSetupScreen.tsx");
/* ESM import */var _App_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("(react:main-thread)/./src/App.css");







const __snapshot_835da_86942_1 = /*#__PURE__*/ (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .createSnapshot */.createSnapshot)("__snapshot_835da_86942_1", function() {
    const pageId = (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__pageId */.__pageId);
    const el = __CreateView(pageId);
    __SetClasses(el, "app-container");
    const el1 = __CreateView(pageId);
    __SetClasses(el1, "loading-screen");
    __AppendElement(el, el1);
    const el2 = __CreateText(pageId);
    __SetClasses(el2, "loading-text");
    __AppendElement(el1, el2);
    const el3 = __CreateRawText("\u8AAD\u307F\u8FBC\u307F\u4E2D...");
    __AppendElement(el2, el3);
    return [
        el,
        el1,
        el2,
        el3
    ];
}, null, null, undefined, globDynamicComponentEntry, null);
const __snapshot_835da_86942_2 = /*#__PURE__*/ (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .createSnapshot */.createSnapshot)("__snapshot_835da_86942_2", function() {
    const pageId = (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__pageId */.__pageId);
    const el = __CreateView(pageId);
    __SetClasses(el, "app-container");
    return [
        el
    ];
}, null, (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartChildren_0 */.__DynamicPartChildren_0), undefined, globDynamicComponentEntry, null);
const __snapshot_835da_86942_3 = /*#__PURE__*/ (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .createSnapshot */.createSnapshot)("__snapshot_835da_86942_3", function() {
    const pageId = (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__pageId */.__pageId);
    const el = __CreateView(pageId);
    __SetClasses(el, "app-container");
    return [
        el
    ];
}, null, (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartChildren_0 */.__DynamicPartChildren_0), undefined, globDynamicComponentEntry, null);
const __snapshot_835da_86942_4 = /*#__PURE__*/ (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .createSnapshot */.createSnapshot)("__snapshot_835da_86942_4", function() {
    const pageId = (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__pageId */.__pageId);
    const el = __CreateView(pageId);
    __SetClasses(el, "app-container");
    return [
        el
    ];
}, null, (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartChildren_0 */.__DynamicPartChildren_0), undefined, globDynamicComponentEntry, null);
function AppContent(props) {
    const { user, loading, needsProfileSetup, saveUserProfile } = (0,_contexts_AuthContext_js__WEBPACK_IMPORTED_MODULE_2__.useAuth)();
    (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useEffect)();
    (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useEffect)();
    const handleProfileComplete = (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ()=>{}, [
        saveUserProfile
    ]);
    // 認証状態をロード中の場合
    if (loading) return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(__snapshot_835da_86942_1, {}, void 0, false, {
        fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
        lineNumber: 33,
        columnNumber: 7
    }, this);
    // 認証されていない場合は認証画面を表示
    if (!user) return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(__snapshot_835da_86942_2, {
        children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_auth_AuthScreen_js__WEBPACK_IMPORTED_MODULE_4__.AuthScreen, {}, void 0, false, {
            fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
            lineNumber: 45,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
        lineNumber: 44,
        columnNumber: 7
    }, this);
    // ログイン済みだがプロフィール未設定の場合はプロフィール設定画面を表示
    if (needsProfileSetup) return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(__snapshot_835da_86942_3, {
        children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_auth_ProfileSetupScreen_js__WEBPACK_IMPORTED_MODULE_5__.ProfileSetupScreen, {
            onComplete: handleProfileComplete
        }, void 0, false, {
            fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
            lineNumber: 54,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
        lineNumber: 53,
        columnNumber: 7
    }, this);
    // 認証済み且つプロフィール設定済みの場合はメインアプリを表示
    return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(__snapshot_835da_86942_4, {
        children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_TabNavigation_js__WEBPACK_IMPORTED_MODULE_3__.TabNavigation, {
            onRender: props.onRender
        }, void 0, false, {
            fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
function App(props) {
    return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext_js__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {
        children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppContent, {
            onRender: props.onRender
        }, void 0, false, {
            fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/App.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
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
"(react:main-thread)/./src/components/auth/ProfileSetupScreen.tsx": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ProfileSetupScreen: () => (ProfileSetupScreen)
});
/* ESM import */var _lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js");
/* ESM import */var _lynx_js_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/index.js");
/* ESM import */var _common_InputField_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("(react:main-thread)/./src/components/common/InputField.tsx");



const __snapshot_50f50_b95f2_1 = /*#__PURE__*/ (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .createSnapshot */.createSnapshot)("__snapshot_50f50_b95f2_1", function() {
    const pageId = (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__pageId */.__pageId);
    const el = __CreateView(pageId);
    __SetClasses(el, "profile-setup-screen");
    const el1 = __CreateView(pageId);
    __SetClasses(el1, "profile-setup-header");
    __AppendElement(el, el1);
    const el2 = __CreateText(pageId);
    __SetClasses(el2, "profile-setup-title");
    __AppendElement(el1, el2);
    const el3 = __CreateRawText("\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u8A2D\u5B9A");
    __AppendElement(el2, el3);
    const el4 = __CreateText(pageId);
    __SetClasses(el4, "profile-setup-subtitle");
    __AppendElement(el1, el4);
    const el5 = __CreateRawText("\u3088\u308A\u6B63\u78BA\u306A\u30AB\u30ED\u30EA\u30FC\u8A08\u7B97\u306E\u305F\u3081\u3001\u57FA\u672C\u60C5\u5831\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
    __AppendElement(el4, el5);
    const el6 = __CreateView(pageId);
    __SetClasses(el6, "profile-setup-scroll");
    __AppendElement(el, el6);
    const el7 = __CreateView(pageId);
    __SetClasses(el7, "profile-setup-form");
    __AppendElement(el6, el7);
    const el8 = __CreateView(pageId);
    __SetClasses(el8, "form-group");
    __AppendElement(el7, el8);
    const el9 = __CreateText(pageId);
    __SetClasses(el9, "form-label");
    __AppendElement(el8, el9);
    const el10 = __CreateRawText("\u8EAB\u9577 (cm)");
    __AppendElement(el9, el10);
    const el11 = __CreateWrapperElement(pageId);
    __AppendElement(el8, el11);
    const el12 = __CreateView(pageId);
    __SetClasses(el12, "form-group");
    __AppendElement(el7, el12);
    const el13 = __CreateText(pageId);
    __SetClasses(el13, "form-label");
    __AppendElement(el12, el13);
    const el14 = __CreateRawText("\u4F53\u91CD (kg)");
    __AppendElement(el13, el14);
    const el15 = __CreateWrapperElement(pageId);
    __AppendElement(el12, el15);
    const el16 = __CreateView(pageId);
    __SetClasses(el16, "form-group");
    __AppendElement(el7, el16);
    const el17 = __CreateText(pageId);
    __SetClasses(el17, "form-label");
    __AppendElement(el16, el17);
    const el18 = __CreateRawText("\u5E74\u9F62");
    __AppendElement(el17, el18);
    const el19 = __CreateWrapperElement(pageId);
    __AppendElement(el16, el19);
    const el20 = __CreateView(pageId);
    __SetClasses(el20, "form-group");
    __AppendElement(el7, el20);
    const el21 = __CreateText(pageId);
    __SetClasses(el21, "form-label");
    __AppendElement(el20, el21);
    const el22 = __CreateRawText("\u6027\u5225");
    __AppendElement(el21, el22);
    const el23 = __CreateView(pageId);
    __SetClasses(el23, "gender-buttons");
    __AppendElement(el20, el23);
    const el24 = __CreateView(pageId);
    __AppendElement(el23, el24);
    const el25 = __CreateText(pageId);
    __SetClasses(el25, "gender-button-text");
    __AppendElement(el24, el25);
    const el26 = __CreateRawText("\u7537\u6027");
    __AppendElement(el25, el26);
    const el27 = __CreateView(pageId);
    __AppendElement(el23, el27);
    const el28 = __CreateText(pageId);
    __SetClasses(el28, "gender-button-text");
    __AppendElement(el27, el28);
    const el29 = __CreateRawText("\u5973\u6027");
    __AppendElement(el28, el29);
    const el30 = __CreateView(pageId);
    __SetClasses(el30, "form-group");
    __AppendElement(el7, el30);
    const el31 = __CreateText(pageId);
    __SetClasses(el31, "form-label");
    __AppendElement(el30, el31);
    const el32 = __CreateRawText("\u6D3B\u52D5\u30EC\u30D9\u30EB");
    __AppendElement(el31, el32);
    const el33 = __CreateView(pageId);
    __SetClasses(el33, "activity-buttons");
    __AppendElement(el30, el33);
    const el34 = __CreateView(pageId);
    __AppendElement(el33, el34);
    const el35 = __CreateText(pageId);
    __SetClasses(el35, "activity-button-text");
    __AppendElement(el34, el35);
    const el36 = __CreateRawText("\u4F4E\u3044");
    __AppendElement(el35, el36);
    const el37 = __CreateText(pageId);
    __SetClasses(el37, "activity-button-desc");
    __AppendElement(el34, el37);
    const el38 = __CreateRawText("\u30C7\u30B9\u30AF\u30EF\u30FC\u30AF\u4E2D\u5FC3");
    __AppendElement(el37, el38);
    const el39 = __CreateView(pageId);
    __AppendElement(el33, el39);
    const el40 = __CreateText(pageId);
    __SetClasses(el40, "activity-button-text");
    __AppendElement(el39, el40);
    const el41 = __CreateRawText("\u3084\u3084\u4F4E\u3044");
    __AppendElement(el40, el41);
    const el42 = __CreateText(pageId);
    __SetClasses(el42, "activity-button-desc");
    __AppendElement(el39, el42);
    const el43 = __CreateRawText("\u8EFD\u3044\u904B\u52D5\u6642\u3005");
    __AppendElement(el42, el43);
    const el44 = __CreateView(pageId);
    __AppendElement(el33, el44);
    const el45 = __CreateText(pageId);
    __SetClasses(el45, "activity-button-text");
    __AppendElement(el44, el45);
    const el46 = __CreateRawText("\u666E\u901A");
    __AppendElement(el45, el46);
    const el47 = __CreateText(pageId);
    __SetClasses(el47, "activity-button-desc");
    __AppendElement(el44, el47);
    const el48 = __CreateRawText("\u5B9A\u671F\u7684\u306A\u904B\u52D5");
    __AppendElement(el47, el48);
    const el49 = __CreateView(pageId);
    __AppendElement(el33, el49);
    const el50 = __CreateText(pageId);
    __SetClasses(el50, "activity-button-text");
    __AppendElement(el49, el50);
    const el51 = __CreateRawText("\u9AD8\u3044");
    __AppendElement(el50, el51);
    const el52 = __CreateText(pageId);
    __SetClasses(el52, "activity-button-desc");
    __AppendElement(el49, el52);
    const el53 = __CreateRawText("\u6FC0\u3057\u3044\u904B\u52D5\u7FD2\u6163");
    __AppendElement(el52, el53);
    const el54 = __CreateView(pageId);
    __SetClasses(el54, "profile-setup-buttons");
    __AppendElement(el7, el54);
    const el55 = __CreateView(pageId);
    __AppendElement(el54, el55);
    const el56 = __CreateText(pageId);
    __SetClasses(el56, "complete-button-text");
    __AppendElement(el55, el56);
    const el57 = __CreateRawText("\u5B8C\u4E86");
    __AppendElement(el56, el57);
    return [
        el,
        el1,
        el2,
        el3,
        el4,
        el5,
        el6,
        el7,
        el8,
        el9,
        el10,
        el11,
        el12,
        el13,
        el14,
        el15,
        el16,
        el17,
        el18,
        el19,
        el20,
        el21,
        el22,
        el23,
        el24,
        el25,
        el26,
        el27,
        el28,
        el29,
        el30,
        el31,
        el32,
        el33,
        el34,
        el35,
        el36,
        el37,
        el38,
        el39,
        el40,
        el41,
        el42,
        el43,
        el44,
        el45,
        el46,
        el47,
        el48,
        el49,
        el50,
        el51,
        el52,
        el53,
        el54,
        el55,
        el56,
        el57
    ];
}, [
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[24], ctx.__values[0] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 24, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[27], ctx.__values[2] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 27, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[34], ctx.__values[4] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 34, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[39], ctx.__values[6] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 39, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[44], ctx.__values[8] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 44, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[49], ctx.__values[10] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 49, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) __SetClasses(ctx.__elements[55], ctx.__values[12] || '');
    },
    (snapshot, index, oldValue)=>(__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .updateEvent */.updateEvent)(snapshot, index, oldValue, 55, "bindEvent", "tap", '')
], [
    [
        (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartSlot */.__DynamicPartSlot),
        11
    ],
    [
        (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartSlot */.__DynamicPartSlot),
        15
    ],
    [
        (__webpack_require__("(react:main-thread)/./node_modules/@lynx-js/react/runtime/lib/internal.js")/* .__DynamicPartSlot */.__DynamicPartSlot),
        19
    ]
], undefined, globDynamicComponentEntry, null);
function ProfileSetupScreen({ onComplete }) {
    const [profile, setProfile] = (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        height: '',
        weight: '',
        age: '',
        gender: '',
        activityLevel: ''
    });
    const handleInputChange = (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, []);
    (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, []);
    (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, []);
    const isFormValid = profile.height && profile.weight && profile.age && profile.gender && profile.activityLevel;
    (0,_lynx_js_react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{}, [
        profile,
        onComplete,
        isFormValid
    ]);
    return /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(__snapshot_50f50_b95f2_1, {
        values: [
            `gender-button ${profile.gender === 'male' ? 'selected' : ''}`,
            1,
            `gender-button ${profile.gender === 'female' ? 'selected' : ''}`,
            1,
            `activity-button ${profile.activityLevel === 'sedentary' ? 'selected' : ''}`,
            1,
            `activity-button ${profile.activityLevel === 'light' ? 'selected' : ''}`,
            1,
            `activity-button ${profile.activityLevel === 'moderate' ? 'selected' : ''}`,
            1,
            `activity-button ${profile.activityLevel === 'active' ? 'selected' : ''}`,
            1,
            `complete-button ${isFormValid ? '' : 'disabled'}`,
            1
        ],
        children: [
            /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("wrapper", {
                children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_common_InputField_js__WEBPACK_IMPORTED_MODULE_2__.InputField, {
                    value: profile.height,
                    placeholder: "\u4F8B: 170",
                    type: "text",
                    className: "profile-input",
                    onInput: (value)=>handleInputChange('height', value)
                }, void 0, false, {
                    fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/components/auth/ProfileSetupScreen.tsx",
                    lineNumber: 65,
                    columnNumber: 13
                }, this)
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("wrapper", {
                children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_common_InputField_js__WEBPACK_IMPORTED_MODULE_2__.InputField, {
                    value: profile.weight,
                    placeholder: "\u4F8B: 65",
                    type: "text",
                    className: "profile-input",
                    onInput: (value)=>handleInputChange('weight', value)
                }, void 0, false, {
                    fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/components/auth/ProfileSetupScreen.tsx",
                    lineNumber: 76,
                    columnNumber: 13
                }, this)
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("wrapper", {
                children: /*#__PURE__*/ (0,_lynx_js_react_lepus_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_common_InputField_js__WEBPACK_IMPORTED_MODULE_2__.InputField, {
                    value: profile.age,
                    placeholder: "\u4F8B: 25",
                    type: "text",
                    className: "profile-input",
                    onInput: (value)=>handleInputChange('age', value)
                }, void 0, false, {
                    fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/components/auth/ProfileSetupScreen.tsx",
                    lineNumber: 87,
                    columnNumber: 13
                }, this)
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "/Users/sakamaki/Documents/product/CalorieCalculation/src/components/auth/ProfileSetupScreen.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
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
__webpack_require__.h = () => ("bf35bc7967420e0a")
})();
// webpack/runtime/lynx css hot update
(() => {

__webpack_require__.cssHotUpdateList = [["main__main-thread",".rspeedy/main__main-thread/main__main-thread.db18e25076d1a36f.css.hot-update.json"]];

})();

}
;
;

})();
    });
    return tt.require("main__main-thread.db18e25076d1a36f.hot-update.js");
  };
  if (g && g.bundleSupportLoadScript){
    var res = {init: __init_card_bundle__};
    g.__bundle__holder = res;
    return res;
  } else {
    __init_card_bundle__({"tt": tt});
  };
})();

//# sourceMappingURL=http://192.168.0.239:3000/main__main-thread.db18e25076d1a36f.hot-update.js.map