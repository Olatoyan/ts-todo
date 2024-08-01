const header: HTMLElement = document.querySelector(".header")!;
const darkMode: HTMLElement = document.querySelector(".moon__icon")!;
const lightMode: HTMLElement = document.querySelector(".light__icon")!;
const body: HTMLElement = document.querySelector("body")!;
const inputBox: HTMLElement = document.querySelector(".input__box")!;
const todoInput: HTMLInputElement = document.querySelector(".todo__input")!;
const todoListBox: HTMLElement = document.querySelector(".todo__list-box")!;
const todoTextBox: HTMLElement = document.querySelector(".todo__text-box")!;
const itemsLeftNum: HTMLElement = document.querySelector(".items__left--num")!;
const summaryBox: HTMLElement = document.querySelector(".summary__box")!;
const summaryBox2: HTMLElement = document.querySelector(".todo__states")!;
const allStates: HTMLElement = document.querySelector(".all__states")!;
const activeStates: HTMLElement = document.querySelector(".active__states")!;
const completedStates: HTMLElement =
  document.querySelector(".completed__states")!;
const clearCompleted: HTMLElement =
  document.querySelector(".clear__completed")!;
const clickedStates: NodeListOf<HTMLElement> =
  document.querySelectorAll(".clicked__states")!;

let currentFilter = "all";

function updateTodoColors() {
  if (!todoTextBox) return;

  const todos = todoTextBox.querySelectorAll(".todo__text");
  const color =
    lightMode && lightMode.style.display === "none" ? "#25273c" : "#c8cbe7";

  todos.forEach((todo) => ((todo as HTMLElement).style.color = color));
}

function addToList(text: string) {
  if (!todoTextBox) return;

  const newTodoHTML = `
    <div class="todo__list">
      <div class="check__icon"></div>
      <p class="todo__text">${text}</p>
      <img src="images/icon-cross.svg" alt="remove icon" class="remove__icon" />
    </div>
  `;

  todoTextBox.insertAdjacentHTML("beforeend", newTodoHTML);

  const newTodoElement = todoTextBox.querySelector(".todo__list:last-child")!;

  if (
    currentFilter === "completed" &&
    !newTodoElement.querySelector(".checked__icon")
  ) {
    newTodoElement.classList.add("hidden");
  }

  updateItemsLeftCount();
}

function updateItemsLeftCount() {
  if (!itemsLeftNum) return;

  const remainingCount = document.querySelectorAll(
    ".check__icon:not(.checked__icon)"
  ).length;
  itemsLeftNum.textContent = remainingCount.toString();
}

function handleTodoClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const todoItem = target.closest(".todo__list");

  if (!todoItem) return;

  if (target.classList.contains("check__icon")) {
    target.classList.toggle("checked__icon");
    todoItem.querySelector(".todo__text")!.classList.toggle("checked__text");
    updateItemsLeftCount();
  }

  if (target.classList.contains("remove__icon")) {
    todoItem.remove();
    updateItemsLeftCount();
  }
}

function filterTodo(e: MouseEvent) {
  const target = e.target as HTMLElement;

  const clickedStates: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".all__states, .active__states, .completed__states, .clear__completed"
  );

  if (
    !target.classList.contains("clicked__states") &&
    !target.classList.contains("clear__completed")
  ) {
    clickedStates.forEach((state) => state.classList.remove("clicked__states"));
  }

  if (target.classList.contains("all__states")) {
    showAllTodos();
    target.classList.add("clicked__states");
    currentFilter = "all";
  } else if (target.classList.contains("active__states")) {
    showActiveTodos();
    target.classList.add("clicked__states");
    currentFilter = "active";
  } else if (target.classList.contains("completed__states")) {
    showCompletedTodos();
    target.classList.add("clicked__states");
    currentFilter = "completed";
  } else if (target.classList.contains("clear__completed")) {
    clearCompletedTodos();
  }
}

function showAllTodos() {
  document
    .querySelectorAll(".todo__list")
    .forEach((item) => item.classList.remove("hidden"));
}

function showActiveTodos() {
  document.querySelectorAll(".todo__list").forEach((item) => {
    item.classList.toggle(
      "hidden",
      item.querySelector(".checked__icon") !== null
    );
  });
}

function showCompletedTodos() {
  document.querySelectorAll(".todo__list").forEach((item) => {
    item.classList.toggle(
      "hidden",
      item.querySelector(".checked__icon") === null
    );
  });
}

function clearCompletedTodos() {
  document.querySelectorAll(".checked__icon").forEach((icon) => {
    icon.closest(".todo__list")!.remove();
  });
  updateItemsLeftCount();
}

function handleEnterKey(e: KeyboardEvent) {
  if (e.key === "Enter") {
    const value = todoInput.value.trim();
    if (!value) {
      todoInput!.style.border = "1px solid #ff0000";
      return;
    }
    todoInput!.style.border = "none";
    addToList(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
    todoInput!.value = "";
  }
}

function switchToLightMode() {
  if (lightMode && darkMode && body && inputBox && todoListBox && summaryBox) {
    lightMode.style.display = "none";
    darkMode.style.display = "block";
    body.style.backgroundColor = "#e4e5f1";
    body.style.color = "#161722";
    inputBox.style.backgroundColor = "#fafafa";
    todoListBox.style.backgroundColor = "#fafafa";
    updateTodoColors();
    header.style.backgroundImage = "url(images/bg-desktop-light.jpg)";
    summaryBox.style.color = "#25273c";
    summaryBox2.style.backgroundColor = "#fafafa";
    summaryBox.style.backgroundColor = "#fafafa";
    todoInput.style.color = "#161722";
  }
}

function switchToDarkMode() {
  if (lightMode && darkMode && body && inputBox && todoListBox && summaryBox) {
    lightMode.style.display = "block";
    darkMode.style.display = "none";
    body.style.backgroundColor = "#161722";
    body.style.color = "#fafafa";
    inputBox.style.backgroundColor = "#25273d";
    todoListBox.style.backgroundColor = "#25273d";
    updateTodoColors();
    header.style.backgroundImage = "url(images/bg-desktop-dark.jpg)";
    summaryBox.style.color = "#5b5e7e";
    summaryBox2.style.backgroundColor = "#25273d";
    summaryBox.style.backgroundColor = "#25273d";

    todoInput.style.color = "#fafafa";
  }
}

document.addEventListener("keypress", handleEnterKey);
summaryBox.addEventListener("click", filterTodo);
lightMode.addEventListener("click", switchToLightMode);
darkMode.addEventListener("click", switchToDarkMode);
todoTextBox.addEventListener("click", handleTodoClick);
