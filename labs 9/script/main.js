const cityMap = {
  ukraine: ["Київ", "Львів", "Одеса", "Харків", "Дніпро"],
  poland: ["Варшава", "Краків", "Гданськ", "Познань"],
  germany: ["Берлін", "Мюнхен", "Гамбург", "Кельн"]
};

const messages = {
  required: "Поле обов'язкове для заповнення.",
  nameLength: "Поле повинно містити від 3 до 15 символів.",
  email: "Введіть електронну пошту у форматі ivan@example.com.",
  password: "Пароль повинен містити не менше 6 символів.",
  confirmPassword: "Паролі повинні збігатися.",
  phone: "Номер має бути у форматі +380XXXXXXXXX.",
  age: "Користувач має бути старше 12 років, дата не може бути в майбутньому.",
  requiredRadio: "Оберіть один із варіантів."
};

const validators = {
  required(value) {
    return value.trim() !== "";
  },
  nameLength(value) {
    const length = value.trim().length;
    return length >= 3 && length <= 15;
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  },
  password(value) {
    return value.length >= 6;
  },
  confirmPassword(value, input) {
    const password = input.form.elements.password;
    return password && value === password.value && value !== "";
  },
  phone(value) {
    return /^\+380\d{9}$/.test(value.trim());
  },
  age(value) {
    if (!value) return false;

    const birthDate = new Date(`${value}T00:00:00`);
    const today = new Date();

    if (birthDate > today) return false;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return age >= 12;
  },
  requiredRadio(value, input) {
    return Boolean(input.form.querySelector(`input[name="${input.name}"]:checked`));
  }
};

const statusPanel = document.querySelector("#statusPanel");
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form");
const registerForm = document.querySelector("#registerForm");
const countrySelect = registerForm.elements.country;
const citySelect = registerForm.elements.city;

function setStatus(text, type = "") {
  statusPanel.textContent = text;
  statusPanel.className = `status-panel ${type}`.trim();
}

function getField(input) {
  return input.closest(".field") || input.closest(".radios");
}

function setFieldState(input, isValid, message = "") {
  const field = getField(input);
  const error = field.querySelector(".error");

  field.classList.toggle("valid", isValid);
  field.classList.toggle("invalid", !isValid);
  error.textContent = message;
}

function validateInput(input) {
  const rules = (input.dataset.rules || "").split(" ").filter(Boolean);
  const value = input.value;

  for (const rule of rules) {
    if (!validators[rule](value, input)) {
      setFieldState(input, false, messages[rule]);
      return false;
    }
  }

  setFieldState(input, true);
  return true;
}

function validateForm(form) {
  const inputs = form.querySelectorAll("[data-rules]");
  const results = Array.from(inputs).map(validateInput);
  return results.every(Boolean);
}

function resetFormState(form) {
  form.querySelectorAll(".field, .radios").forEach((field) => {
    field.classList.remove("valid", "invalid");
    const error = field.querySelector(".error");
    if (error) error.textContent = "";
  });
}

function updateCities() {
  const country = countrySelect.value;
  const cities = cityMap[country] || [];

  citySelect.innerHTML = "";

  if (!cities.length) {
    citySelect.disabled = true;
    citySelect.insertAdjacentHTML("beforeend", '<option value="">Спочатку оберіть країну</option>');
    return;
  }

  citySelect.disabled = false;
  citySelect.insertAdjacentHTML("beforeend", '<option value="">Оберіть місто</option>');
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.toLowerCase();
    option.textContent = city;
    citySelect.append(option);
  });
}

function activateForm(tab) {
  const targetId = tab.getAttribute("aria-controls");

  tabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  forms.forEach((form) => {
    const isActive = form.id === targetId;
    form.classList.toggle("is-active", isActive);
    form.hidden = !isActive;
  });

  setStatus("Заповніть форму та натисніть кнопку відправлення.");
}

function serializeForm(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const isValid = validateForm(form);

  if (!isValid) {
    setStatus("Перевірте поля з помилками та спробуйте ще раз.", "error");
    return;
  }

  const data = serializeForm(form);
  console.log("FormData:", data);

  const successText = form.id === "registerForm"
    ? "Користувача успішно зареєстровано."
    : "Авторизацію успішно виконано.";

  setStatus(successText, "success");
  form.reset();

  if (form.id === "registerForm") {
    updateCities();
  }

  resetFormState(form);
}

function togglePassword(button) {
  const input = button.parentElement.querySelector("input");
  const isPassword = input.type === "password";

  input.type = isPassword ? "text" : "password";
  button.classList.toggle("is-visible", isPassword);
  button.setAttribute("aria-label", isPassword ? "Приховати пароль" : "Показати пароль");
}

tabs.forEach((tab) => tab.addEventListener("click", () => activateForm(tab)));

forms.forEach((form) => {
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("input", (event) => {
    if (event.target.matches("[data-rules]")) {
      validateInput(event.target);

      if (event.target.name === "password") {
        validateInput(form.elements.confirmPassword);
      }
    }
  });
  form.addEventListener("change", (event) => {
    if (event.target.matches("[data-rules]")) {
      validateInput(event.target);
    }
  });
});

countrySelect.addEventListener("change", () => {
  updateCities();
  validateInput(countrySelect);
  validateInput(citySelect);
});

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => togglePassword(button));
});
