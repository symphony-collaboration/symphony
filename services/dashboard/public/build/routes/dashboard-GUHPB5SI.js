import {
  Link
} from "/build/_shared/chunk-R36MLFN6.js";
import {
  Outlet,
  useLocation
} from "/build/_shared/chunk-IRXI46U4.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-VIPVJV6J.js";
import {
  __toESM
} from "/build/_shared/chunk-5KL4PAQL.js";

// app/components/Navigation.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
function Navigation() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-7xl px-2 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative flex h-16 items-center justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-1 items-center justify-center sm:items-stretch sm:justify-start", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-shrink-0 items-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        "img",
        {
          className: "block h-8 w-auto lg:hidden",
          src: "/images/logo.png",
          alt: "Symphony"
        },
        void 0,
        false,
        {
          fileName: "app/components/Navigation.tsx",
          lineNumber: 8,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        "img",
        {
          className: "hidden h-8 w-auto lg:block",
          src: "/images/logo.png",
          alt: "Symphony"
        },
        void 0,
        false,
        {
          fileName: "app/components/Navigation.tsx",
          lineNumber: 13,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, true, {
      fileName: "app/components/Navigation.tsx",
      lineNumber: 7,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/components/Navigation.tsx",
      lineNumber: 6,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        "button",
        {
          type: "button",
          className: "rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        },
        void 0,
        false,
        {
          fileName: "app/components/Navigation.tsx",
          lineNumber: 21,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        "img",
        {
          className: "h-8 w-8 rounded-full",
          src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          alt: ""
        },
        void 0,
        false,
        {
          fileName: "app/components/Navigation.tsx",
          lineNumber: 26,
          columnNumber: 15
        },
        this
      ) }, void 0, false, {
        fileName: "app/components/Navigation.tsx",
        lineNumber: 25,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Navigation.tsx",
      lineNumber: 20,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Navigation.tsx",
    lineNumber: 5,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/Navigation.tsx",
    lineNumber: 4,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/Navigation.tsx",
    lineNumber: 3,
    columnNumber: 5
  }, this);
}

// app/components/Sidebar.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime());
function Sidebar() {
  const { pathname } = useLocation();
  const getPath = (pathname2) => {
    while (pathname2.endsWith("/")) {
      pathname2 = pathname2.slice(0, -1);
    }
    return pathname2.split("/").at(-1);
  };
  const currentPath = getPath(pathname);
  const linkClass = "flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700";
  const selectedLinkClass = `${linkClass}  bg-gray-100 text-gray-700`;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex h-screen flex-col justify-between border-r bg-white max-w-xs", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "px-4 py-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("nav", { "aria-label": "Main Nav", className: "mt-6 flex flex-col space-y-1", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
      Link,
      {
        to: "/dashboard",
        className: currentPath === "dashboard" ? selectedLinkClass : linkClass,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 opacity-75",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                },
                void 0,
                false,
                {
                  fileName: "app/components/Sidebar.tsx",
                  lineNumber: 37,
                  columnNumber: 15
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "app/components/Sidebar.tsx",
              lineNumber: 29,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "text-sm font-medium", children: "Overview" }, void 0, false, {
            fileName: "app/components/Sidebar.tsx",
            lineNumber: 44,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "app/components/Sidebar.tsx",
        lineNumber: 23,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
      Link,
      {
        to: "/dashboard/rooms",
        className: currentPath === "rooms" ? selectedLinkClass : linkClass,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 opacity-75",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                },
                void 0,
                false,
                {
                  fileName: "app/components/Sidebar.tsx",
                  lineNumber: 59,
                  columnNumber: 15
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "app/components/Sidebar.tsx",
              lineNumber: 51,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "text-sm font-medium", children: "Rooms" }, void 0, false, {
            fileName: "app/components/Sidebar.tsx",
            lineNumber: 66,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "app/components/Sidebar.tsx",
        lineNumber: 47,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
      Link,
      {
        to: "/dashboard/settings",
        className: currentPath === "settings" ? selectedLinkClass : linkClass,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-5 w-5 opacity-75",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  },
                  void 0,
                  false,
                  {
                    fileName: "app/components/Sidebar.tsx",
                    lineNumber: 83,
                    columnNumber: 15
                  },
                  this
                ),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  },
                  void 0,
                  false,
                  {
                    fileName: "app/components/Sidebar.tsx",
                    lineNumber: 88,
                    columnNumber: 15
                  },
                  this
                )
              ]
            },
            void 0,
            true,
            {
              fileName: "app/components/Sidebar.tsx",
              lineNumber: 75,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "text-sm font-medium", children: "Settings" }, void 0, false, {
            fileName: "app/components/Sidebar.tsx",
            lineNumber: 95,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "app/components/Sidebar.tsx",
        lineNumber: 69,
        columnNumber: 11
      },
      this
    )
  ] }, void 0, true, {
    fileName: "app/components/Sidebar.tsx",
    lineNumber: 22,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/Sidebar.tsx",
    lineNumber: 21,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/Sidebar.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

// app/components/Container.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime());
function Container({ children }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("main", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "mx-auto max-w-7xl py-6 sm:px-6 lg:px-8", children }, void 0, false, {
    fileName: "app/components/Container.tsx",
    lineNumber: 10,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/Container.tsx",
    lineNumber: 9,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime());
function DashboardLayout() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_jsx_dev_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Navigation, {}, void 0, false, {
      fileName: "app/routes/dashboard.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex flex-row", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "basis-1/6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Sidebar, {}, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 12,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 11,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Container, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Outlet, {}, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 16,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 15,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 14,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard.tsx",
      lineNumber: 10,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/dashboard.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, this);
}
export {
  DashboardLayout as default
};
//# sourceMappingURL=/build/routes/dashboard-GUHPB5SI.js.map
