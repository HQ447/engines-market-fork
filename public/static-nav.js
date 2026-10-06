(function () {
  if (window.__enginesMarketStaticNavigationLoaded) return;
  window.__enginesMarketStaticNavigationLoaded = true;

  const CALL_NUMBER_DISPLAY = "020 3488 4649";
  const CALL_NUMBER_TEL = "tel:+442034884649";
  const WHATSAPP_URL = "https://wa.me/447311343662";
  const SITE_URL = "https://enginesmarket.co.uk";
  const DESKTOP_PREVIEW_COUNT = 10;

  const state = {
    navMenus: [],
    footerNavigation: [],
    openMenuId: null,
    activeBrandHref: "",
    brandsExpanded: false,
    mobileOpen: false,
    mobileStack: [{ type: "root" }],
    desktopQueries: {},
    mobileQueries: {},
    expandedGroups: {},
  };

  const refs = {
    header: null,
    desktopNav: null,
    desktopPanel: null,
    mobilePanel: null,
    footer: null,
  };

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function createLink(label, href, className) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = label;
    if (className) anchor.className = className;
    return anchor;
  }

  function createLogo() {
    const logo = createLink("", "/", "em-static-logo");
    logo.setAttribute("aria-label", "Engines Market homepage");
    logo.innerHTML =
      '<img class="em-static-logo__image" src="/branding/engine-market-logo-header-tight.png" alt="Engines Market" width="3919" height="763">';
    return logo;
  }

  function makeGroupKey(scope, menuId, title) {
    return [scope, menuId, title].join("::");
  }

  function getExpanded(scope, menuId, title) {
    return Boolean(state.expandedGroups[makeGroupKey(scope, menuId, title)]);
  }

  function setExpanded(scope, menuId, title, value) {
    state.expandedGroups[makeGroupKey(scope, menuId, title)] = value;
  }

  function getQuery(scope, menuId) {
    const bag = scope === "desktop" ? state.desktopQueries : state.mobileQueries;
    return bag[menuId] || "";
  }

  function setQuery(scope, menuId, value) {
    const bag = scope === "desktop" ? state.desktopQueries : state.mobileQueries;
    bag[menuId] = value;
  }

  function closeDesktopMenu() {
    state.openMenuId = null;
    renderDesktopPanel();
  }

  function closeMobileMenu() {
    state.mobileOpen = false;
    state.mobileStack = [{ type: "root" }];
    renderMobilePanel();
    if (refs.header) refs.header.removeAttribute("data-mobile-open");
  }

  function getMenu(menuId) {
    return state.navMenus.find((menu) => menu.id === menuId) || null;
  }

  function getFooterColumns() {
    return state.footerNavigation || [];
  }

  function ensureCanonicalLink() {
    const normalizedPath =
      window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/+$/, "");
    const canonicalHref =
      normalizedPath === "/" ? SITE_URL + "/" : SITE_URL + normalizedPath;
    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalHref);
  }

  function buildBrandsPanel(menu) {
    const panel = createElement("div", "em-static-panel em-static-panel--brands");
    const visibleBrands = menu.brands;

    if (!state.activeBrandHref || !menu.brands.some((brand) => brand.href === state.activeBrandHref)) {
      state.activeBrandHref = visibleBrands[0] ? visibleBrands[0].href : "";
    }

    const activeBrand = menu.brands.find((brand) => brand.href === state.activeBrandHref) || visibleBrands[0];
    const grid = createElement("div", "em-static-brand-grid");

    visibleBrands.forEach((brand) => {
      const item = createElement("div", "em-static-brand-item");
      if (activeBrand && activeBrand.href === brand.href) item.setAttribute("data-active", "true");

      item.addEventListener("mouseenter", () => {
        state.activeBrandHref = brand.href;
        renderDesktopPanel();
      });

      const label = createLink(brand.label, brand.href, "em-static-brand-link");
      label.addEventListener("focus", () => {
        state.activeBrandHref = brand.href;
        renderDesktopPanel();
      });
      label.addEventListener("click", closeDesktopMenu);

      const arrow = createElement("span", "em-static-brand-caret", ">");
      arrow.setAttribute("aria-hidden", "true");

      item.appendChild(label);
      item.appendChild(arrow);
      grid.appendChild(item);
    });

    const detail = createElement("div", "em-static-brand-detail");
    if (activeBrand) {
      const overview = createLink(activeBrand.label + " Overview", activeBrand.href, "em-static-panel-muted-link");
      overview.addEventListener("click", closeDesktopMenu);
      detail.appendChild(overview);

      const columns = createElement(
        "div",
        activeBrand.models && activeBrand.models.length && activeBrand.variants && activeBrand.variants.length
          ? "em-static-brand-columns em-static-brand-columns--two"
          : "em-static-brand-columns",
      );

      if (activeBrand.models && activeBrand.models.length) {
        columns.appendChild(
          buildLinkListBlock("Models (" + activeBrand.models.length + ")", activeBrand.models, "desktop"),
        );
      }

      if (activeBrand.variants && activeBrand.variants.length) {
        columns.appendChild(
          buildLinkListBlock("Variants (" + activeBrand.variants.length + ")", activeBrand.variants, "desktop"),
        );
      }

      if ((!activeBrand.models || !activeBrand.models.length) && (!activeBrand.variants || !activeBrand.variants.length)) {
        detail.appendChild(createElement("p", "em-static-panel-empty", "No model or variant pages listed yet."));
      } else {
        detail.appendChild(columns);
      }
    }

    panel.appendChild(grid);
    panel.appendChild(detail);

    if (menu.footerLink) {
      const footer = createElement("div", "em-static-panel-footer");
      if (menu.footerLink) {
        const link = createLink(menu.footerLink.label, menu.footerLink.href, "em-static-panel-muted-link");
        link.addEventListener("click", closeDesktopMenu);
        footer.appendChild(link);
      }
      panel.appendChild(footer);
    }

    return panel;
  }

  function buildLinkListBlock(title, links, scope, menuId) {
    const block = createElement("div", "em-static-panel-group");
    const heading = createElement("p", "em-static-panel-group-title", title);
    const list = createElement("ul", "em-static-panel-list");

    (links || []).forEach((item) => {
      const row = createElement("li");
      const link = createLink(item.label, item.href, "em-static-panel-link");
      link.addEventListener("click", scope === "desktop" ? closeDesktopMenu : closeMobileMenu);
      row.appendChild(link);
      list.appendChild(row);
    });

    block.appendChild(heading);
    block.appendChild(list);

    if (menuId && links && links.length > DESKTOP_PREVIEW_COUNT) {
      block.setAttribute("data-menu-id", menuId);
    }

    return block;
  }

  function buildColumnsPanel(menu, scope) {
    const panel = createElement("div", "em-static-panel");
    const gridClass =
      menu.groups.length >= 4
        ? "em-static-panel-grid em-static-panel-grid--4"
        : "em-static-panel-grid em-static-panel-grid--3";
    const grid = createElement("div", gridClass);

    menu.groups.forEach((group) => {
      const block = createElement("div", "em-static-panel-group");
      const heading = createElement("p", "em-static-panel-group-title", group.title);
      block.appendChild(heading);

      const links = group.links || [];
      const expanded = getExpanded(scope, menu.id, group.title);
      const canExpand = links.length > DESKTOP_PREVIEW_COUNT;
      const visibleLinks = expanded || !canExpand ? links : links.slice(0, DESKTOP_PREVIEW_COUNT);
      const list = createElement("ul", "em-static-panel-list");

      visibleLinks.forEach((item) => {
        const row = createElement("li");
        const link = createLink(item.label, item.href, "em-static-panel-link");
        link.addEventListener("click", scope === "desktop" ? closeDesktopMenu : closeMobileMenu);
        row.appendChild(link);
        list.appendChild(row);
      });

      block.appendChild(list);

      if (canExpand) {
        const button = createElement(
          "button",
          "em-static-panel-muted-link em-static-panel-button",
          expanded ? "Show less" : "View all (" + links.length + ")",
        );
        button.type = "button";
        button.addEventListener("click", () => {
          setExpanded(scope, menu.id, group.title, !expanded);
          scope === "desktop" ? renderDesktopPanel() : renderMobilePanel();
        });
        block.appendChild(button);
      } else if (group.viewAll) {
        const viewAll = createLink(group.viewAll.label, group.viewAll.href, "em-static-panel-muted-link");
        viewAll.addEventListener("click", scope === "desktop" ? closeDesktopMenu : closeMobileMenu);
        block.appendChild(viewAll);
      }

      grid.appendChild(block);
    });

    panel.appendChild(grid);
    return panel;
  }

  function buildEnginesPanel(menu, scope) {
    const panel = createElement("div", "em-static-panel");
    const query = getQuery(scope, menu.id).trim().toLowerCase();
    const field = createElement("label", "em-static-panel-search");
    const input = createElement("input", "em-static-panel-search-input");
    input.type = "search";
    input.placeholder = "Search engines...";
    input.value = getQuery(scope, menu.id);
    input.addEventListener("input", (event) => {
      setQuery(scope, menu.id, event.target.value);
      scope === "desktop" ? renderDesktopPanel() : renderMobilePanel();
    });
    field.appendChild(input);
    panel.appendChild(field);

    const filteredGroups = query
      ? menu.groups
          .map((group) => ({
            title: group.title,
            links: (group.links || []).filter(
              (link) => link.label.toLowerCase().includes(query) || link.href.toLowerCase().includes(query),
            ),
          }))
          .filter((group) => group.links.length)
      : menu.groups;

    if (!filteredGroups.length) {
      panel.appendChild(createElement("p", "em-static-panel-empty", "No engines match."));
      return panel;
    }

    const grid = createElement("div", "em-static-panel-grid em-static-panel-grid--4");
    filteredGroups.forEach((group) => {
      const block = createElement("div", "em-static-panel-group");
      const heading = createElement("p", "em-static-panel-group-title", group.title + " (" + group.links.length + ")");
      block.appendChild(heading);

      const searching = Boolean(query);
      const expanded = getExpanded(scope, menu.id, group.title);
      const canExpand = !searching && group.links.length > DESKTOP_PREVIEW_COUNT;
      const visibleLinks = searching || expanded || !canExpand ? group.links : group.links.slice(0, DESKTOP_PREVIEW_COUNT);
      const list = createElement("ul", "em-static-panel-list");

      visibleLinks.forEach((item) => {
        const row = createElement("li");
        const link = createLink(item.label, item.href, "em-static-panel-link");
        link.addEventListener("click", scope === "desktop" ? closeDesktopMenu : closeMobileMenu);
        row.appendChild(link);
        list.appendChild(row);
      });

      block.appendChild(list);

      if (canExpand) {
        const button = createElement(
          "button",
          "em-static-panel-muted-link em-static-panel-button",
          expanded ? "Show less" : "View all (" + group.links.length + ")",
        );
        button.type = "button";
        button.addEventListener("click", () => {
          setExpanded(scope, menu.id, group.title, !expanded);
          scope === "desktop" ? renderDesktopPanel() : renderMobilePanel();
        });
        block.appendChild(button);
      }

      grid.appendChild(block);
    });

    panel.appendChild(grid);
    return panel;
  }

  function renderDesktopNav() {
    if (!refs.desktopNav) return;
    refs.desktopNav.textContent = "";

    state.navMenus.forEach((menu) => {
      const item = createElement("div", "em-static-nav__item");
      const button = createElement("button", "em-static-nav__trigger");
      button.type = "button";
      button.setAttribute("aria-expanded", state.openMenuId === menu.id ? "true" : "false");
      button.innerHTML = '<span>' + menu.label + '</span><span class="em-static-nav__chevron" aria-hidden="true">v</span>';
      button.addEventListener("click", () => {
        state.openMenuId = state.openMenuId === menu.id ? null : menu.id;
        if (menu.id === "brands" && !state.activeBrandHref && menu.brands && menu.brands[0]) {
          state.activeBrandHref = menu.brands[0].href;
        }
        renderDesktopPanel();
        renderDesktopNav();
      });
      item.appendChild(button);
      refs.desktopNav.appendChild(item);
    });
  }

  function renderDesktopPanel() {
    if (!refs.desktopPanel) return;
    refs.desktopPanel.textContent = "";

    const openMenu = state.navMenus.find((menu) => menu.id === state.openMenuId);
    if (!openMenu) {
      refs.desktopPanel.removeAttribute("data-open");
      return;
    }

    refs.desktopPanel.setAttribute("data-open", "true");

    if (openMenu.kind === "brands") {
      refs.desktopPanel.appendChild(buildBrandsPanel(openMenu));
      return;
    }

    if (openMenu.kind === "engines") {
      refs.desktopPanel.appendChild(buildEnginesPanel(openMenu, "desktop"));
      return;
    }

    refs.desktopPanel.appendChild(buildColumnsPanel(openMenu, "desktop"));
  }

  function renderMobileRoot(container) {
    const list = createElement("ul", "em-static-mobile-root");

    state.navMenus.forEach((menu) => {
      const row = createElement("li", "em-static-mobile-card");
      const button = createElement("button", "em-static-mobile-nav-button");
      button.type = "button";
      button.innerHTML = '<span>' + menu.label + '</span><span class="em-static-mobile-chevron" aria-hidden="true">></span>';
      button.addEventListener("click", () => {
        state.mobileStack.push({ type: "menu", menuId: menu.id });
        renderMobilePanel();
      });
      row.appendChild(button);
      list.appendChild(row);
    });

    container.appendChild(list);
  }

  function renderMobileBrands(container, menu) {
    const box = createElement("div", "em-static-mobile-box");
    const back = createElement("button", "em-static-mobile-back", "< " + menu.label);
    back.type = "button";
    back.addEventListener("click", () => {
      state.mobileStack.pop();
      renderMobilePanel();
    });
    box.appendChild(back);

    menu.brands.forEach((brand) => {
      const row = createElement("div", "em-static-mobile-brand-row");
      const link = createLink(brand.label, brand.href, "em-static-mobile-brand-link");
      link.addEventListener("click", closeMobileMenu);
      row.appendChild(link);

      const button = createElement("button", "em-static-mobile-brand-button", ">");
      button.type = "button";
      button.setAttribute("aria-label", "Open " + brand.label + " models and variants");
      button.addEventListener("click", () => {
        state.mobileStack.push({ type: "brand", menuId: menu.id, brandHref: brand.href });
        renderMobilePanel();
      });
      row.appendChild(button);
      box.appendChild(row);
    });

    if (menu.footerLink) {
      const footerLink = createLink(menu.footerLink.label, menu.footerLink.href, "em-static-mobile-footer-link");
      footerLink.addEventListener("click", closeMobileMenu);
      box.appendChild(footerLink);
    }

    container.appendChild(box);
  }

  function renderMobileBrandDetail(container, menu, frame) {
    const brand = menu.brands.find((item) => item.href === frame.brandHref);
    if (!brand) return;

    const box = createElement("div", "em-static-mobile-box");
    const back = createElement("button", "em-static-mobile-back", "< " + brand.label);
    back.type = "button";
    back.addEventListener("click", () => {
      state.mobileStack.pop();
      renderMobilePanel();
    });
    box.appendChild(back);

    const overview = createLink(brand.label + " Overview", brand.href, "em-static-mobile-footer-link");
    overview.addEventListener("click", closeMobileMenu);
    box.appendChild(overview);

    if (brand.models && brand.models.length) {
      box.appendChild(buildLinkListBlock("Models (" + brand.models.length + ")", brand.models, "mobile"));
    }

    if (brand.variants && brand.variants.length) {
      box.appendChild(buildLinkListBlock("Variants (" + brand.variants.length + ")", brand.variants, "mobile"));
    }

    if ((!brand.models || !brand.models.length) && (!brand.variants || !brand.variants.length)) {
      box.appendChild(createElement("p", "em-static-panel-empty", "No model or variant pages listed yet."));
    }

    container.appendChild(box);
  }

  function renderMobilePanel() {
    if (!refs.mobilePanel || !refs.header) return;
    refs.mobilePanel.textContent = "";
    refs.header.setAttribute("data-mobile-open", state.mobileOpen ? "true" : "false");

    if (!state.mobileOpen) return;

    const frame = state.mobileStack[state.mobileStack.length - 1];
    const container = createElement("div", "em-static-mobile-shell");

    if (frame.type === "root") {
      renderMobileRoot(container);
      refs.mobilePanel.appendChild(container);
      return;
    }

    const menu = getMenu(frame.menuId);
    if (!menu) return;

    if (frame.type === "menu" && menu.kind === "brands") {
      renderMobileBrands(container, menu);
      refs.mobilePanel.appendChild(container);
      return;
    }

    if (frame.type === "brand" && menu.kind === "brands") {
      renderMobileBrandDetail(container, menu, frame);
      refs.mobilePanel.appendChild(container);
      return;
    }

    const box = createElement("div", "em-static-mobile-box");
    const back = createElement("button", "em-static-mobile-back", "< " + menu.label);
    back.type = "button";
    back.addEventListener("click", () => {
      state.mobileStack.pop();
      renderMobilePanel();
    });
    box.appendChild(back);

    if (menu.kind === "engines") {
      box.appendChild(buildEnginesPanel(menu, "mobile"));
    } else {
      box.appendChild(buildColumnsPanel(menu, "mobile"));
    }

    container.appendChild(box);
    refs.mobilePanel.appendChild(container);
  }

  function renderFooter() {
    if (!refs.footer) return;
    refs.footer.textContent = "";

    const inner = createElement("div", "em-static-footer__inner");

    const brand = createElement("div", "em-static-footer__brand");
    brand.appendChild(createLogo());
    brand.appendChild(
      createElement(
        "p",
        "",
        "Compare replacement, used and reconditioned engine options from trusted UK specialists.",
      ),
    );

    const contact = createElement("div", "em-static-footer__contact");
    contact.appendChild(createLink("Call " + CALL_NUMBER_DISPLAY, CALL_NUMBER_TEL));
    contact.appendChild(createLink("WhatsApp 07311 343662", WHATSAPP_URL));
    contact.appendChild(createLink("Get a quote", "/get-a-quote"));
    brand.appendChild(contact);
    inner.appendChild(brand);

    const desktopNav = createElement("nav", "em-static-footer__desktop-nav");
    desktopNav.setAttribute("aria-label", "Footer navigation");
    const mobileNav = createElement("nav", "em-static-footer__mobile-nav");
    mobileNav.setAttribute("aria-label", "Footer navigation");

    getFooterColumns().forEach((column) => {
      const desktopBlock = createElement("div");
      const heading = createElement("h2", "", column.label || column.title);
      const list = createElement("ul");
      (column.links || []).forEach((item) => {
        const row = createElement("li");
        row.appendChild(createLink(item.label, item.href));
        list.appendChild(row);
      });

      desktopBlock.appendChild(heading);
      desktopBlock.appendChild(list);
      desktopNav.appendChild(desktopBlock);

      const details = createElement("details", "em-static-footer__mobile-group");
      const summary = createElement("summary", "em-static-footer__mobile-summary");
      summary.appendChild(createElement("span", "", column.label || column.title));
      summary.appendChild(createElement("span", "em-static-footer__mobile-chevron", "v"));
      details.appendChild(summary);

      const mobilePanel = createElement("div", "em-static-footer__mobile-panel");
      const mobileList = createElement("ul", "em-static-footer__mobile-list");
      (column.links || []).forEach((item) => {
        const row = createElement("li");
        row.appendChild(createLink(item.label, item.href));
        mobileList.appendChild(row);
      });
      mobilePanel.appendChild(mobileList);
      details.appendChild(mobilePanel);
      mobileNav.appendChild(details);
    });

    inner.appendChild(desktopNav);
    inner.appendChild(mobileNav);
    refs.footer.appendChild(inner);

    const bottom = createElement(
      "div",
      "em-static-footer__bottom",
      "Copyright " + new Date().getFullYear() + " Engines Market. All rights reserved.",
    );
    refs.footer.appendChild(bottom);
  }

  function createHeader() {
    const header = createElement("header", "em-static-header");
    const inner = createElement("div", "em-static-header__inner");

    inner.appendChild(createLogo());

    refs.desktopNav = createElement("nav", "em-static-nav");
    refs.desktopNav.setAttribute("aria-label", "Primary navigation");
    inner.appendChild(refs.desktopNav);

    const actions = createElement("div", "em-static-actions");
    actions.appendChild(createLink(CALL_NUMBER_DISPLAY, CALL_NUMBER_TEL));
    const whatsapp = createLink("WhatsApp", WHATSAPP_URL, "em-static-whatsapp");
    whatsapp.target = "_blank";
    whatsapp.rel = "noreferrer";
    actions.appendChild(whatsapp);
    actions.appendChild(createLink("Get Quote", "/get-a-quote", "em-static-quote"));
    inner.appendChild(actions);

    const menuButton = createElement("button", "em-static-menu");
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.innerHTML = '<span class="em-static-menu__icon" aria-hidden="true">|||</span>';
    menuButton.addEventListener("click", () => {
      state.mobileOpen = !state.mobileOpen;
      if (!state.mobileOpen) state.mobileStack = [{ type: "root" }];
      renderMobilePanel();
    });
    inner.appendChild(menuButton);

    refs.desktopPanel = createElement("div", "em-static-desktop-panel");
    refs.mobilePanel = createElement("div", "em-static-mobile-panel");

    header.appendChild(inner);
    header.appendChild(refs.desktopPanel);
    header.appendChild(refs.mobilePanel);
    refs.header = header;
    return header;
  }

  function createFooter() {
    refs.footer = createElement("footer", "em-static-footer");
    return refs.footer;
  }

  async function loadNavData() {
    const response = await fetch("/api/static-nav", { credentials: "same-origin" });
    if (!response.ok) throw new Error("Failed to load static nav data.");
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.navMenus)) throw new Error("Invalid static nav payload.");
    return payload;
  }

  function bindGlobalEvents() {
    document.addEventListener("pointerdown", (event) => {
      if (refs.header && !refs.header.contains(event.target)) {
        closeDesktopMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDesktopMenu();
        if (state.mobileOpen) closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && state.mobileOpen) {
        closeMobileMenu();
      }
    });
  }

  async function init() {
    if (document.querySelector(".em-static-header")) return;

    document.body.insertBefore(createHeader(), document.body.firstChild);
    document.body.appendChild(createFooter());
    bindGlobalEvents();
    ensureCanonicalLink();

    try {
      const payload = await loadNavData();
      state.navMenus = payload.navMenus;
      state.footerNavigation = Array.isArray(payload.footerNavigation) ? payload.footerNavigation : [];
    } catch (error) {
      console.error(error);
      return;
    }

    renderDesktopNav();
    renderDesktopPanel();
    renderMobilePanel();
    renderFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
