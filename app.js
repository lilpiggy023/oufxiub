const optionMeta = {
  category: {
    title: "分类",
    summary: "这些选项会出现在记账页的分类选择区。",
  },
  project: {
    title: "项目",
    summary: "项目用于判断一笔钱归属于哪个目标、资产或业务。",
  },
  motivation: {
    title: "消费动机",
    summary: "消费动机用于分析这笔钱为什么发生，是否值得保留。",
  },
};

const today = new Date("2026-06-28T12:49:00");
const NONE_CATEGORY = "无";

const categoryDrag = {
  active: false,
  source: "",
  target: "",
  timer: null,
  suppressClick: false,
  ghost: null,
  offsetX: 0,
  offsetY: 0,
  latestX: 0,
  latestY: 0,
};

const state = {
  entryType: "expense",
  manageType: "category",
  editingTransactionId: null,
  ledgerFilter: "all",
  entryDate: toDateKey(today),
  pendingEntryDate: toDateKey(today),
  entryTime: "12:49",
  pendingEntryHour: "12",
  pendingEntryMinute: "49",
  calendarMonth: toDateKey(today).slice(0, 7),
  activeCategoryParent: "",
  openCategoryManageGroups: [],
  editingCategory: null,
  categoryActionDialog: null,
  categoryGroups: [
    { name: "餐饮", children: ["早餐", "午餐", "晚餐", "咖啡饮品"] },
    { name: "购物", children: ["数码", "家居", "服饰鞋包", "日用品"] },
    { name: "日用", children: ["清洁护理", "维修耗材", "宠物", "订阅服务"] },
    { name: "交通", children: ["公交地铁", "打车", "私家车", "机票"] },
    { name: "零食", children: ["饮料", "甜点", "夜宵"] },
    { name: "娱乐", children: ["电影演出", "游戏", "旅行玩乐"] },
    { name: "通讯", children: ["话费", "宽带", "云服务"] },
    { name: "服饰", children: ["衣服", "鞋包", "配饰"] },
    { name: "医疗", children: ["药品", "门诊", "体检"] },
    { name: "形象", children: ["理发", "护肤", "健身"] },
    { name: "房租", children: ["租金", "物业", "水电燃气"] },
    { name: "贷款", children: ["房贷", "车贷", "提前还贷"] },
  ],
  options: {
    category: ["餐饮", "购物", "日用", "交通", "零食", "娱乐", "通讯", "服饰", "医疗", "形象", "房租", "贷款"],
    project: ["家庭", "房产 1", "副业", "装修", "客户项目"],
    motivation: ["刚需", "效率提升", "风险降低", "投资增值", "情绪消费", "社交维护"],
  },
  selections: {
    category: "交通",
    project: "",
    motivation: "",
  },
  accounts: [
    { id: "bank", name: "招商银行卡", type: "cash", balance: 64280 },
    { id: "alipay", name: "支付宝", type: "cash", balance: 12460 },
    { id: "wechat", name: "微信钱包", type: "cash", balance: 5380 },
    { id: "cash", name: "现金", type: "cash", balance: 1800 },
    { id: "huabei", name: "花呗", type: "credit", balance: -5289.17 },
  ],
  debts: [
    {
      id: "mortgage-1",
      name: "房产 1 按揭贷款",
      type: "房贷 · 等额本息",
      balance: 682000,
      monthlyPayment: 8960,
      remainingTerms: 116,
      interestRate: 0.0385,
    },
  ],
  monthlyBudget: 46220,
  transactionBaseCount: 2579,
  startDate: "2024-12-31",
  transactions: [
    { id: 1, date: "2026-06-28", time: "12:20", type: "expense", accountId: "huabei", title: "午餐", category: "餐饮", project: "家庭", motivation: "刚需", amount: -36, note: "" },
    { id: 2, date: "2026-06-28", time: "10:05", type: "income", accountId: "bank", title: "客户项目回款", category: "收入", project: "客户项目", motivation: "投资增值", amount: 1200, note: "" },
    { id: 3, date: "2026-06-28", time: "08:34", type: "expense", accountId: "huabei", title: "通勤打车", category: "交通", project: "家庭", motivation: "效率提升", amount: -64, note: "高德打车" },
    { id: 4, date: "2026-06-27", time: "17:42", type: "expense", accountId: "alipay", title: "装修小五金", category: "日用", project: "装修", motivation: "刚需", amount: -353, note: "" },
    { id: 5, date: "2026-06-26", time: "14:10", type: "income", accountId: "bank", title: "副业回款", category: "收入", project: "副业", motivation: "投资增值", amount: 12500, note: "" },
    { id: 6, date: "2026-06-25", time: "09:28", type: "expense", accountId: "bank", title: "订阅与云服务", category: "通讯", project: "副业", motivation: "效率提升", amount: -597, note: "" },
    { id: 7, date: "2026-06-20", time: "16:00", type: "expense", accountId: "bank", title: "装修预付款", category: "日用", project: "装修", motivation: "刚需", amount: -18740, note: "" },
    { id: 8, date: "2026-06-18", time: "19:30", type: "expense", accountId: "wechat", title: "聚餐", category: "餐饮", project: "家庭", motivation: "社交维护", amount: -85, note: "" },
    { id: 9, date: "2026-06-15", time: "15:12", type: "expense", accountId: "huabei", title: "咖啡零食", category: "零食", project: "家庭", motivation: "情绪消费", amount: -31, note: "" },
    { id: 10, date: "2026-06-05", time: "09:00", type: "expense", accountId: "bank", title: "房贷扣款", category: "贷款", project: "房产 1", motivation: "风险降低", amount: -8960, note: "" },
    { id: 11, date: "2026-06-01", time: "09:10", type: "income", accountId: "bank", title: "工资到账", category: "收入", project: "家庭", motivation: "刚需", amount: 18000, note: "" },
  ],
  plannedFlows: [
    { id: "p1", date: "2026-06-30", title: "工资到账", amount: 18000, category: "收入", project: "家庭", motivation: "刚需" },
    { id: "p2", date: "2026-07-05", title: "房贷扣款", amount: -8960, category: "贷款", project: "房产 1", motivation: "风险降低" },
    { id: "p3", date: "2026-07-10", title: "装修尾款", amount: -22000, category: "日用", project: "装修", motivation: "刚需" },
    { id: "p4", date: "2026-07-18", title: "副业回款", amount: 12500, category: "收入", project: "副业", motivation: "投资增值" },
    { id: "p5", date: "2026-07-26", title: "信用账单", amount: -5289, category: "购物", project: "家庭", motivation: "刚需" },
  ],
};

const money = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${money.format(Math.abs(value))}`;
}

function formatSignedNumber(value) {
  return `${value > 0 ? "+" : ""}${Math.round(value).toLocaleString("zh-CN")}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(key) {
  return new Date(`${key}T00:00:00`);
}

function formatMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function daysBetween(startKey, endDate) {
  const start = parseDate(startKey);
  return Math.max(1, Math.round((endDate - start) / 86400000));
}

function isCurrentMonth(item) {
  return item.date.slice(0, 7) === toDateKey(today).slice(0, 7);
}

function availableCash() {
  return state.accounts.filter((account) => account.type === "cash").reduce((sum, account) => sum + account.balance, 0);
}

function netWorth() {
  const accounts = state.accounts.reduce((sum, account) => sum + account.balance, 0);
  const debts = state.debts.reduce((sum, debt) => sum + debt.balance, 0);
  return accounts - debts;
}

function currentMonthTransactions() {
  return state.transactions.filter(isCurrentMonth);
}

function currentMonthExpense() {
  return currentMonthTransactions()
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
}

function projectedDailyBalances(extraOutflow = 0) {
  let balance = availableCash() - extraOutflow;
  const points = [];

  for (let day = 0; day < 30; day += 1) {
    const date = addDays(today, day);
    const key = toDateKey(date);
    const plannedTotal = state.plannedFlows
      .filter((item) => item.date === key)
      .reduce((sum, item) => sum + item.amount, 0);
    balance += plannedTotal;
    points.push({ date: key, balance, plannedTotal });
  }

  return points;
}

