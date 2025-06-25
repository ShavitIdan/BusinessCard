const output = document.getElementById("output");
const input = document.getElementById("cmd");
const promptLabel = document.getElementById("prompt-label");
const commands = {
  help: "Available commands: about, cv, qr, image, card, contact, contactme, clear, help",

  about:
    "Hi, I'm Idan Shavit — a software engineering student with a passion for backend, cloud, and game dev.",
  card: `
+================================================+
|               USER SYSTEM PROFILE              |
+================================================+
| Name      : Idan Shavit                        |
| Title     : Software Engineering Student       |
| Email     : idan@example.com                   |
| Phone     : +972-50-1234567                    |
| LinkedIn  : linkedin.com/in/idanshavit         |
+================================================+
  `.trim(),

  cv: () =>
    showPopup(
      '<iframe src="https://idan-businesscard-assets.s3.eu-west-1.amazonaws.com/IdanShavitCV.pdf" width="100%" height="100%"></iframe>'
    ),

  qr: () =>
    showPopup(
      '<img src="https://idan-businesscard-assets.s3.eu-west-1.amazonaws.com/qr-code.png" alt="QR Code" style="max-width:100%; height:auto;" />'
    ),

  image: () =>
    showPopup(
      '<img src="assets/profile.jpg" alt="Profile Photo" style="max-width:100%; height:auto;" />'
    ),

  contactme: () => {
    contactFlow = {
      step: 0,
      questions: ["Name:", "Email:", "Message:", "Send now? (yes/no):"],
      answers: [],
    };
    promptLabel.textContent = "> "; 
    output.innerHTML +=
      "Starting contact sequence...\n" + contactFlow.questions[0] + "\n";
  },
  clear: () => (output.innerHTML = ""),

  sudo: "Nice try. You're not root.",
};

let contactFlow = null;

input.addEventListener("keydown", async function (e) {
  if (e.key === "Enter") {
    const cmdText = input.value.trim();
    input.value = "";

    // Handle contact flow
    if (contactFlow) {
      const currentStep = contactFlow.step;
      contactFlow.answers[currentStep] = cmdText;
      output.innerHTML += `> ${cmdText}\n`;
      contactFlow.step++;

      if (contactFlow.step < contactFlow.questions.length) {
        output.innerHTML += contactFlow.questions[contactFlow.step] + "\n";
      } else {
        if (confirm === "yes") {
          output.innerHTML += "Sending message...\n";

          try {
            const res = await fetch(
              "https://your-api-id.execute-api.region.amazonaws.com/contact",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: contactFlow.answers[0],
                  email: contactFlow.answers[1],
                  message: contactFlow.answers[2],
                }),
              }
            );

            const result = await res.json();
            if (res.ok) {
              output.innerHTML += "V Message sent successfully!\n";
            } else {
              output.innerHTML += `X Error: ${result.error}\n`;
            }
          } catch (err) {
            output.innerHTML += "X Failed to contact server.\n";
          }

          contactFlow = null;
          promptLabel.textContent = "C:\\Users\\Idan> ";
          return; 
        } else if (confirm === "no") {
          output.innerHTML += "X Contact cancelled.\n";
          contactFlow = null;
          promptLabel.textContent = "C:\\Users\\Idan> ";
          return; 
        }

        output.innerHTML += "Sending message...\n";

        try {
          const res = await fetch(
            "https://h8tljq5w07.execute-api.eu-west-1.amazonaws.com/default/BussinesCard",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: contactFlow.answers[0],
                email: contactFlow.answers[1],
                message: contactFlow.answers[2],
              }),
            }
          );

          const result = await res.json();
          if (res.ok) {
            output.innerHTML += "V Message sent successfully!\n";
          } else {
            output.innerHTML += `X Error: ${result.error}\n`;
          }
        } catch (err) {
          output.innerHTML += "X Failed to contact server.\n";
        }

        promptLabel.textContent = "C:\\Users\\Idan> ";
        contactFlow = null;
      }

      window.scrollTo(0, document.body.scrollHeight);
      return;
    }

    // Handle normal command
    if (!contactFlow) {
      output.innerHTML += `C:\\Users\\Idan> ${cmdText}\n`;
    } else {
      output.innerHTML += `> ${cmdText}\n`;
    }

    if (commands[cmdText]) {
      const result =
        typeof commands[cmdText] === "function"
          ? commands[cmdText]()
          : commands[cmdText];
      if (typeof result === "string") {
        output.innerHTML += result + "\n";
      }
    } else {
      output.innerHTML += `Command not found: ${cmdText}\n`;
    }

    window.scrollTo(0, document.body.scrollHeight);
  }
});

function showPopup(contentHTML) {
  const popup = document.getElementById("popup");
  const body = document.getElementById("popup-body");
  body.innerHTML = contentHTML;
  popup.classList.remove("hidden");
}

function hidePopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
}
