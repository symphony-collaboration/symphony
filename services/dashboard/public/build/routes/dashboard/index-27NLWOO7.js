import {
  init_dist,
  useLoaderData
} from "/build/_shared/chunk-IRXI46U4.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-VIPVJV6J.js";
import {
  __toESM
} from "/build/_shared/chunk-5KL4PAQL.js";

// app/components/InfoCard.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
function Card({ title, description, link }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
    "a",
    {
      href: link.href,
      className: "group flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-gray-900", children: title }, void 0, false, {
            fileName: "app/components/InfoCard.tsx",
            lineNumber: 15,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t-2 border-gray-100 pt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-700", children: description }, void 0, false, {
            fileName: "app/components/InfoCard.tsx",
            lineNumber: 17,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "app/components/InfoCard.tsx",
            lineNumber: 16,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/InfoCard.tsx",
          lineNumber: 14,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 inline-flex items-center gap-2 text-indigo-600", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium", children: link.text }, void 0, false, {
            fileName: "app/components/InfoCard.tsx",
            lineNumber: 21,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6 transition group-hover:translate-x-3",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M17 8l4 4m0 0l-4 4m4-4H3"
                },
                void 0,
                false,
                {
                  fileName: "app/components/InfoCard.tsx",
                  lineNumber: 29,
                  columnNumber: 13
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "app/components/InfoCard.tsx",
              lineNumber: 22,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "app/components/InfoCard.tsx",
          lineNumber: 20,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "app/components/InfoCard.tsx",
      lineNumber: 10,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "app/components/InfoCard.tsx",
    lineNumber: 9,
    columnNumber: 5
  }, this);
}

// app/components/Divider.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime());
function Divider() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "border-t border-gray-300 my-4" }, void 0, false, {
    fileName: "app/components/Divider.tsx",
    lineNumber: 2,
    columnNumber: 10
  }, this);
}

// app/routes/dashboard/index.tsx
init_dist();

// app/components/MetricCard.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime());
function MetricCard({ metricName, value }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex-1 group flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow sm:p-6 lg:p-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "mb-5", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h3", { className: "font-medium text-gray-900", children: metricName }, void 0, false, {
        fileName: "app/components/MetricCard.tsx",
        lineNumber: 10,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "border-t-2 border-gray-100 pt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: "mt-1 text-sm text-gray-700", children: "Production" }, void 0, false, {
        fileName: "app/components/MetricCard.tsx",
        lineNumber: 12,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/MetricCard.tsx",
        lineNumber: 11,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/MetricCard.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: "text-4xl font-extrabold text-blue-600 md:text-5xl", children: value }, void 0, false, {
      fileName: "app/components/MetricCard.tsx",
      lineNumber: 16,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/MetricCard.tsx",
      lineNumber: 15,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/MetricCard.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard/index.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime());
var Dashboard = () => {
  const data = useLoaderData();
  const infoCards = [
    {
      id: 1,
      title: "Concepts",
      description: "Learn the concepts of Symphony before getting started",
      link: { text: "Learn concepts", href: "#" }
    },
    {
      id: 2,
      title: "Get Started",
      description: "Learn how to auto-deploy and self-host Symphony using our CLI tool",
      link: { text: "Get Started", href: "#" }
    },
    {
      id: 3,
      title: "Examples",
      description: "Browse and take inspiration from our galley of collaborative UI patterns",
      link: { text: "Browse Examples", href: "#" }
    }
  ];
  const valueMetrics = [
    {
      id: 1,
      metricName: "Total Rooms",
      value: data.totalRooms
    },
    {
      id: 2,
      metricName: "Total Active Connections",
      value: 5
    },
    {
      id: 3,
      metricName: "Active Rooms",
      value: data.activeRooms
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_jsx_dev_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("header", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("strong", { className: "block font-medium text-gray-900 mb-5", children: [
        " ",
        "Welcome to Symphony",
        " "
      ] }, void 0, true, {
        fileName: "app/routes/dashboard/index.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "mt-1 text-sm text-gray-700", children: "Follow the steps below or browse our developer documentation to get started." }, void 0, false, {
        fileName: "app/routes/dashboard/index.tsx",
        lineNumber: 78,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard/index.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex justify-between gap-10 mb-10", children: infoCards.map((card) => {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
        Card,
        {
          title: card.title,
          description: card.description,
          link: card.link
        },
        card.id,
        false,
        {
          fileName: "app/routes/dashboard/index.tsx",
          lineNumber: 86,
          columnNumber: 13
        },
        this
      );
    }) }, void 0, false, {
      fileName: "app/routes/dashboard/index.tsx",
      lineNumber: 83,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Divider, {}, void 0, false, {
      fileName: "app/routes/dashboard/index.tsx",
      lineNumber: 95,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("strong", { className: "block font-medium text-gray-900 mb-5", children: "Overview" }, void 0, false, {
      fileName: "app/routes/dashboard/index.tsx",
      lineNumber: 96,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex justify-between gap-10 mb-10", children: valueMetrics.map((metric) => {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
        MetricCard,
        {
          metricName: metric.metricName,
          value: metric.value
        },
        metric.id,
        false,
        {
          fileName: "app/routes/dashboard/index.tsx",
          lineNumber: 100,
          columnNumber: 13
        },
        this
      );
    }) }, void 0, false, {
      fileName: "app/routes/dashboard/index.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/dashboard/index.tsx",
    lineNumber: 72,
    columnNumber: 5
  }, this);
};
var dashboard_default = Dashboard;
export {
  dashboard_default as default
};
//# sourceMappingURL=/build/routes/dashboard/index-27NLWOO7.js.map
