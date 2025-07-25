/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-dev-runtime */ \"@emotion/react/jsx-dev-runtime\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"../node_modules/.pnpm/next@14.2.30_@babel+core@7.28.0_@opentelemetry+api@1.9.0_@playwright+test@1.54.1_react-_33d9124119630bbb54f77843f11b86fe/node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-themes */ \"../node_modules/.pnpm/next-themes@0.4.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next-themes/dist/index.mjs\");\n/* harmony import */ var sonner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sonner */ \"../node_modules/.pnpm/sonner@2.0.6_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/sonner/dist/index.mjs\");\n/* harmony import */ var _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @radix-ui/react-tooltip */ \"../node_modules/.pnpm/@radix-ui+react-tooltip@1.2.7_@types+react-dom@18.3.7_@types+react@18.3.23__@types+reac_50e390c4dabde08ed3112eb9f58da500/node_modules/@radix-ui/react-tooltip/dist/index.mjs\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var _tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tanstack/react-query-devtools */ \"@tanstack/react-query-devtools\");\n/* harmony import */ var _radix_ui_themes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @radix-ui/themes */ \"@radix-ui/themes\");\n/* harmony import */ var _radix_ui_themes_styles_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @radix-ui/themes/styles.css */ \"../node_modules/.pnpm/@radix-ui+themes@3.2.1_@types+react-dom@18.3.7_@types+react@18.3.23__@types+react@18.3._0b6dbb3128512a72800e62cce5da9623/node_modules/@radix-ui/themes/styles.css\");\n/* harmony import */ var _radix_ui_themes_styles_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_radix_ui_themes_styles_css__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _lovable_src_ui_kit_src_styles_globals_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../lovable-src/ui-kit/src/styles/globals.css */ \"../lovable-src/ui-kit/src/styles/globals.css\");\n/* harmony import */ var _lovable_src_ui_kit_src_styles_globals_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_lovable_src_ui_kit_src_styles_globals_css__WEBPACK_IMPORTED_MODULE_10__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_5__, _tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_6__, _radix_ui_themes__WEBPACK_IMPORTED_MODULE_7__]);\n([_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_5__, _tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_6__, _radix_ui_themes__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n\n// Import global styles\n\n\n// Create a client\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_5__.QueryClient({\n    defaultOptions: {\n        queries: {\n            refetchOnWindowFocus: false,\n            retry: 1,\n            staleTime: 5 * 60 * 1000\n        }\n    }\n});\n// Disable console.log in production\nif (false) {}\nfunction App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    // Handle route changes\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const handleRouteChange = (url)=>{\n            // You can add analytics or other route change logic here\n            console.log(`App is changing to ${url}`);\n        };\n        router.events.on(\"routeChangeStart\", handleRouteChange);\n        return ()=>{\n            router.events.off(\"routeChangeStart\", handleRouteChange);\n        };\n    }, [\n        router.events\n    ]);\n    return /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_5__.QueryClientProvider, {\n        client: queryClient,\n        children: [\n            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_themes__WEBPACK_IMPORTED_MODULE_3__.ThemeProvider, {\n                attribute: \"class\",\n                defaultTheme: \"system\",\n                enableSystem: true,\n                disableTransitionOnChange: true,\n                children: /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_themes__WEBPACK_IMPORTED_MODULE_7__.Theme, {\n                    children: /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_11__.TooltipProvider, {\n                        children: [\n                            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                                ...pageProps\n                            }, void 0, false, {\n                                fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n                                lineNumber: 57,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(sonner__WEBPACK_IMPORTED_MODULE_4__.Toaster, {\n                                position: \"top-center\",\n                                richColors: true,\n                                closeButton: true\n                            }, void 0, false, {\n                                fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n                                lineNumber: 58,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n                        lineNumber: 56,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n                    lineNumber: 55,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n                lineNumber: 54,\n                columnNumber: 7\n            }, this),\n             true && /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_6__.ReactQueryDevtools, {\n                initialIsOpen: false\n            }, void 0, false, {\n                fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n                lineNumber: 62,\n                columnNumber: 50\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/louisciccone/Desktop/Rythm_Daw/website/pages/_app.tsx\",\n        lineNumber: 53,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWtDO0FBQ007QUFDSTtBQUNYO0FBQ3lCO0FBQ2U7QUFDTDtBQUMzQjtBQUNKO0FBR3JDLHVCQUF1QjtBQUNRO0FBQzBCO0FBRXpELGtCQUFrQjtBQUNsQixNQUFNUyxjQUFjLElBQUlKLDhEQUFXQSxDQUFDO0lBQ2xDSyxnQkFBZ0I7UUFDZEMsU0FBUztZQUNQQyxzQkFBc0I7WUFDdEJDLE9BQU87WUFDUEMsV0FBVyxJQUFJLEtBQUs7UUFDdEI7SUFDRjtBQUNGO0FBRUEsb0NBQW9DO0FBQ3BDLElBQUlDLEtBQXlCLEVBQWMsRUFNMUM7QUFFYyxTQUFTTyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELE1BQU1DLFNBQVN4QixzREFBU0E7SUFFeEIsdUJBQXVCO0lBQ3ZCRCxnREFBU0EsQ0FBQztRQUNSLE1BQU0wQixvQkFBb0IsQ0FBQ0M7WUFDekIseURBQXlEO1lBQ3pEWCxRQUFRQyxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsRUFBRVUsSUFBSSxDQUFDO1FBQ3pDO1FBRUFGLE9BQU9HLE1BQU0sQ0FBQ0MsRUFBRSxDQUFDLG9CQUFvQkg7UUFDckMsT0FBTztZQUNMRCxPQUFPRyxNQUFNLENBQUNFLEdBQUcsQ0FBQyxvQkFBb0JKO1FBQ3hDO0lBQ0YsR0FBRztRQUFDRCxPQUFPRyxNQUFNO0tBQUM7SUFFbEIscUJBQ0UsdUVBQUN0QixzRUFBbUJBO1FBQUN5QixRQUFRdEI7OzBCQUMzQix1RUFBQ1Asc0RBQWFBO2dCQUFDOEIsV0FBVTtnQkFBUUMsY0FBYTtnQkFBU0MsWUFBWTtnQkFBQ0MseUJBQXlCOzBCQUMzRixxRkFBQzNCLG1EQUFLQTs4QkFDSixxRkFBQ0oscUVBQWVBOzswQ0FDZCx1RUFBQ21CO2dDQUFXLEdBQUdDLFNBQVM7Ozs7OzswQ0FDeEIsdUVBQUNyQiwyQ0FBT0E7Z0NBQUNpQyxVQUFTO2dDQUFhQyxVQUFVO2dDQUFDQyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBekRqRSxLQTZEZ0Msa0JBQWlCLHVFQUFDL0IsOEVBQWtCQTtnQkFBQ2dDLGVBQWU7Ozs7Ozs7Ozs7OztBQUdwRiIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnNpdGUvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICduZXh0LXRoZW1lcyc7XG5pbXBvcnQgeyBUb2FzdGVyIH0gZnJvbSAnc29ubmVyJztcbmltcG9ydCB7IFRvb2x0aXBQcm92aWRlciB9IGZyb20gJ0ByYWRpeC11aS9yZWFjdC10b29sdGlwJztcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCB7IFJlYWN0UXVlcnlEZXZ0b29scyB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeS1kZXZ0b29scyc7XG5pbXBvcnQgeyBUaGVtZSB9IGZyb20gJ0ByYWRpeC11aS90aGVtZXMnO1xuaW1wb3J0ICdAcmFkaXgtdWkvdGhlbWVzL3N0eWxlcy5jc3MnO1xuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcblxuLy8gSW1wb3J0IGdsb2JhbCBzdHlsZXNcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCAnLi4vLi4vbG92YWJsZS1zcmMvdWkta2l0L3NyYy9zdHlsZXMvZ2xvYmFscy5jc3MnO1xuXG4vLyBDcmVhdGUgYSBjbGllbnRcbmNvbnN0IHF1ZXJ5Q2xpZW50ID0gbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICBxdWVyaWVzOiB7XG4gICAgICByZWZldGNoT25XaW5kb3dGb2N1czogZmFsc2UsXG4gICAgICByZXRyeTogMSxcbiAgICAgIHN0YWxlVGltZTogNSAqIDYwICogMTAwMCwgLy8gNSBtaW51dGVzXG4gICAgfSxcbiAgfSxcbn0pO1xuXG4vLyBEaXNhYmxlIGNvbnNvbGUubG9nIGluIHByb2R1Y3Rpb25cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGNvbnNvbGUubG9nID0gKCkgPT4ge307XG4gIGNvbnNvbGUuZXJyb3IgPSAoKSA9PiB7fTtcbiAgY29uc29sZS5kZWJ1ZyA9ICgpID0+IHt9O1xuICBjb25zb2xlLmluZm8gPSAoKSA9PiB7fTtcbiAgY29uc29sZS53YXJuID0gKCkgPT4ge307XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIC8vIEhhbmRsZSByb3V0ZSBjaGFuZ2VzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlUm91dGVDaGFuZ2UgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIFlvdSBjYW4gYWRkIGFuYWx5dGljcyBvciBvdGhlciByb3V0ZSBjaGFuZ2UgbG9naWMgaGVyZVxuICAgICAgY29uc29sZS5sb2coYEFwcCBpcyBjaGFuZ2luZyB0byAke3VybH1gKTtcbiAgICB9O1xuXG4gICAgcm91dGVyLmV2ZW50cy5vbigncm91dGVDaGFuZ2VTdGFydCcsIGhhbmRsZVJvdXRlQ2hhbmdlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcm91dGVyLmV2ZW50cy5vZmYoJ3JvdXRlQ2hhbmdlU3RhcnQnLCBoYW5kbGVSb3V0ZUNoYW5nZSk7XG4gICAgfTtcbiAgfSwgW3JvdXRlci5ldmVudHNdKTtcblxuICByZXR1cm4gKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgPFRoZW1lUHJvdmlkZXIgYXR0cmlidXRlPVwiY2xhc3NcIiBkZWZhdWx0VGhlbWU9XCJzeXN0ZW1cIiBlbmFibGVTeXN0ZW0gZGlzYWJsZVRyYW5zaXRpb25PbkNoYW5nZT5cbiAgICAgICAgPFRoZW1lPlxuICAgICAgICAgIDxUb29sdGlwUHJvdmlkZXI+XG4gICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgICAgICA8VG9hc3RlciBwb3NpdGlvbj1cInRvcC1jZW50ZXJcIiByaWNoQ29sb3JzIGNsb3NlQnV0dG9uIC8+XG4gICAgICAgICAgPC9Ub29sdGlwUHJvdmlkZXI+XG4gICAgICAgIDwvVGhlbWU+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgICB7cHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgPFJlYWN0UXVlcnlEZXZ0b29scyBpbml0aWFsSXNPcGVuPXtmYWxzZX0gLz59XG4gICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuICApO1xufVxuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVJvdXRlciIsIlRoZW1lUHJvdmlkZXIiLCJUb2FzdGVyIiwiVG9vbHRpcFByb3ZpZGVyIiwiUXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiUmVhY3RRdWVyeURldnRvb2xzIiwiVGhlbWUiLCJxdWVyeUNsaWVudCIsImRlZmF1bHRPcHRpb25zIiwicXVlcmllcyIsInJlZmV0Y2hPbldpbmRvd0ZvY3VzIiwicmV0cnkiLCJzdGFsZVRpbWUiLCJwcm9jZXNzIiwiY29uc29sZSIsImxvZyIsImVycm9yIiwiZGVidWciLCJpbmZvIiwid2FybiIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInJvdXRlciIsImhhbmRsZVJvdXRlQ2hhbmdlIiwidXJsIiwiZXZlbnRzIiwib24iLCJvZmYiLCJjbGllbnQiLCJhdHRyaWJ1dGUiLCJkZWZhdWx0VGhlbWUiLCJlbmFibGVTeXN0ZW0iLCJkaXNhYmxlVHJhbnNpdGlvbk9uQ2hhbmdlIiwicG9zaXRpb24iLCJyaWNoQ29sb3JzIiwiY2xvc2VCdXR0b24iLCJpbml0aWFsSXNPcGVuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "../lovable-src/ui-kit/src/styles/globals.css":
/*!****************************************************!*\
  !*** ../lovable-src/ui-kit/src/styles/globals.css ***!
  \****************************************************/
