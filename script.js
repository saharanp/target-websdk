// ---------------------------------------------------------------------------
// Adobe Target Web SDK integration point
//
// When you're ready to wire up Alloy / Target Web SDK:
//   1. Uncomment the <script> tag for alloy.min.js in index.html
//   2. Call configure() with your datastream / org ID
//   3. Replace the stub below with a real sendEvent call
// ---------------------------------------------------------------------------

const sdkLog = document.getElementById("sdk-log");

function log(message) {
  const ts = new Date().toLocaleTimeString();
  sdkLog.textContent += `\n[${ts}] ${message}`;
}

// ---------------------------------------------------------------------------
// Target SDK stub — replace this block once Alloy is loaded
// ---------------------------------------------------------------------------
function initTargetSDK() {
  // Example Alloy configure call (fill in your org & datastream IDs):
  //
  // alloy("configure", {
  //   datastreamId: "YOUR_DATASTREAM_ID",
  //   orgId:        "YOUR_ORG_ID@AdobeOrg",
  //   debugEnabled: true,
  // });
  //
  // alloy("sendEvent", {
  //   renderDecisions: true,
  //   xdm: {
  //     web: {
  //       webPageDetails: { name: "Home" },
  //     },
  //   },
  // }).then(({ decisions }) => {
  //   applyDecisions(decisions);
  //   log("Decisions received: " + decisions.length);
  // });

  log("SDK stub loaded — configure Alloy to activate personalisation.");
}

// ---------------------------------------------------------------------------
// Apply Target decisions to the page
// ---------------------------------------------------------------------------
function applyDecisions(decisions = []) {
  decisions.forEach((decision) => {
    decision.items?.forEach((item) => {
      const { schema, data } = item;

      // DOM-action schema (VEC / Form-based)
      if (schema === "https://ns.adobe.com/personalization/dom-action") {
        applyDOMAction(data);
      }

      // JSON offer schema
      if (schema === "https://ns.adobe.com/personalization/json-content-item") {
        log(`JSON offer for scope "${decision.scope}": ` + JSON.stringify(data.content));
      }
    });
  });
}

function applyDOMAction(data) {
  const el = document.querySelector(data.selector);
  if (!el) return;

  switch (data.type) {
    case "setHtml":
      el.innerHTML = data.content;
      break;
    case "setText":
      el.textContent = data.content;
      break;
    case "setStyle":
      Object.assign(el.style, data.style);
      break;
    case "setAttribute":
      el.setAttribute(data.attribute, data.value);
      break;
    default:
      log(`Unhandled DOM action type: ${data.type}`);
  }
}

// ---------------------------------------------------------------------------
// Bootstrapping
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  log("Page ready.");
  initTargetSDK();
});