function forecastStats(extraOutflow = 0) {
  const points = projectedDailyBalances(extraOutflow);
  const lowest = points.reduce((min, point) => Math.min(min, point.balance), points[0]?.balance ?? availableCash());
  return { points, lowest };
}

function riskLabel(lowest) {
  if (lowest < 0) return "高风险";
  if (lowest < 15000) return "中风险";
  return "低风险";
}

function aggregateBy(field) {
  return currentMonthTransactions().reduce((map, item) => {
    const key = item[field] || "未标注";
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (item.amount > 0) map[key].income += item.amount;
    if (item.amount < 0) map[key].expense += Math.abs(item.amount);
    return map;
  }, {});
}

function accountName(accountId) {
  return state.accounts.find((account) => account.id === accountId)?.name || "未知账户";
}

function showScreen(name) {
  document.querySelector(".phone-shell").dataset.activeScreen = name;

  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === name);
  });
}

function renderForecastBars() {
  const { points } = forecastStats();
  const weekly = [0, 1, 2, 3, 4, 5, 6].map((week) => {
    const slice = points.slice(week * 4, week * 4 + 4);
    return slice.reduce((sum, point) => sum + point.balance, 0) / Math.max(slice.length, 1);
  });
  const min = Math.min(...weekly);
  const max = Math.max(...weekly);
  const range = Math.max(max - min, 1);

  document.querySelector("#forecastBars").innerHTML = weekly
    .map((value) => {
      const height = Math.round(34 + ((value - min) / range) * 46);
      return `<span style="height: ${height}%"></span>`;
    })
    .join("");
}

function renderAlerts() {
  const { lowest, points } = forecastStats();
  const alerts = [];
  const budgetUsed = currentMonthExpense() / state.monthlyBudget;
  const nextOutflow = state.plannedFlows.find((flow) => flow.amount < 0 && parseDate(flow.date) >= parseDate(toDateKey(today)));

  if (nextOutflow) {
    const balanceAfter = points.find((point) => point.date === nextOutflow.date)?.balance ?? availableCash() + nextOutflow.amount;
    alerts.push({
      level: "warning",
      title: `${nextOutflow.date.slice(5).replace("-", " 月 ")} 日${nextOutflow.title}`,
      body: `预计流出 ${formatMoney(nextOutflow.amount)}，发生后余额 ${formatMoney(balanceAfter)}`,
    });
  }

  if (budgetUsed > 0.8) {
    alerts.push({
      level: "",
      title: `本月预算已使用 ${Math.round(budgetUsed * 100)}%`,
      body: `已支出 ${formatMoney(currentMonthExpense())}，预算 ${formatMoney(state.monthlyBudget)}`,
    });
  }

  if (lowest < 15000) {
    alerts.push({
      level: "warning",
      title: "未来 30 天现金缓冲偏低",
      body: `最低余额将到 ${formatMoney(lowest)}，建议保留至少 ${formatMoney(15000)}`,
    });
  }

  document.querySelector("#alertCount").textContent = `${alerts.length} 条`;
  document.querySelector("#alertList").innerHTML = alerts
    .map(
      (alert) => `
        <article class="alert-row ${alert.level}">
          <span></span>
          <div>
            <strong>${alert.title}</strong>
            <p>${alert.body}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderTransactions() {
  const todayKey = toDateKey(today);
  const todayItems = state.transactions.filter((item) => item.date === todayKey);
  document.querySelector("#transactionList").innerHTML = todayItems
    .map((item) => {
      const amountClass = item.amount > 0 ? "income" : "";
      return `
        <article class="transaction-row" data-edit-transaction="${item.id}" role="button" tabindex="0">
          <div>
            <strong>${item.title}</strong>
            <p>${item.category} · ${item.project} · ${item.motivation} · ${accountName(item.accountId)}</p>
          </div>
          <span class="${amountClass}">${formatMoney(item.amount)}</span>
        </article>
      `;
    })
    .join("");

  const todayTotal = todayItems.reduce((sum, item) => sum + item.amount, 0);
  document.querySelector("#todayTotal").textContent = formatMoney(todayTotal);
}

function renderHome() {
  const { lowest } = forecastStats();
  document.querySelector("#availableCash").textContent = formatMoney(availableCash());
  document.querySelector("#lowestBalance").textContent = formatMoney(lowest);
  document.querySelector("#homeRisk").textContent = riskLabel(lowest);
  renderForecastBars();
  renderAlerts();
  renderTransactions();
}

function renderTimeline() {
  const items = [...state.plannedFlows].sort((a, b) => a.date.localeCompare(b.date));
  document.querySelector("#timelineList").innerHTML = items
    .map(
      (item) => `
        <article>
          <time>${item.date.slice(5).replace("-", "/")}</time>
          <div>
            <strong>${item.title}</strong>
            <p>${item.amount > 0 ? "收入" : "支出"} ${formatMoney(item.amount)}，项目：${item.project}</p>
          </div>
          <span class="${item.amount > 0 ? "income" : ""}">${formatSignedNumber(item.amount)}</span>
        </article>
      `,
    )
    .join("");
}

function renderScenario() {
  const amount = Number(document.querySelector("#prepayAmount")?.value) || 50000;
  const saved = estimateInterestSaved(amount);
  const { lowest } = forecastStats(amount);
  document.querySelector("#scenarioTitle").textContent = `如果本月提前还贷 ${formatMoney(amount)}`;
  document.querySelector("#scenarioCashOut").textContent = formatMoney(-amount);
  document.querySelector("#scenarioLowest").textContent = formatMoney(lowest);
  document.querySelector("#scenarioSaved").textContent = formatMoney(saved);
  document.querySelector("#scenarioRisk").textContent = riskLabel(lowest);
}

function renderDebt() {
  const debt = state.debts[0];
  document.querySelector("#debtType").textContent = debt.type;
  document.querySelector("#debtName").textContent = debt.name;
  document.querySelector("#debtPrincipal").textContent = formatMoney(debt.balance);
  document.querySelector("#debtMonthly").textContent = formatMoney(debt.monthlyPayment);
  document.querySelector("#debtTerms").textContent = String(debt.remainingTerms);
  updateDebtPreview();
}

function renderAnalysis() {
  const motivation = aggregateBy("motivation");
  const motivationRows = Object.entries(motivation)
    .map(([name, value]) => ({ name, amount: value.expense }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const maxMotivation = Math.max(...motivationRows.map((item) => item.amount), 1);

  document.querySelector("#motivationBars").innerHTML = motivationRows
    .map(
      (item) => `
        <div>
          <span>${item.name}</span>
          <b style="width: ${Math.max(8, Math.round((item.amount / maxMotivation) * 100))}%"></b>
          <strong>${formatMoney(item.amount)}</strong>
        </div>
      `,
    )
    .join("");

  const projects = aggregateBy("project");
  document.querySelector("#projectAnalysisList").innerHTML = Object.entries(projects)
    .map(([name, value]) => ({ name, ...value, net: value.income - value.expense }))
    .sort((a, b) => b.net - a.net)
    .map(
      (item) => `
        <article class="project-row">
          <div>
            <strong>${item.name}</strong>
            <p>收入 ${formatMoney(item.income)} · 支出 ${formatMoney(item.expense)}</p>
          </div>
          <span class="${item.net >= 0 ? "income" : ""}">${formatMoney(item.net)}</span>
        </article>
      `,
    )
    .join("");
}

function sortTransactionsNewest(items) {
  return [...items].sort((a, b) => {
    const left = `${b.date || ""} ${b.time || "00:00"}`;
    const right = `${a.date || ""} ${a.time || "00:00"}`;
    return left.localeCompare(right);
  });
}

function ledgerItems() {
  return sortTransactionsNewest(
    state.transactions.filter((item) => {
      if (state.ledgerFilter === "income") return item.amount > 0;
      if (state.ledgerFilter === "expense") return item.amount < 0;
      return true;
    }),
  );
}

function formatDateTitle(dateKey) {
  const date = parseDate(dateKey);
  const todayKey = toDateKey(today);
  const suffix = dateKey === todayKey ? " 今天" : "";
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日${suffix}`;
}

function renderLedger() {
  const items = ledgerItems();
  const net = items.reduce((sum, item) => sum + item.amount, 0);
  document.querySelector("#ledgerCount").textContent = `${items.length} 笔`;
  document.querySelector("#ledgerNet").textContent = formatMoney(net);
  document.querySelectorAll("[data-ledger-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.ledgerFilter === state.ledgerFilter);
  });

  const grouped = items.reduce((map, item) => {
    const key = item.date || toDateKey(today);
    if (!map[key]) map[key] = [];
    map[key].push(item);
    return map;
  }, {});

  document.querySelector("#ledgerList").innerHTML = Object.entries(grouped)
    .map(([dateKey, records]) => {
      const dayNet = records.reduce((sum, item) => sum + item.amount, 0);
      return `
        <section class="ledger-day">
          <div class="ledger-day-title">
            <h2>${formatDateTitle(dateKey)}</h2>
            <span>${formatMoney(dayNet)}</span>
          </div>
          ${records
            .map(
              (item) => `
                <article class="transaction-row ledger-row" data-edit-transaction="${item.id}" role="button" tabindex="0">
                  <div>
                    <strong>${item.title}</strong>
                    <p>${item.time || "--:--"} · ${item.category} · ${item.project} · ${item.motivation} · ${accountName(item.accountId)}</p>
                  </div>
                  <span class="${item.amount > 0 ? "income" : ""}">${formatMoney(item.amount)}</span>
                </article>
              `,
            )
            .join("")}
        </section>
      `;
    })
    .join("");
}