/***/ (() => {



/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "@emotion/react/jsx-dev-runtime":
/*!*************************************************!*\
  !*** external "@emotion/react/jsx-dev-runtime" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@emotion/react/jsx-dev-runtime");;

/***/ }),

/***/ "@radix-ui/themes":
/*!***********************************!*\
  !*** external "@radix-ui/themes" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("@radix-ui/themes");;

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "@tanstack/react-query-devtools":
/*!*************************************************!*\
  !*** external "@tanstack/react-query-devtools" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query-devtools");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@14.2.30_@babel+core@7.28.0_@opentelemetry+api@1.9.0_@playwright+test@1.54.1_react-_33d9124119630bbb54f77843f11b86fe","vendor-chunks/@swc+helpers@0.5.5","vendor-chunks/sonner@2.0.6_react-dom@18.3.1_react@18.3.1__react@18.3.1","vendor-chunks/@floating-ui+core@1.7.2","vendor-chunks/@floating-ui+dom@1.7.2","vendor-chunks/@radix-ui+react-tooltip@1.2.7_@types+react-dom@18.3.7_@types+react@18.3.23__@types+reac_50e390c4dabde08ed3112eb9f58da500","vendor-chunks/@floating-ui+react-dom@2.1.4_react-dom@18.3.1_react@18.3.1__react@18.3.1","vendor-chunks/@radix-ui+react-popper@1.2.7_@types+react-dom@18.3.7_@types+react@18.3.23__@types+react_ffa2341e59ce9c78f0d0d849ccd75e57","vendor-chunks/@floating-ui+utils@0.2.10","vendor-chunks/@radix-ui+react-dismissable-layer@1.1.10_@types+react-dom@18.3.7_@types+react@18.3.23___dbf8386523191e50867cd199de52aa0e","vendor-chunks/next-themes@0.4.6_react-dom@18.3.1_react@18.3.1__react@18.3.1","vendor-chunks/@radix-ui+react-presence@1.1.4_@types+react-dom@18.3.7_@types+react@18.3.23__@types+rea_587c7e8c3eecba09139e2afe2a783727","vendor-chunks/@radix-ui+react-use-controllable-state@1.2.2_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-slot@1.2.3_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-context@1.1.2_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-use-size@1.1.1_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-primitive@2.1.3_@types+react-dom@18.3.7_@types+react@18.3.23__@types+re_db0ee435667e42f4b05fd5a9bb21abc3","vendor-chunks/@radix-ui+react-compose-refs@1.1.2_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-visually-hidden@1.2.3_@types+react-dom@18.3.7_@types+react@18.3.23__@ty_bd769e2c7ddceeff6e63be21c84dfac7","vendor-chunks/@radix-ui+react-use-effect-event@0.0.2_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-portal@1.1.9_@types+react-dom@18.3.7_@types+react@18.3.23__@types+react_6c1cd0a6f7cc4779efee75f9fbbe7053","vendor-chunks/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-arrow@1.1.7_@types+react-dom@18.3.7_@types+react@18.3.23__@types+react@_e9e31f839ccc03b965a9c76fb12e37fb","vendor-chunks/@radix-ui+react-id@1.1.1_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+primitive@1.1.2","vendor-chunks/@radix-ui+react-use-callback-ref@1.1.1_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+react-use-layout-effect@1.1.1_@types+react@18.3.23_react@18.3.1","vendor-chunks/@radix-ui+themes@3.2.1_@types+react-dom@18.3.7_@types+react@18.3.23__@types+react@18.3._0b6dbb3128512a72800e62cce5da9623"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();