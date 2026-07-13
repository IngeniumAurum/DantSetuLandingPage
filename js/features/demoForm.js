// Demo request form: client-side validation with a friendly confirmation.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Read a field's trimmed value via the form controls collection.
// NOTE: never read controls as `form.<name>` — names like "name" collide
// with built-in HTMLFormElement properties (form.name is the form's own
// name attribute, not the <input>), so `form.name.value` is undefined and
// throws. `elements.namedItem` always resolves to the actual control.
function fieldValue(form, name) {
  const field = form.elements.namedItem(name);
  return field ? field.value.trim() : "";
}

export function init() {
  const form = document.getElementById("demoForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = fieldValue(form, "name");
    const email = fieldValue(form, "email");

    if (!name || !EMAIL_RE.test(email)) {
      note.textContent = "Please add your name and a valid work email.";
      note.className = "form__note err";
      return;
    }

    note.textContent = `Thanks, ${name.split(" ")[0]}! We'll reach out to book your demo.`;
    note.className = "form__note ok";
    form.reset();
  });
}