function renderProfile() {
  document.querySelector("#profileDays").textContent = String(daysBetween(state.startDate, today));
  document.querySelector("#profileTransactionCount").textContent = String(state.transactionBaseCount + state.transactions.length);
  document.querySelector("#profileNetWorth").textContent = formatMoney(netWorth());
  document.querySelector("#syncState").textContent = "已同步";
}

function renderAccountOptions(preferredId) {
  const input = document.querySelector("#accountInput");
  const selected = preferredId || input.value || "huabei";
  input.innerHTML = state.accounts
    .map((account) => `<option value="${account.id}">${account.name} (${formatMoney(account.balance)})</option>`)
    .join("");
  input.value = state.accounts.some((account) => account.id === selected) ? selected : "huabei";
}

function renderOptionChips(type) {
  const groups = document.querySelectorAll(`[data-chip-group="${type}"]`);
  groups.forEach((group) => {
    if (type === "category") {
      group.innerHTML = state.categoryGroups
        .map((categoryGroup) => {
          const isSelectedParent = categoryParentFor(state.selections.category) === categoryGroup.name;
          const displayName = isSelectedParent ? state.selections.category : categoryGroup.name;
          const selected = isSelectedParent ? "selected" : "";
          const marker = isSelectedParent ? '<span class="category-expand-marker" aria-hidden="true">•••</span>' : "";
          return `
            <button class="${selected}" type="button" data-category-parent="${categoryGroup.name}">
              <span>${displayName}</span>
              ${marker}
            </button>
          `;
        })
        .join("");
      return;
    }

    const options = type === "project" || type === "motivation" ? ["", ...state.options[type]] : state.options[type];
    group.innerHTML = options
      .map((option) => {
        const selected = option === state.selections[type] ? "selected" : "";
        const label = option || "无";
        return `<button class="${selected}" type="button" data-option-value="${option}">${label}</button>`;
      })
      .join("");
  });
  renderDetailTrigger(type);
}

function categoryOptions() {
  return state.categoryGroups.flatMap((categoryGroup) => [categoryGroup.name, ...categoryGroup.children]);
}

function updateCategoryOptions() {
  state.options.category = state.categoryGroups.map((categoryGroup) => categoryGroup.name);
}

function ensureNoneCategory() {
  const noneGroup = categoryGroupByName(NONE_CATEGORY);
  if (!noneGroup) {
    state.categoryGroups.push({ name: NONE_CATEGORY, children: [] });
  }
  updateCategoryOptions();
}

function categoryGroupByName(name) {
  return state.categoryGroups.find((categoryGroup) => categoryGroup.name === name);
}

function categoryParentFor(value) {
  if (!value) return "";
  const group = state.categoryGroups.find((categoryGroup) => categoryGroup.name === value || categoryGroup.children.includes(value));
  return group?.name || value;
}

function moveCategoryGroup(sourceName, targetName) {
  if (!sourceName || !targetName || sourceName === targetName || sourceName === NONE_CATEGORY || targetName === NONE_CATEGORY) return;
  const sourceIndex = state.categoryGroups.findIndex((categoryGroup) => categoryGroup.name === sourceName);
  const targetIndex = state.categoryGroups.findIndex((categoryGroup) => categoryGroup.name === targetName);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [group] = state.categoryGroups.splice(sourceIndex, 1);
  state.categoryGroups.splice(targetIndex, 0, group);
  renderOptionChips("category");
  toast("分类顺序已调整");
}

function resetCategoryDrag() {
  window.clearTimeout(categoryDrag.timer);
  categoryDrag.ghost?.remove();
  categoryDrag.ghost = null;
  categoryDrag.timer = null;
  categoryDrag.active = false;
  categoryDrag.source = "";
  categoryDrag.target = "";
  document.querySelectorAll(".category-drag-source, .category-drag-target").forEach((node) => {
    node.classList.remove("category-drag-source", "category-drag-target");
  });
  document.querySelector("[data-chip-group=\"category\"]")?.classList.remove("category-dragging-mode");
}

function createCategoryDragGhost(sourceButton) {
  const rect = sourceButton.getBoundingClientRect();
  const ghost = sourceButton.cloneNode(true);
  ghost.classList.add("category-drag-ghost");
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  document.body.appendChild(ghost);
  categoryDrag.ghost = ghost;
  updateCategoryDragGhost(categoryDrag.latestX, categoryDrag.latestY);
}

function updateCategoryDragGhost(clientX, clientY) {
  if (!categoryDrag.ghost) return;
  categoryDrag.ghost.style.transform = `translate3d(${clientX - categoryDrag.offsetX}px, ${clientY - categoryDrag.offsetY}px, 0)`;
}

function updateCategoryDragTarget(targetName) {
  if (!categoryDrag.active || !targetName || targetName === categoryDrag.target) return;
  categoryDrag.target = targetName;
  document.querySelectorAll("[data-category-parent]").forEach((button) => {
    button.classList.toggle("category-drag-target", button.dataset.categoryParent === targetName && targetName !== categoryDrag.source);
  });
}

function openCategorySheet(parentName) {
  state.activeCategoryParent = parentName;
  renderCategorySheet();
  const sheet = document.querySelector("#categorySheet");
  sheet.hidden = false;
  updateEntrySaveState();
}

function closeCategorySheet() {
  const sheet = document.querySelector("#categorySheet");
  if (!sheet) return;
  sheet.hidden = true;
  closeAddSubcategoryDialog();
  updateEntrySaveState();
}

function openAddSubcategoryDialog() {
  const dialog = document.querySelector("#categoryAddDialog");
  const input = document.querySelector("#newCategoryChildInput");
  if (!dialog || !input) return;
  dialog.hidden = false;
  input.value = "";
  input.focus();
}

function closeAddSubcategoryDialog() {
  const dialog = document.querySelector("#categoryAddDialog");
  if (!dialog) return;
  dialog.hidden = true;
}

function saveSubcategory() {
  const group = categoryGroupByName(state.activeCategoryParent);
  const input = document.querySelector("#newCategoryChildInput");
  const value = input?.value.trim();
  if (!group || !value) {
    toast("请输入子类名称");
    return;
  }

  if (group.name === value || group.children.includes(value)) {
    toast("这个子类已经存在");
    return;
  }

  group.children.push(value);
  state.selections.category = value;
  renderCategorySheet();
  renderOptionChips("category");
  closeCategorySheet();
  toast("已添加子类");
}

function renderCategorySheet() {
  const group = categoryGroupByName(state.activeCategoryParent) || state.categoryGroups[0];
  if (!group) return;

  document.querySelector("#categorySheetTitle").textContent = group.name;
  document.querySelector("#categoryChoiceList").innerHTML = [
    { value: group.name, label: group.name, level: "parent" },
    ...group.children.map((child) => ({ value: child, label: child, level: "child" })),
  ]
    .map((item) => {
      const selected = state.selections.category === item.value ? "selected" : "";
      return `
        <button class="${item.level} ${selected}" type="button" data-category-choice="${item.value}">
          <span>${item.label}</span>
        </button>
      `;
    })
    .join("");
}

