"use strict";

const cidrForm = document.querySelector("#cidr-form");
const cidrInput = document.querySelector("#cidr-input");
const cidrError = document.querySelector("#cidr-error");
const cidrResult = document.querySelector("#cidr-result");

const plannerForm = document.querySelector("#planner-form");
const baseNetworkInput = document.querySelector("#base-network-input");
const requirementsInput = document.querySelector("#requirements-input");
const plannerError = document.querySelector("#planner-error");
const plannerResult = document.querySelector("#planner-result");

function parseIpv4(value) {
  const parts = value.trim().split(".");
  if (parts.length !== 4) {
    throw new Error("IPv4-адрес должен состоять из 4 октетов.");
  }

  const octets = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error(`Некорректный октет IPv4: "${part}".`);
    }

    const number = Number(part);
    if (number < 0 || number > 255) {
      throw new Error(`Октет "${part}" должен быть в диапазоне 0-255.`);
    }

    return number;
  });

  return (
    ((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 +
    octets[3]
  );
}

function parseCidr(value) {
  const [ipPart, prefixPart, extraPart] = value.trim().split("/");
  if (!ipPart || prefixPart === undefined || extraPart !== undefined) {
    throw new Error("Введите сеть в формате IPv4/префикс, например 10.0.0.0/24.");
  }

  if (!/^\d+$/.test(prefixPart)) {
    throw new Error("Префикс CIDR должен быть числом от 0 до 32.");
  }

  const prefix = Number(prefixPart);
  if (prefix < 0 || prefix > 32) {
    throw new Error("Префикс CIDR должен быть в диапазоне 0-32.");
  }

  return {
    ip: parseIpv4(ipPart),
    prefix,
  };
}

function prefixToMask(prefix) {
  if (prefix === 0) {
    return 0;
  }

  return (0xffffffff - (2 ** (32 - prefix) - 1)) >>> 0;
}

function intToIpv4(number) {
  const safeNumber = Number(number >>> 0);
  return [
    (safeNumber >>> 24) & 255,
    (safeNumber >>> 16) & 255,
    (safeNumber >>> 8) & 255,
    safeNumber & 255,
  ].join(".");
}

function formatInteger(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function toBinaryOctets(number) {
  return intToIpv4(number)
    .split(".")
    .map((octet) => Number(octet).toString(2).padStart(8, "0"))
    .join(".");
}

function calculateNetwork(cidr) {
  const mask = prefixToMask(cidr.prefix);
  const blockSize = 2 ** (32 - cidr.prefix);
  const network = Math.floor(cidr.ip / blockSize) * blockSize;
  const broadcast = network + blockSize - 1;

  let firstHost = network + 1;
  let lastHost = broadcast - 1;
  let usableHosts = Math.max(blockSize - 2, 0);

  if (cidr.prefix === 31) {
    firstHost = network;
    lastHost = broadcast;
    usableHosts = 2;
  }

  if (cidr.prefix === 32) {
    firstHost = cidr.ip;
    lastHost = cidr.ip;
    usableHosts = 1;
  }

  return {
    ip: cidr.ip,
    prefix: cidr.prefix,
    mask,
    wildcard: 0xffffffff - mask,
    network,
    broadcast,
    firstHost,
    lastHost,
    totalAddresses: blockSize,
    usableHosts,
  };
}

function classifyAddress(ip) {
  const first = (ip >>> 24) & 255;
  const second = (ip >>> 16) & 255;

  if (first === 10) return "Private RFC1918";
  if (first === 172 && second >= 16 && second <= 31) return "Private RFC1918";
  if (first === 192 && second === 168) return "Private RFC1918";
  if (first === 127) return "Loopback";
  if (first === 169 && second === 254) return "Link-local";
  if (first === 100 && second >= 64 && second <= 127) return "Carrier-grade NAT";
  if (first >= 224 && first <= 239) return "Multicast";
  if (ip === 0xffffffff) return "Limited broadcast";
  if (first === 0) return "This network";
  return "Public/Internet";
}

function renderMetrics(networkInfo) {
  const rows = [
    ["IP", intToIpv4(networkInfo.ip)],
    ["Префикс", `/${networkInfo.prefix}`],
    ["Сеть", intToIpv4(networkInfo.network)],
    ["Маска", intToIpv4(networkInfo.mask)],
    ["Wildcard", intToIpv4(networkInfo.wildcard)],
    ["Broadcast", intToIpv4(networkInfo.broadcast)],
    ["Первый хост", intToIpv4(networkInfo.firstHost)],
    ["Последний хост", intToIpv4(networkInfo.lastHost)],
    ["Всего адресов", formatInteger(networkInfo.totalAddresses)],
    ["Доступно хостов", formatInteger(networkInfo.usableHosts)],
    ["Тип адреса", classifyAddress(networkInfo.ip)],
    ["IP в двоичном виде", toBinaryOctets(networkInfo.ip), true],
  ];

  cidrResult.innerHTML = rows
    .map(
      ([label, value, wide]) => `
        <div class="metric${wide ? " metric-wide" : ""}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");
}

function parseRequirements(rawValue) {
  const lines = rawValue
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Добавьте хотя бы одно требование по количеству хостов.");
  }

  return lines.map((line, index) => {
    const [rawName, rawHosts, extraPart] = line.includes("=")
      ? line.split("=")
      : [`Подсеть ${index + 1}`, line];

    if (extraPart !== undefined) {
      throw new Error(`Строка "${line}" содержит больше одного знака "=".`);
    }

    const name = rawName.trim() || `Подсеть ${index + 1}`;
    const hosts = Number(rawHosts.trim());

    if (!Number.isInteger(hosts) || hosts <= 0) {
      throw new Error(`Для "${name}" укажите положительное целое число хостов.`);
    }

    return { name, hosts, originalIndex: index };
  });
}

function nextPowerOfTwo(value) {
  return 2 ** Math.ceil(Math.log2(value));
}

function alignToBlock(address, blockSize) {
  return Math.ceil(address / blockSize) * blockSize;
}

function planSubnets(baseCidr, requirements) {
  const baseInfo = calculateNetwork(baseCidr);
  const baseEnd = baseInfo.broadcast;
  let cursor = baseInfo.network;

  const sortedRequirements = [...requirements].sort((a, b) => b.hosts - a.hosts);

  return sortedRequirements.map((requirement) => {
    const addresses = nextPowerOfTwo(requirement.hosts + 2);
    const prefix = 32 - Math.log2(addresses);
    const network = alignToBlock(cursor, addresses);
    const broadcast = network + addresses - 1;

    if (broadcast > baseEnd) {
      throw new Error(
        `Базовой сети ${intToIpv4(baseInfo.network)}/${baseInfo.prefix} не хватает для подсети "${requirement.name}".`,
      );
    }

    cursor = broadcast + 1;

    return {
      ...requirement,
      prefix,
      network,
      mask: prefixToMask(prefix),
      firstHost: network + 1,
      lastHost: broadcast - 1,
      broadcast,
      usableHosts: addresses - 2,
    };
  });
}

function renderSubnetPlan(subnets) {
  const rows = subnets
    .map(
      (subnet) => `
        <tr>
          <td>${escapeHtml(subnet.name)}</td>
          <td>${formatInteger(subnet.hosts)}</td>
          <td>${intToIpv4(subnet.network)}/${subnet.prefix}</td>
          <td>${intToIpv4(subnet.mask)}</td>
          <td>${intToIpv4(subnet.firstHost)} - ${intToIpv4(subnet.lastHost)}</td>
          <td>${intToIpv4(subnet.broadcast)}</td>
          <td>${formatInteger(subnet.usableHosts)}</td>
        </tr>
      `,
    )
    .join("");

  plannerResult.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Нужно</th>
          <th>Подсеть</th>
          <th>Маска</th>
          <th>Диапазон хостов</th>
          <th>Broadcast</th>
          <th>Доступно</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function clearError(element) {
  element.textContent = "";
  element.hidden = true;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

cidrForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError(cidrError);

  try {
    const cidr = parseCidr(cidrInput.value);
    renderMetrics(calculateNetwork(cidr));
  } catch (error) {
    cidrResult.innerHTML = "";
    showError(cidrError, error.message);
  }
});

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError(plannerError);

  try {
    const baseCidr = parseCidr(baseNetworkInput.value);
    const requirements = parseRequirements(requirementsInput.value);
    renderSubnetPlan(planSubnets(baseCidr, requirements));
  } catch (error) {
    plannerResult.innerHTML = "";
    showError(plannerError, error.message);
  }
});

cidrForm.requestSubmit();
plannerForm.requestSubmit();
