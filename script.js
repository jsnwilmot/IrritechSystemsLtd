(function () {
  var siteData = {
    siteCredit: {
      name: "Rose & Paw Digital Designs",
      url: "https://design.roseandpaw.ca",
      logo: "assets/img/brand/RPD_Logo.png"
    }
  };

  var siteCreditLink = document.querySelector("[data-site-credit-link]");
  var siteCreditLogo = document.querySelector("[data-site-credit-logo]");
  var siteCreditName = document.querySelector("[data-site-credit-name]");

  if (siteCreditLink && siteData.siteCredit) {
    siteCreditLink.href = siteData.siteCredit.url;
    siteCreditLink.setAttribute(
      "aria-label",
      "Website designed by " + siteData.siteCredit.name + " (opens in a new tab)"
    );
  }

  if (siteCreditLogo && siteData.siteCredit) {
    siteCreditLogo.src = siteData.siteCredit.logo;
  }

  if (siteCreditName && siteData.siteCredit) {
    siteCreditName.textContent = siteData.siteCredit.name;
  }

  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");
  var form = document.getElementById("quote-form");
  var status = document.getElementById("form-status");

  if (menuToggle && nav) {
    function closeMenu() {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }

    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A") {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  if (!form || !status) {
    return;
  }

  var fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"));

  function setInvalid(field, isInvalid) {
    var row = field.closest(".form-row");
    if (!row) {
      return;
    }

    row.classList.toggle("is-invalid", isInvalid);
    field.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    var error = row.querySelector(".field-error");
    if (error) {
      field.setAttribute("aria-describedby", isInvalid ? error.id : "");
    }
  }

  function isValidEmail(value) {
    return value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var invalidFields = [];

    fields.forEach(function (field) {
      var invalid = false;

      if (field.hasAttribute("required") && field.value.trim() === "") {
        invalid = true;
      }

      if (field.type === "email" && !isValidEmail(field.value.trim())) {
        invalid = true;
      }

      setInvalid(field, invalid);

      if (invalid) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length > 0) {
      status.textContent = "Please fix the highlighted fields before preparing the email.";
      status.classList.add("is-visible");
      invalidFields[0].focus();
      return;
    }

    var data = new FormData(form);
    var body = [
      "New Irritech quote request",
      "",
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone"),
      "Email: " + (data.get("email") || "Not provided"),
      "Service: " + data.get("service"),
      "Property address or area: " + data.get("address"),
      "",
      "Property details:",
      data.get("message")
    ].join("\n");

    var href = "mailto:irritechsprinklersltd@gmail.com"
      + "?subject=" + encodeURIComponent("Irritech quote request")
      + "&body=" + encodeURIComponent(body);

    status.textContent = "Opening an email draft with your request details.";
    status.classList.add("is-visible");
    window.location.href = href;
  });

  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      setInvalid(field, false);
    });
  });
})();
