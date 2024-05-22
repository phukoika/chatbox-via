document.addEventListener("DOMContentLoaded", (e) => {
  var dom = {
    frame: window.parent.document.getElementById("widget-frame"),
    widgetForm: document.getElementById("widget-chatbox"),
    widgetContent: document.querySelector(".widget-content"),
    widgetIcon: document.querySelector(".widget-icon"),
    widgetDefaultOpen: document.querySelector(".widget-default"),
    widgetDefaultClose: document.querySelector(".widget-close"),
    widgetIconClose: document.querySelector(".widget-icon-close"),
    widgetContainer: document.querySelector(".widget-container"),
    widgetMenu: document.querySelector(".chatbox"),
    sendBtn: document.getElementById("send-btn"),
    chatInput: document.querySelector(".chat-input textarea"),
    chatbox: document.querySelector(".chatbox"),
  };

  const setWidgetFormSize = function (state) {
    if (dom.frame) {
      if (state === 1) {
        dom.widgetForm.style.width = "75px";
        dom.widgetForm.style.height = "75px";
      } else {
        dom.frame.style.width = "420px";
        dom.frame.style.height = "480px";
        dom.widgetContent.style.height = "300px";
      }
    }
  };
  setWidgetFormSize(1);
  const createChatLiTag = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
      className === "outgoing"
        ? `<p></p>`
        : `<span><i class="fa-solid fa-robot"></i></span>
        <p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  };
  const generateResponse = (incomingChatLi) => {
    const API_URL =
      "http://localhost:5500/conversation/01e2fc5c-2c89-4ec7-8470-7688608b496c/f367b0f5-dad0-453f-a50e-4c4cadb3c5f5";
    const api_key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyMzdjZjhkOC0xYWZjLTQzOTQtOGEzMC02MjE3NGIxMzkwMDMiLCJ1bmlxdWVfbmFtZSI6InBodWtvaWthIiwiZW1haWwiOiJwaHVrb2lrYUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoicGh1IiwiZmFtaWx5X25hbWUiOiJrb2lrYSIsInNvdXJjZSI6ImludGVybmFsIiwiZXh0ZXJuYWxfaWQiOiIiLCJqdGkiOiJiY2Y1N2NhYi05NmIzLTQ2MmEtODgwYS0zMDc2NTVhZWQ5OTciLCJuYmYiOjE3MTYyODIyMTEsImV4cCI6MTcxNjI4OTQxMSwiaWF0IjoxNzE2MjgyMjExLCJpc3MiOiJib3RzaGFycCIsImF1ZCI6ImJvdHNoYXJwIn0.zlIu27rsFF1c79DxyLWLP3wDOG3IhJIFqWgwFgz0JUo";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model: "llama-2-7b-chat.Q3_K_S.gguf",
        temperature: 0,
        samplingFactor: 0,
        states: [],
        text: userMessage,
        channel: "openapi",
      }),
    };
    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        messageElement.textContent = data.text;
      })
      .catch((err) => {
        messageElement.textContent =
          "Oops! Something went wrong. Please try again";
      })
      .finally(() => {
        dom.chatbox.scrollTo(0, dom.chatbox.scrollHeight);
      });
  };
  const handleChat = () => {
    userMessage = dom.chatInput.value.trim();
    if (!userMessage) return;
    dom.chatInput.value = "";
    dom.chatbox.appendChild(createChatLiTag(userMessage, "outgoing"));
    dom.chatbox.scrollTo(0, dom.chatbox.scrollHeight);
    setTimeout(() => {
      const incomingChatLi = createChatLiTag("...", "incoming");
      dom.chatbox.appendChild(incomingChatLi);
      dom.chatbox.scrollTo(0, dom.chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);
  };
  // show popup
  dom.widgetDefaultOpen.addEventListener("click", () => {
    dom.widgetContent.classList.add("active");
    dom.widgetDefaultOpen.classList.add("hidden");
    dom.widgetDefaultClose.classList.add("active");
    dom.widgetIcon.classList.remove("effect-close");
    dom.widgetIcon.classList.add("effect-open");
    if (dom.frame) {
      dom.frame.style.width = "420px";
      dom.frame.style.height = "480px";
      dom.widgetContent.style.height = "300px";
    }
  });

  // hide popup
  dom.widgetDefaultClose.addEventListener("click", () => {
    dom.widgetContent.classList.remove("active");
    dom.widgetDefaultOpen.classList.remove("hidden");
    dom.widgetDefaultClose.classList.remove("active");
    dom.widgetIcon.classList.remove("effect-open");
    dom.widgetIcon.classList.add("effect-close");
    if (dom.frame) {
      dom.frame.style.width = "75px";
      dom.frame.style.height = "75px";
      dom.widgetContent.style.height = "75px";
    }
  });

  // hide popup when click close-icon in popup
  dom.widgetIconClose.addEventListener("click", () => {
    dom.widgetContent.classList.remove("active");
    dom.widgetDefaultOpen.classList.remove("hidden");
    dom.widgetDefaultClose.classList.remove("active");
    dom.widgetIcon.classList.remove("effect-open");
    dom.widgetIcon.classList.add("effect-close");
    if (dom.frame) {
      dom.frame.style.width = "75px";
      dom.frame.style.height = "75px";
      dom.widgetContent.style.height = "75px";
    }
  });

  //
  dom.sendBtn.addEventListener("click", handleChat);
});