function renderDetailTrigger(type) {
  if (type !== "project" && type !== "motivation") return;
  const trigger = document.querySelector(`#${type}Trigger`);
  if (!trigger) return;
  const fallback = type === "project" ? "项目" : "消费动机";
  const value = state.selections[type];
  trigger.textContent = value || fallback;
  trigger.classList.toggle("selected", Boolean(value));
}

function splitEntryTime() {
  const [hour = "12", minute = "49"] = String(state.entryTime || "12:49").split(":");
  return {
    hour: hour.padStart(2, "0").slice(-2),
    minute: minute.padStart(2, "0").slice(-2),
  };
}

function syncPendingTimeFromEntry() {
  const { hour, minute } = splitEntryTime();
  state.pendingEntryHour = hour;
  state.pendingEntryMinute = minute;
}

function renderTimePicker() {
  const hourWheel = document.querySelector("#hourWheel");
  const minuteWheel = document.querySelector("#minuteWheel");
  if (!hourWheel || !minuteWheel) return;

  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));
  const renderOptions = (items, selected, attribute) =>
    items
      .map((item) => {
        const selectedClass = item === selected ? "selected" : "";
        return `<button class="${selectedClass}" type="button" data-${attribute}="${item}">${item}</button>`;
      })
      .join("");

  hourWheel.innerHTML = renderOptions(hours, state.pendingEntryHour, "time-hour");
  minuteWheel.innerHTML = renderOptions(minutes, state.pendingEntryMinute, "time-minute");
  bindTimeWheelScrollEffects();
}

function bindTimeWheelScrollEffects() {
  document.querySelectorAll(".time-wheel").forEach((wheel) => {
    if (wheel.dataset.scrollBound) return;
    wheel.dataset.scrollBound = "true";
    wheel.addEventListener("scroll", () => {
      wheel.classList.add("scrolling");
      window.clearTimeout(wheel.scrollFadeTimer);
      wheel.scrollFadeTimer = window.setTimeout(() => {
        wheel.classList.remove("scrolling");
      }, 1000);
    });
  });
}

function renderDateTimePills() {
  if (!state.entryDate) state.entryDate = toDateKey(today);
  const date = parseDate(state.entryDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const todayKey = toDateKey(today);
  const suffix = state.entryDate === todayKey ? " 今天" : "";
  document.querySelector("#entryDatePill").textContent = `${month} 月 ${day} 日${suffix}`;
  document.querySelector("#entryDatePill").classList.add("selected");
  document.querySelector("#entryTimePill").textContent = state.entryTime;
  renderCalendar();
  renderTimePicker();
}

function renderCalendar() {
  const monthSource = state.calendarMonth || toDateKey(today).slice(0, 7);
  const [year, month] = monthSource.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const start = new Date(first);
  const mondayIndex = (first.getDay() + 6) % 7;
  start.setDate(first.getDate() - mondayIndex);

  document.querySelector("#calendarMonthLabel").textContent = `${year}年${String(month).padStart(2, "0")}月`;

  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    const inMonth = date.getMonth() === month - 1;
    const selected = key === state.pendingEntryDate;
    const isToday = key === toDateKey(today);
    return `
      <button
        type="button"
        class="${inMonth ? "" : "muted"} ${selected ? "selected" : ""} ${isToday ? "today" : ""}"
        data-calendar-date="${key}"
      >${date.getDate()}</button>
    `;
  });

  document.querySelector("#calendarGrid").innerHTML = cells.join("");
}

function renderAllOptionChips() {
  renderOptionChips("category");
  renderOptionChips("project");
  renderOptionChips("motivation");
}

function renderProfileCounts() {
  document.querySelector("#categoryCount").textContent = `${categoryOptions().length} 个选项`;
  document.querySelector("#projectCount").textContent = `${state.options.project.length} 个选项`;
  document.querySelector("#motivationCount").textContent = `${state.options.motivation.length} 个选项`;
}

function renderManageScreen() {
  const type = state.manageType;
  const meta = optionMeta[type];
  document.querySelector("#manageTitle").textContent = meta.title;
  document.querySelector("#manageSummaryTitle").textContent = `维护${meta.title}`;
  document.querySelector("#manageSummaryText").textContent = meta.summary;
  document.querySelector("#newOptionInput").placeholder = type === "category" ? "新增大类" : `新增${meta.title}`;

  if (type === "category") {
    renderCategoryManageScreen();
    return;
  }

  document.querySelector("#optionList").innerHTML = state.options[type]
    .map((option) => {
      return `
        <article class="option-row">
          <div class="option-main">
            <strong>${option}</strong>
          </div>
          <button class="delete-option" type="button" data-delete-option="${option}" aria-label="删除${option}">删除</button>
        </article>
      `;
    })
    .join("");
}

function renderCategoryManageScreen() {
  ensureNoneCategory();
  document.querySelector("#optionList").innerHTML = `
    ${state.categoryGroups.map(renderCategoryManageGroup).join("")}
    ${renderCategoryEditLayer()}
    ${renderCategoryActionDialog()}
  `;
}

function renderCategoryManageGroup(categoryGroup) {
  const isNone = categoryGroup.name === NONE_CATEGORY;
  const isOpen = isNone || state.openCategoryManageGroups.includes(categoryGroup.name);
  const isAddingChild = state.editingCategory?.level === "new-child" && state.editingCategory.parent === categoryGroup.name;
  const childCount = categoryGroup.children.length;

  return `
    <section class="category-manage-card ${isNone ? "system" : ""}">
      <article class="category-manage-parent">
        <button class="category-fold-button" type="button" data-toggle-category-group="${categoryGroup.name}" aria-label="${isOpen ? "折叠" : "展开"}${categoryGroup.name}">
          ${isOpen ? "⌄" : "›"}
        </button>
        <div class="category-manage-title">
          <strong>${categoryGroup.name}${childCount ? `(${childCount})` : ""}</strong>
          <small>${isNone ? "系统兜底分类" : `${childCount} 个二级细分`}</small>
        </div>
        ${
          isNone
            ? '<span class="category-system-badge">系统</span>'
            : `<button class="category-edit-button" type="button" data-edit-category-parent="${categoryGroup.name}" aria-label="编辑${categoryGroup.name}">✎</button>`
        }
      </article>
      ${
        isOpen
          ? `
            <div class="category-child-pills">
              ${categoryGroup.children.map((child) => renderCategoryChildPill(categoryGroup.name, child)).join("")}
              ${
                isNone
                  ? ""
                  : `<button class="category-child-pill add" type="button" data-open-manage-add-child="${categoryGroup.name}">+ 子类</button>`
              }
            </div>
          `
          : ""
      }
      ${isAddingChild ? "" : renderCategoryChildEditArea(categoryGroup.name)}
    </section>
  `;
}

function renderCategoryChildPill(parentName, childName) {
  const isEditing =
    state.editingCategory?.level === "child" &&
    state.editingCategory.parent === parentName &&
    state.editingCategory.name === childName;
  return `
    <button class="category-child-pill ${isEditing ? "editing" : ""}" type="button" data-edit-category-child="${childName}" data-category-parent-name="${parentName}">
      ${childName}
    </button>
  `;
}

function renderCategoryChildEditArea() {
  return "";
}

function renderCategoryEditLayer() {
  if (!state.editingCategory) return "";

  return `
    <div class="category-edit-layer" data-category-edit-backdrop>
      ${renderCategoryEditCard(state.editingCategory)}
    </div>
  `;
}

