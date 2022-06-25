const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "books";
const STORAGE_KEY = "BOOK_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    clearForm();
  });

  const bookIsComplete = document.getElementById("inputBookIsComplete");
  const isRead = document.getElementById("isRead");
  isRead.innerText = "Belum selesai dibaca";

  bookIsComplete.addEventListener("click", function () {
    if (bookIsComplete.checked) {
      isRead.innerText = "Selesai dibaca";
    } else {
      isRead.innerText = "Belum selesai dibaca";
    }
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const addBook = () => {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = parseInt(document.getElementById("inputBookYear").value);
  const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const generateBookID = generateId();
  const book = generateBook(
    generateBookID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const clearForm = () => {
  const bookTitle = document.getElementById("inputBookTitle");
  const bookAuthor = document.getElementById("inputBookAuthor");
  const bookYear = document.getElementById("inputBookYear");
  const bookIsComplete = document.getElementById("inputBookIsComplete");

  bookTitle.value = "";
  bookAuthor.value = "";
  bookAuthor.value = "";
  bookYear.value = "";
  bookIsComplete.value = false;
};

const generateId = () => {
  return +new Date();
};

const generateBook = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const createBook = (book) => {
  const textTitle = document.createElement("h3");
  textTitle.innerText = book.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = book.author;

  const textYear = document.createElement("p");
  textYear.innerText = book.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${book.id}`);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const isNotCompletedButton = document.createElement("button");
  isNotCompletedButton.classList.add("success");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("danger");
  deleteButton.innerText = "Hapus buku";

  deleteButton.addEventListener("click", function () {
    removeBookFromRead(book.id);
  });

  if (book.isCompleted) {
    isNotCompletedButton.innerText = "Belum selesai";

    isNotCompletedButton.addEventListener("click", function () {
      undoBookFromRead(book.id);
    });

    buttonContainer.append(isNotCompletedButton, deleteButton);
    container.append(buttonContainer);
  } else {
    isNotCompletedButton.innerText = "Selesai dibaca";

    isNotCompletedButton.addEventListener("click", function () {
      addBookToRead(book.id);
    });

    buttonContainer.append(isNotCompletedButton, deleteButton);
    container.append(buttonContainer);
  }

  return container;
};

document.addEventListener(RENDER_EVENT, function () {
  const unreadBook = document.getElementById("incompleteBookshelfList");
  unreadBook.innerHTML = "";

  const readBook = document.getElementById("completeBookshelfList");
  readBook.innerHTML = "";

  for (const book of books) {
    const bookEl = createBook(book);
    if (!book.isCompleted) unreadBook.append(bookEl);
    else readBook.append(bookEl);
  }
});

const addBookToRead = (id) => {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findBook = (id) => {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
};

const removeBookFromRead = (id) => {
  const bookTarget = findBookIndex(id);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const undoBookFromRead = (id) => {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findBookIndex = (id) => {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }

  return -1;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const search = () => {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  for (i = 0; i < books.length; i++) {
    const inner = books[i].title;
    const bookIdElement = document.getElementById(`book-${books[i].id}`);

    if (inner.toLowerCase().indexOf(searchInput) > -1) {
      bookIdElement.style.display = "";
    } else {
      bookIdElement.style.display = "none";
    }
  }
};

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
}
