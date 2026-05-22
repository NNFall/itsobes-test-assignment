import fs from "node:fs";
import path from "node:path";

const baseUrl = process.argv[2] || "http://5.129.236.90:8088";
const outDir =
  process.argv[3] ||
  "C:/Users/User/Desktop/work/itsobes/docs/manual_test_screenshots";

fs.mkdirSync(outDir, { recursive: true });

const target = await fetch("http://127.0.0.1:9223/json/new?about:blank", {
  method: "PUT",
}).then((r) => r.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) {
    return;
  }

  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);

  if (message.error) {
    reject(new Error(JSON.stringify(message.error)));
  } else {
    resolve(message.result || {});
  }
};

await new Promise((resolve) => {
  ws.onopen = resolve;
});

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function evalJs(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(JSON.stringify(result.exceptionDetails));
  }

  return result.result.value;
}

async function screenshot(name) {
  const result = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  fs.writeFileSync(path.join(outDir, name), Buffer.from(result.data, "base64"));
}

async function navigate(url) {
  await send("Page.navigate", { url });
  await wait(1500);
}

async function clickSelector(selector) {
  const rect = await evalJs(
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
  );

  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: rect.x,
    y: rect.y,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: rect.x,
    y: rect.y,
    button: "left",
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: rect.x,
    y: rect.y,
    button: "left",
    clickCount: 1,
  });
  await wait(300);
}

async function fillSelector(selector, value) {
  await evalJs(
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      el.focus();
      el.value = "";
    })()`,
  );
  await send("Input.insertText", { text: value });
  await wait(150);
}

function assertCheck(checks, name, value) {
  checks.push({ name, value });
  if (!value) {
    throw new Error(`Browser smoke check failed: ${name}`);
  }
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1200,
  deviceScaleFactor: 1,
  mobile: false,
});

const checks = [];

await navigate(`${baseUrl}/`);
assertCheck(checks, "presentation.title", (await evalJs("document.title")).includes("Тестовое задание"));
assertCheck(
  checks,
  "presentation.task1Link",
  (await evalJs('document.querySelector("a[href=\\"/task1/\\"]")?.textContent.trim()')) ===
    "Открыть веб-утилиту",
);
await screenshot("01_presentation_home.png");

await clickSelector('a[href="/task1/"]');
await wait(1000);
assertCheck(checks, "task1.urlAfterClick", (await evalJs("location.href")).includes("/task1/"));
assertCheck(
  checks,
  "task1.defaultNetwork",
  await evalJs(
    'Array.from(document.querySelectorAll(".metric strong")).map((e) => e.textContent).includes("192.168.10.0")',
  ),
);
assertCheck(
  checks,
  "task1.defaultPlannerRows",
  (await evalJs('document.querySelectorAll("tbody tr").length')) === 4,
);
await screenshot("02_task1_default.png");

await fillSelector("#cidr-input", "172.16.5.77/20");
await clickSelector("#cidr-form button");
assertCheck(
  checks,
  "cidr.customNetwork",
  await evalJs(
    'Array.from(document.querySelectorAll(".metric strong")).map((e) => e.textContent).includes("172.16.0.0")',
  ),
);
assertCheck(
  checks,
  "cidr.customBroadcast",
  await evalJs(
    'Array.from(document.querySelectorAll(".metric strong")).map((e) => e.textContent).includes("172.16.15.255")',
  ),
);
assertCheck(
  checks,
  "cidr.customType",
  await evalJs(
    'Array.from(document.querySelectorAll(".metric strong")).map((e) => e.textContent).includes("Private RFC1918")',
  ),
);
await screenshot("03_task1_cidr_custom.png");

await fillSelector("#base-network-input", "10.20.0.0/24");
await fillSelector("#requirements-input", "Users=50\nCameras=20\nVPN=8");
await clickSelector("#planner-form button");
assertCheck(
  checks,
  "planner.customRows",
  (await evalJs('document.querySelectorAll("tbody tr").length')) === 3,
);
assertCheck(
  checks,
  "planner.firstSubnet",
  (await evalJs('document.querySelector("tbody tr td:nth-child(3)")?.textContent.trim()')) ===
    "10.20.0.0/26",
);
assertCheck(checks, "planner.noError", await evalJs('document.querySelector("#planner-error").hidden'));
await screenshot("04_task1_planner_custom.png");

await fillSelector("#cidr-input", "999.1.1.1/24");
await clickSelector("#cidr-form button");
assertCheck(
  checks,
  "cidr.invalidShowsError",
  await evalJs(
    '!document.querySelector("#cidr-error").hidden && document.querySelector("#cidr-error").textContent.includes("диапазоне 0-255")',
  ),
);
await screenshot("05_task1_invalid_cidr.png");

await navigate(`${baseUrl}/docs/final_submission.md`);
assertCheck(
  checks,
  "docs.finalSubmissionStatus",
  await evalJs('document.body.innerText.includes("Финальный документ")'),
);
await screenshot("06_final_submission.png");

await navigate(`${baseUrl}/task3/Code.gs`);
assertCheck(
  checks,
  "appsScript.hasUrlFetch",
  await evalJs('document.body.innerText.includes("UrlFetchApp.fetch")'),
);
assertCheck(
  checks,
  "appsScript.hasTriggerFunction",
  await evalJs('document.body.innerText.includes("createDailyRatesTrigger")'),
);
await screenshot("07_apps_script_code.png");

await navigate(`${baseUrl}/downloads/itsobes_test_assignment.zip.sha256`);
assertCheck(
  checks,
  "zip.sha256Visible",
  await evalJs(
    `fetch(${JSON.stringify(`${baseUrl}/downloads/itsobes_test_assignment.zip.sha256`)})
      .then((response) => response.text())
      .then((text) => text.includes("itsobes_test_assignment.zip"))`,
  ),
);

fs.writeFileSync(
  "C:/Users/User/Desktop/work/itsobes/docs/manual_test_results.json",
  JSON.stringify(checks, null, 2),
  "utf8",
);
console.log(JSON.stringify(checks, null, 2));
ws.close();
setTimeout(() => process.exit(0), 100);