function renderCategoryEditCard({ level, parent, name = parent }) {
  if (level === "new-child") {
    return `
      <div class="category-edit-card child" data-category-edit-card>
        <div class="category-edit-card-title">新增二级细分</div>
        <div class="category-name-line">
          <label>
            <span>名称</span>
            <input data-category-new-child-name="${parent}" placeholder="输入新的二级细分" />
          </label>
          <button type="button" data-save-new-category-child="${parent}">保存</button>
        </div>
      </div>
    `;
  }

  const isParent = level === "parent";
  const title = isParent ? "修改大类" : "修改二级细分";
  const deleteTarget = isParent ? parent : name;
  return `
    <div class="category-edit-card ${isParent ? "parent" : "child"}" data-category-edit-card>
      <div class="category-edit-card-title">${title}</div>
      <div class="category-name-line">
        <label>
          <span>名称</span>
          <input data-category-edit-name value="${name}" />
        </label>
        <button type="button" data-save-category-${level}="${name}" data-category-parent-name="${parent}">保存</button>
      </div>
      <div class="category-edit-actions">
        <button class="secondary" type="button" data-open-category-merge="${level}" data-category-parent-name="${parent}" data-category-name="${name}">合并</button>
        <button class="danger" type="button" data-open-category-delete="${level}" data-category-parent-name="${parent}" data-category-name="${deleteTarget}">删除</button>
      </div>
    </div>
  `;
}

function categoryMergeTargets(excludedValues) {
  const excluded = new Set(excludedValues);
  return categoryOptions().filter((option) => !excluded.has(option));
}

function renderCategoryActionDialog() {
  const dialog = state.categoryActionDialog;
  if (!dialog) return "";
  const isMerge = dialog.type === "merge";
  const title = isMerge ? "合并分类" : "删除分类";
  const targetName = dialog.level === "parent" ? dialog.parent : dialog.name;
  const group = categoryGroupByName(dialog.parent);
  const excluded = dialog.level === "parent" && group ? [group.name, ...group.children] : [dialog.name];
  const mergeTargets = isMerge ? categoryMergeTargets(excluded) : [];

  return `
    <div class="category-action-layer" data-category-action-backdrop>
      <div class="category-action-dialog" data-category-action-dialog>
        <h3>${title}</h3>
        ${
          isMerge
            ? `
              <p>将“${targetName}”及相关账目合并到目标分类。</p>
              <label>
                <span>目标分类</span>
                <select data-category-action-target>
                  <option value="">选择目标分类</option>
                  ${mergeTargets.map((target) => `<option value="${target}">${target}</option>`).join("")}
                </select>
              </label>
            `
            : `<p>删除“${targetName}”后，相关账目会归入“${NONE_CATEGORY}”。此操作需要确认。</p>`
        }
        <div class="category-action-buttons">
          <button class="secondary" type="button" data-cancel-category-action>取消</button>
          <button class="${isMerge ? "" : "danger"}" type="button" data-confirm-category-action>${isMerge ? "确定合并" : "确认删除"}</button>
        </div>
      </div>
    </div>
  `;
}

function selectedText(groupName) {
  if ((groupName === "project" || groupName === "motivation") && !state.selections[groupName]) return "无";
  return state.selections[groupName] || "未标注";
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => node.classList.remove("show"), 1800);
}

function setEntryType(type) {
  state.entryType = type;
  document.querySelectorAll("[data-entry-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.entryType === type);
  });
}

function resetEntryForm(type = "expense") {
  state.editingTransactionId = null;
  setEntryType(type);
  state.entryDate = toDateKey(today);
  state.pendingEntryDate = state.entryDate;
  state.calendarMonth = state.entryDate.slice(0, 7);
  state.entryTime = "12:49";
  syncPendingTimeFromEntry();
  state.selections.project = "";
  state.selections.motivation = "";
  document.querySelector("#amountInput").value = "";
  document.querySelector("#noteInput").value = "";
  renderAccountOptions("huabei");
  renderAllOptionChips();
  renderDateTimePills();
  closeDetailPanels();
  closeCategorySheet();
  document.querySelector("#saveTransaction").textContent = "保存记录";
}

function openTransactionEditor(transactionId) {
  const item = state.transactions.find((transaction) => String(transaction.id) === String(transactionId));
  if (!item) return;

  state.editingTransactionId = item.id;
  setEntryType(item.type);
  state.entryDate = item.date || toDateKey(today);
  state.pendingEntryDate = state.entryDate;
  state.calendarMonth = state.entryDate.slice(0, 7);
  state.entryTime = item.time || "12:49";
  syncPendingTimeFromEntry();
  if (categoryOptions().includes(item.category)) state.selections.category = item.category;
  if (state.options.project.includes(item.project)) state.selections.project = item.project;
  if (state.options.motivation.includes(item.motivation)) state.selections.motivation = item.motivation;

  renderAllOptionChips();
  renderDateTimePills();
  renderAccountOptions(item.accountId);
  closeDetailPanels();
  closeCategorySheet();
  document.querySelector("#amountInput").value = Math.abs(item.amount);
  document.querySelector("#noteInput").value = item.note || item.title;
  document.querySelector("#saveTransaction").textContent = "保存修改";
  showScreen("entry");
}

function toggleDetailPanel(type) {
  if (type === "date") {
    state.pendingEntryDate = state.entryDate || toDateKey(today);
    state.calendarMonth = state.pendingEntryDate.slice(0, 7);
    renderCalendar();
  }
  if (type === "time") {
    syncPendingTimeFromEntry();
    renderTimePicker();
  }
  document.querySelectorAll("[data-detail-panel]").forEach((panel) => {
    const isTarget = panel.dataset.detailPanel === type;
    panel.hidden = isTarget ? !panel.hidden : true;
  });
  updateEntrySaveState();
}

function closeDetailPanels() {
  document.querySelectorAll("[data-detail-panel]").forEach((panel) => {
    panel.hidden = true;
  });
  updateEntrySaveState();
}

function hasOpenDetailPanel() {
  return [...document.querySelectorAll("[data-detail-panel]")].some((panel) => !panel.hidden) || hasOpenCategorySheet();
}

function hasOpenCategorySheet() {
  const sheet = document.querySelector("#categorySheet");
  return Boolean(sheet && !sheet.hidden);
}

function updateEntrySaveState() {
  const saveButton = document.querySelector("#saveTransaction");
  if (!saveButton) return;
  saveButton.disabled = hasOpenDetailPanel();
}

function normalizeSelection(type) {
  if (type === "category") {
    if (!categoryOptions().includes(state.selections.category)) {
      state.selections.category = NONE_CATEGORY;
    }
    return;
  }

  if (!state.options[type].includes(state.selections[type])) {
    state.selections[type] = state.options[type][0] || "";
  }
}

function estimateInterestSaved(amount) {
  const strategy = document.querySelector("#prepayStrategy")?.value || "term";
  const savedRate = strategy === "term" ? 0.264 : 0.188;
  return Math.round(amount * savedRate);
}

function addOption() {
  const input = document.querySelector("#newOptionInput");
  const value = input.value.trim();
  const type = state.manageType;

  if (!value) {
    toast("请输入选项名称");
    return;
  }

  if (type === "category") {
    if (categoryGroupByName(value)) {
      toast("这个大类已经存在");
      return;
    }
    state.categoryGroups.push({ name: value, children: [] });
    updateCategoryOptions();
    state.openCategoryManageGroups = Array.from(new Set([...state.openCategoryManageGroups, value]));
    state.editingCategory = { level: "parent", parent: value, name: value };
    input.value = "";
    renderAll();
    toast("已添加大类");
    return;
  }

  if (state.options[type].includes(value)) {
    toast("这个选项已经存在");
    return;
  }

  state.options[type].push(value);
  state.selections[type] = value;
  input.value = "";
  renderAll();
  toast("已添加选项");
}

function renameCategoryParent(oldName, nextName) {
  const value = nextName.trim();
  const group = categoryGroupByName(oldName);
  if (oldName === NONE_CATEGORY) {
    toast("“无”是系统分类，不能修改");
    renderManageScreen();
    return;
  }
  if (!group || !value) {
    renderManageScreen();
    return;
  }
  if (value !== oldName && categoryGroupByName(value)) {
    toast("这个大类已经存在");
    renderManageScreen();
    return;
  }

  group.name = value;
  updateCategoryOptions();
  migrateCategoryValue(oldName, value);
  if (state.selections.category === oldName) state.selections.category = value;
  if (state.activeCategoryParent === oldName) state.activeCategoryParent = value;
  state.openCategoryManageGroups = state.openCategoryManageGroups.map((name) => (name === oldName ? value : name));
  state.editingCategory = null;
  renderAll();
  toast("已修改大类");
}

function renameCategoryChild(parentName, oldName, nextName) {
  const value = nextName.trim();
  const group = categoryGroupByName(parentName);
  if (!group || !value) {
    renderManageScreen();
    return;
  }
  if (value !== oldName && group.children.includes(value)) {
    toast("这个子类已经存在");
    renderManageScreen();
    return;
  }

  group.children = group.children.map((child) => (child === oldName ? value : child));
  migrateCategoryValue(oldName, value);
  if (state.selections.category === oldName) state.selections.category = value;
  state.editingCategory = null;
  renderAll();
  toast("已修改子类");
}

function addCategoryChildFromManage(parentName, value) {
  const name = value.trim();
  const group = categoryGroupByName(parentName);
  if (!group || !name) {
    toast("请输入子类名称");
    return;
  }
  if (group.name === name || group.children.includes(name)) {
    toast("这个子类已经存在");
    return;
  }

  group.children.push(name);
  state.openCategoryManageGroups = Array.from(new Set([...state.openCategoryManageGroups, parentName]));
  state.editingCategory = null;
  renderAll();
  toast("已添加子类");
}

function deleteCategoryParent(parentName) {
  if (parentName === NONE_CATEGORY) {
    toast("“无”是系统分类，不能删除");
    return;
  }
  const group = categoryGroupByName(parentName);
  if (!group) return;
  migrateCategoryValues([group.name, ...group.children], NONE_CATEGORY);
  state.categoryGroups = state.categoryGroups.filter((categoryGroup) => categoryGroup.name !== parentName);
  updateCategoryOptions();
  if (group.name === state.selections.category || group.children.includes(state.selections.category)) {
    state.selections.category = NONE_CATEGORY;
  }
  state.openCategoryManageGroups = state.openCategoryManageGroups.filter((name) => name !== parentName);
  state.editingCategory = null;
  renderAll();
  toast("已删除大类，相关账目已归为“无”");
}

function deleteCategoryChild(parentName, childName) {
  const group = categoryGroupByName(parentName);
  if (!group) return;
  migrateCategoryValue(childName, NONE_CATEGORY);
  group.children = group.children.filter((child) => child !== childName);
  if (state.selections.category === childName) state.selections.category = NONE_CATEGORY;
  state.editingCategory = null;
  renderAll();
  toast("已删除子类，相关账目已归为“无”");
}

function migrateCategoryValue(from, to) {
  state.transactions.forEach((item) => {
    if (item.category === from) item.category = to;
  });
  state.plannedFlows.forEach((item) => {
    if (item.category === from) item.category = to;
  });
  if (state.selections.category === from) state.selections.category = to;
}

function migrateCategoryValues(fromValues, to) {
  fromValues.forEach((from) => migrateCategoryValue(from, to));
}

function mergeCategoryParent(parentName, targetName) {
  const group = categoryGroupByName(parentName);
  if (!group || !targetName) {
    toast("请选择合并目标");
    return;
  }
  if (parentName === NONE_CATEGORY) {
    toast("“无”是系统分类，不能合并");
    return;
  }
  if ([group.name, ...group.children].includes(targetName)) {
    toast("不能合并到自身或自己的子类");
    return;
  }

  migrateCategoryValues([group.name, ...group.children], targetName);
  state.categoryGroups = state.categoryGroups.filter((categoryGroup) => categoryGroup.name !== parentName);
  updateCategoryOptions();
  state.openCategoryManageGroups = state.openCategoryManageGroups.filter((name) => name !== parentName);
  state.editingCategory = null;
  renderAll();
  toast(`已合并到${targetName}`);
}

function mergeCategoryChild(parentName, childName, targetName) {
  const group = categoryGroupByName(parentName);
  if (!group || !targetName) {
    toast("请选择合并目标");
    return;
  }
  if (childName === targetName) {
    toast("不能合并到自身");
    return;
  }

  migrateCategoryValue(childName, targetName);
  group.children = group.children.filter((child) => child !== childName);
  state.editingCategory = null;
  renderAll();
  toast(`已合并到${targetName}`);
}

function closeCategoryEditLayer() {
  state.editingCategory = null;
  renderManageScreen();
}

function openCategoryActionDialog(type, level, parent, name) {
  state.categoryActionDialog = { type, level, parent, name };
  renderManageScreen();
}

function closeCategoryActionDialog() {
  state.categoryActionDialog = null;
  renderManageScreen();
}

function confirmCategoryAction() {
  const dialog = state.categoryActionDialog;
  if (!dialog) return;

  if (dialog.type === "merge") {
    const target = document.querySelector("[data-category-action-target]")?.value || "";
    if (!target) {
      toast("请选择合并目标");
      return;
    }
    state.categoryActionDialog = null;
    state.editingCategory = null;
    if (dialog.level === "parent") {
      mergeCategoryParent(dialog.parent, target);
    } else {
      mergeCategoryChild(dialog.parent, dialog.name, target);
    }
    return;
  }

  state.categoryActionDialog = null;
  state.editingCategory = null;
  if (dialog.level === "parent") {
    deleteCategoryParent(dialog.parent);
  } else {
    deleteCategoryChild(dialog.parent, dialog.name);
  }
}

function saveTransaction() {
  if (hasOpenDetailPanel()) {
    toast("请先完成细分标注选择");
    return;
  }

  const amountInput = document.querySelector("#amountInput");
  const rawAmount = Number(amountInput.value);
  if (!rawAmount || rawAmount <= 0) {
    toast("请输入有效金额");
    return;
  }

  const accountId = document.querySelector("#accountInput").value;
  const account = state.accounts.find((item) => item.id === accountId);
  const note = document.querySelector("#noteInput").value.trim();
  const signedAmount = state.entryType === "income" ? rawAmount : -rawAmount;
  const title = note || (state.entryType === "income" ? "新增收入" : selectedText("category"));
  const wasEditing = Boolean(state.editingTransactionId);
  if (!state.entryDate) state.entryDate = toDateKey(today);
  if (!state.entryTime) state.entryTime = "12:49";

  const nextTransaction = {
    id: state.editingTransactionId || Date.now(),
    date: state.entryDate,
    time: state.entryTime,
    type: state.entryType,
    accountId,
    title,
    category: state.entryType === "income" ? "收入" : selectedText("category"),
    project: selectedText("project"),
    motivation: selectedText("motivation"),
    amount: signedAmount,
    note,
  };

  if (state.editingTransactionId) {
    const index = state.transactions.findIndex((item) => item.id === state.editingTransactionId);
    const previous = state.transactions[index];
    if (!previous) return;
    const previousAccount = state.accounts.find((item) => item.id === previous.accountId);
    if (previousAccount) previousAccount.balance -= previous.amount;
    if (account) account.balance += signedAmount;
    state.transactions[index] = nextTransaction;
  } else {
    state.transactions.unshift(nextTransaction);
    if (account) account.balance += signedAmount;
  }

  state.editingTransactionId = null;
  amountInput.value = "";
  document.querySelector("#noteInput").value = "";
  document.querySelector("#saveTransaction").textContent = "保存记录";
  renderAll();
  showScreen("home");
  toast(wasEditing ? "已保存修改" : "已保存到今日流水");
}

function updateDebtPreview() {
  const amount = Number(document.querySelector("#prepayAmount").value) || 0;
  const saved = estimateInterestSaved(amount);
  const { lowest } = forecastStats(amount);

  document.querySelector("#cashOut").textContent = formatMoney(-amount);
  document.querySelector("#interestSaved").textContent = formatMoney(saved);
  document.querySelector("#futureLowest").textContent = formatMoney(lowest);
  document.querySelector("#debtAdvice").textContent =
    lowest < 10000 ? "金额偏高，建议降低方案" : "保留 2 个月缓冲金";
  renderScenario();
}

function applyDebtPlan() {
  const amount = Number(document.querySelector("#prepayAmount").value) || 0;
  if (amount <= 0) {
    toast("请输入提前还款金额");
    return;
  }

  const bank = state.accounts.find((account) => account.id === "bank");
  const debt = state.debts[0];
  if (bank) bank.balance -= amount;
  debt.balance = Math.max(0, debt.balance - amount);

  state.transactions.unshift({
    id: Date.now(),
    date: toDateKey(today),
    time: "12:49",
    type: "expense",
    accountId: "bank",
    title: "提前还贷",
    category: "贷款",
    project: "房产 1",
    motivation: "风险降低",
    amount: -amount,
    note: "提前还贷模拟记入账本",
  });

  renderAll();
  showScreen("home");
  toast("提前还贷已记入账本");
}

document.addEventListener("click", (event) => {
  const insideDetailControl = event.target.closest("[data-detail-toggle], .calendar-picker, .time-picker, .detail-picker, .detail-chip-grid");
  if (!insideDetailControl) closeDetailPanels();

  if (event.target.closest("[data-category-close]")) {
    closeCategorySheet();
    return;
  }

  const categoryParent = event.target.closest("[data-category-parent]");
  if (categoryParent) {
    if (categoryDrag.suppressClick) {
      categoryDrag.suppressClick = false;
      return;
    }
    openCategorySheet(categoryParent.dataset.categoryParent);
    return;
  }

  const categoryChoice = event.target.closest("[data-category-choice]");
  if (categoryChoice) {
    state.selections.category = categoryChoice.dataset.categoryChoice;
    renderOptionChips("category");
    closeCategorySheet();
    return;
  }

  if (event.target.closest("[data-open-add-category]")) {
    openAddSubcategoryDialog();
    return;
  }

  if (event.target.closest("#saveCategoryChild")) {
    saveSubcategory();
    return;
  }

  const detailToggle = event.target.closest("[data-detail-toggle]");
  if (detailToggle) {
    toggleDetailPanel(detailToggle.dataset.detailToggle);
    return;
  }

  const monthNav = event.target.closest("[data-calendar-nav]");
  if (monthNav) {
    const [year, month] = state.calendarMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + Number(monthNav.dataset.calendarNav), 1);
    state.calendarMonth = formatMonthKey(next);
    renderCalendar();
    return;
  }

  const calendarDate = event.target.closest("[data-calendar-date]");
  if (calendarDate) {
    state.pendingEntryDate = calendarDate.dataset.calendarDate;
    state.calendarMonth = state.pendingEntryDate.slice(0, 7);
    renderCalendar();
    return;
  }

  if (event.target.closest("#saveDateButton")) {
    state.entryDate = state.pendingEntryDate || toDateKey(today);
    state.calendarMonth = state.entryDate.slice(0, 7);
    renderDateTimePills();
    closeDetailPanels();
    return;
  }

  if (event.target.closest("#saveTimeButton")) {
    state.entryTime = `${state.pendingEntryHour}:${state.pendingEntryMinute}`;
    renderDateTimePills();
    closeDetailPanels();
    return;
  }

  const hourButton = event.target.closest("[data-time-hour]");
  if (hourButton) {
    state.pendingEntryHour = hourButton.dataset.timeHour;
    renderTimePicker();
    return;
  }

  const minuteButton = event.target.closest("[data-time-minute]");
  if (minuteButton) {
    state.pendingEntryMinute = minuteButton.dataset.timeMinute;
    renderTimePicker();
    return;
  }

  const ledgerFilter = event.target.closest("[data-ledger-filter]");
  if (ledgerFilter) {
    state.ledgerFilter = ledgerFilter.dataset.ledgerFilter;
    renderLedger();
    return;
  }

  const editableTransaction = event.target.closest("[data-edit-transaction]");
  if (editableTransaction) {
    openTransactionEditor(editableTransaction.dataset.editTransaction);
    return;
  }

  const manageButton = event.target.closest("[data-manage-type]");
  if (manageButton) {
    state.manageType = manageButton.dataset.manageType;
    state.editingCategory = null;
    state.categoryActionDialog = null;
    renderManageScreen();
    showScreen("manage");
    return;
  }

  const editBackdrop = event.target.closest("[data-category-edit-backdrop]");
  if (editBackdrop && !event.target.closest("[data-category-edit-card]")) {
    state.editingCategory = null;
    renderManageScreen();
    return;
  }

  const actionBackdrop = event.target.closest("[data-category-action-backdrop]");
  if (actionBackdrop && !event.target.closest("[data-category-action-dialog]")) {
    state.categoryActionDialog = null;
    renderManageScreen();
    return;
  }

  const toggleCategoryGroupButton = event.target.closest("[data-toggle-category-group]");
  if (toggleCategoryGroupButton) {
    const groupName = toggleCategoryGroupButton.dataset.toggleCategoryGroup;
    if (groupName !== NONE_CATEGORY) {
      state.openCategoryManageGroups = state.openCategoryManageGroups.includes(groupName)
        ? state.openCategoryManageGroups.filter((name) => name !== groupName)
        : [...state.openCategoryManageGroups, groupName];
    }
    renderManageScreen();
    return;
  }

  const editCategoryParentButton = event.target.closest("[data-edit-category-parent]");
  if (editCategoryParentButton) {
    const parentName = editCategoryParentButton.dataset.editCategoryParent;
    state.editingCategory = { level: "parent", parent: parentName, name: parentName };
    state.categoryActionDialog = null;
    state.openCategoryManageGroups = Array.from(new Set([...state.openCategoryManageGroups, parentName]));
    renderManageScreen();
    document.querySelector("[data-category-edit-name]")?.focus();
    return;
  }

  const editCategoryChildButton = event.target.closest("[data-edit-category-child]");
  if (editCategoryChildButton) {
    const parentName = editCategoryChildButton.dataset.categoryParentName;
    state.editingCategory = { level: "child", parent: parentName, name: editCategoryChildButton.dataset.editCategoryChild };
    state.categoryActionDialog = null;
    state.openCategoryManageGroups = Array.from(new Set([...state.openCategoryManageGroups, parentName]));
    renderManageScreen();
    document.querySelector("[data-category-edit-name]")?.focus();
    return;
  }

  const openManageAddChildButton = event.target.closest("[data-open-manage-add-child]");
  if (openManageAddChildButton) {
    const parentName = openManageAddChildButton.dataset.openManageAddChild;
    state.editingCategory = { level: "new-child", parent: parentName, name: "" };
    state.categoryActionDialog = null;
    state.openCategoryManageGroups = Array.from(new Set([...state.openCategoryManageGroups, parentName]));
    renderManageScreen();
    document.querySelector(`[data-category-new-child-name="${parentName}"]`)?.focus();
    return;
  }

  if (event.target.closest("[data-cancel-category-edit]")) {
    state.editingCategory = null;
    renderManageScreen();
    return;
  }

  const saveCategoryParentButton = event.target.closest("[data-save-category-parent]");
  if (saveCategoryParentButton) {
    const input = saveCategoryParentButton.closest(".category-edit-card")?.querySelector("[data-category-edit-name]");
    renameCategoryParent(saveCategoryParentButton.dataset.saveCategoryParent, input?.value || "");
    return;
  }

  const saveCategoryChildButton = event.target.closest("[data-save-category-child]");
  if (saveCategoryChildButton) {
    const input = saveCategoryChildButton.closest(".category-edit-card")?.querySelector("[data-category-edit-name]");
    renameCategoryChild(
      saveCategoryChildButton.dataset.categoryParentName,
      saveCategoryChildButton.dataset.saveCategoryChild,
      input?.value || "",
    );
    return;
  }

  const saveNewCategoryChildButton = event.target.closest("[data-save-new-category-child]");
  if (saveNewCategoryChildButton) {
    const parentName = saveNewCategoryChildButton.dataset.saveNewCategoryChild;
    const input = saveNewCategoryChildButton.closest(".category-edit-card")?.querySelector(`[data-category-new-child-name="${parentName}"]`);
    addCategoryChildFromManage(parentName, input?.value || "");
    return;
  }

  const openCategoryMergeButton = event.target.closest("[data-open-category-merge]");
  if (openCategoryMergeButton) {
    openCategoryActionDialog(
      "merge",
      openCategoryMergeButton.dataset.openCategoryMerge,
      openCategoryMergeButton.dataset.categoryParentName,
      openCategoryMergeButton.dataset.categoryName,
    );
    return;
  }

  const openCategoryDeleteButton = event.target.closest("[data-open-category-delete]");
  if (openCategoryDeleteButton) {
    openCategoryActionDialog(
      "delete",
      openCategoryDeleteButton.dataset.openCategoryDelete,
      openCategoryDeleteButton.dataset.categoryParentName,
      openCategoryDeleteButton.dataset.categoryName,
    );
    return;
  }

  if (event.target.closest("[data-cancel-category-action]")) {
    closeCategoryActionDialog();
    return;
  }

  if (event.target.closest("[data-confirm-category-action]")) {
    confirmCategoryAction();
    return;
  }

  const mergeCategoryParentButton = event.target.closest("[data-merge-category-parent]");
  if (mergeCategoryParentButton) {
    const target = mergeCategoryParentButton.closest(".category-edit-card")?.querySelector("[data-category-merge-target]")?.value || "";
    mergeCategoryParent(mergeCategoryParentButton.dataset.mergeCategoryParent, target);
    return;
  }

  const mergeCategoryChildButton = event.target.closest("[data-merge-category-child]");
  if (mergeCategoryChildButton) {
    const target = mergeCategoryChildButton.closest(".category-edit-card")?.querySelector("[data-category-merge-target]")?.value || "";
    mergeCategoryChild(
      mergeCategoryChildButton.dataset.categoryParentName,
      mergeCategoryChildButton.dataset.mergeCategoryChild,
      target,
    );
    return;
  }

  const deleteButton = event.target.closest("[data-delete-option]");
  if (deleteButton) {
    const type = state.manageType;
    if (state.options[type].length <= 1) {
      toast("至少保留一个选项");
      return;
    }

    state.options[type] = state.options[type].filter((option) => option !== deleteButton.dataset.deleteOption);
    normalizeSelection(type);
    renderAll();
    toast("已删除选项");
    return;
  }

  const deleteCategoryParentButton = event.target.closest("[data-delete-category-parent]");
  if (deleteCategoryParentButton) {
    deleteCategoryParent(deleteCategoryParentButton.dataset.deleteCategoryParent);
    return;
  }

  const deleteCategoryChildButton = event.target.closest("[data-delete-category-child]");
  if (deleteCategoryChildButton) {
    deleteCategoryChild(deleteCategoryChildButton.dataset.categoryParentName, deleteCategoryChildButton.dataset.deleteCategoryChild);
    return;
  }

  const addCategoryChildButton = event.target.closest("[data-add-category-child]");
  if (addCategoryChildButton) {
    const parentName = addCategoryChildButton.dataset.addCategoryChild;
    const input = document.querySelector(`[data-new-category-child="${parentName}"]`);
    addCategoryChildFromManage(parentName, input?.value || "");
    return;
  }

  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    showScreen(navButton.dataset.nav);
    return;
  }

  const openEntryButton = event.target.closest("[data-open-entry]");
  if (openEntryButton) {
    resetEntryForm(openEntryButton.dataset.openEntry);
    showScreen("entry");
    return;
  }

  const entryTypeButton = event.target.closest("[data-entry-type]");
  if (entryTypeButton) {
    setEntryType(entryTypeButton.dataset.entryType);
    return;
  }

  const chip = event.target.closest("[data-chip-group] button");
  if (chip) {
    const type = chip.parentElement.dataset.chipGroup;
    state.selections[type] = chip.getAttribute("data-option-value") || "";
    renderOptionChips(type);
    if (type === "project" || type === "motivation") closeDetailPanels();
  }
});

document.addEventListener("pointerdown", (event) => {
  const categoryButton = event.target.closest("[data-category-parent]");
  if (!categoryButton || hasOpenCategorySheet()) return;
  const rect = categoryButton.getBoundingClientRect();

  window.clearTimeout(categoryDrag.timer);
  categoryDrag.active = false;
  categoryDrag.source = categoryButton.dataset.categoryParent;
  categoryDrag.target = categoryDrag.source;
  categoryDrag.offsetX = event.clientX - rect.left;
  categoryDrag.offsetY = event.clientY - rect.top;
  categoryDrag.latestX = event.clientX;
  categoryDrag.latestY = event.clientY;
  categoryDrag.timer = window.setTimeout(() => {
    categoryDrag.active = true;
    categoryDrag.suppressClick = true;
    document.querySelector("[data-chip-group=\"category\"]")?.classList.add("category-dragging-mode");
    categoryButton.classList.add("category-drag-source");
    createCategoryDragGhost(categoryButton);
  }, 420);
});

document.addEventListener("pointermove", (event) => {
  categoryDrag.latestX = event.clientX;
  categoryDrag.latestY = event.clientY;
  if (!categoryDrag.active) return;
  updateCategoryDragGhost(event.clientX, event.clientY);
  const hovered = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("[data-category-parent]");
  if (hovered) updateCategoryDragTarget(hovered.dataset.categoryParent);
});

document.addEventListener("pointerup", () => {
  const shouldMove = categoryDrag.active && categoryDrag.source && categoryDrag.target && categoryDrag.source !== categoryDrag.target;
  const source = categoryDrag.source;
  const target = categoryDrag.target;
  const wasActive = categoryDrag.active;
  resetCategoryDrag();
  if (shouldMove) moveCategoryGroup(source, target);
  if (wasActive) window.setTimeout(() => {
    categoryDrag.suppressClick = false;
  }, 0);
});

document.addEventListener("pointercancel", resetCategoryDrag);

document.addEventListener("change", (event) => {
  const parentInput = event.target.closest?.("[data-rename-category-parent]");
  if (parentInput) {
    renameCategoryParent(parentInput.dataset.renameCategoryParent, parentInput.value);
    return;
  }

  const childInput = event.target.closest?.("[data-rename-category-child]");
  if (childInput) {
    renameCategoryChild(childInput.dataset.categoryParentName, childInput.dataset.renameCategoryChild, childInput.value);
  }
});

document.addEventListener("keydown", (event) => {
  const categoryEditName = event.target.closest?.("[data-category-edit-name]");
  if (categoryEditName && event.key === "Enter") {
    const card = categoryEditName.closest(".category-edit-card");
    const parentSave = card?.querySelector("[data-save-category-parent]");
    const childSave = card?.querySelector("[data-save-category-child]");
    parentSave?.click();
    childSave?.click();
    return;
  }

  const categoryNewChildName = event.target.closest?.("[data-category-new-child-name]");
  if (categoryNewChildName && event.key === "Enter") {
    const parentName = categoryNewChildName.dataset.categoryNewChildName;
    addCategoryChildFromManage(parentName, categoryNewChildName.value);
    return;
  }

  const newChildInput = event.target.closest?.("[data-new-category-child]");
  if (newChildInput && event.key === "Enter") {
    addCategoryChildFromManage(newChildInput.dataset.newCategoryChild, newChildInput.value);
    return;
  }

  const renameParentInput = event.target.closest?.("[data-rename-category-parent]");
  if (renameParentInput && event.key === "Enter") {
    renameCategoryParent(renameParentInput.dataset.renameCategoryParent, renameParentInput.value);
    return;
  }

  const renameChildInput = event.target.closest?.("[data-rename-category-child]");
  if (renameChildInput && event.key === "Enter") {
    renameCategoryChild(renameChildInput.dataset.categoryParentName, renameChildInput.dataset.renameCategoryChild, renameChildInput.value);
    return;
  }

  const editableTransaction = event.target.closest?.("[data-edit-transaction]");
  if (!editableTransaction || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  openTransactionEditor(editableTransaction.dataset.editTransaction);
});

document.querySelector("#saveTransaction").addEventListener("click", saveTransaction);
document.querySelector("#prepayAmount").addEventListener("input", updateDebtPreview);
document.querySelector("#prepayStrategy").addEventListener("change", updateDebtPreview);
document.querySelector("#applyDebtPlan").addEventListener("click", applyDebtPlan);
document.querySelector("#addOptionButton").addEventListener("click", addOption);
document.querySelector("#newOptionInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") addOption();
});
document.querySelector("#newCategoryChildInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveSubcategory();
});

function renderAll() {
  ensureNoneCategory();
  renderAccountOptions();
  renderAllOptionChips();
  renderDateTimePills();
  renderProfileCounts();
  renderManageScreen();
  renderHome();
  renderTimeline();
  renderScenario();
  renderDebt();
  renderAnalysis();
  renderLedger();
  renderProfile();
}

renderAll();
