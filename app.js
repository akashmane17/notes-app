const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = document.querySelector("#popup-title"),
  closeIcon = document.querySelector("#close-icon"),
  titleTag = document.querySelector("#title"),
  descTag = document.querySelector("#description"),
  addBtn = document.querySelector("#add-btn");

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


// getting localStorage notes if exist and parsing them to js object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

// to open the popup of add note
addBox.addEventListener("click", () => {
  // show class is added to popup due to which it'll get visible
  titleTag.focus();
  popupBox.classList.add("show");
});

// to close the popup of addnote
closeIcon.addEventListener("click", () => {
  // removes show class due to which popup disappers
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add a new Note";
  popupBox.classList.remove("show");
});

function showNotes() {
  document.querySelectorAll(".note").forEach(note => note.remove());
  notes.forEach((note, index) => {
    let liTag = `
    <li class="note">
      <div class="details">
        <p>${note.title}</p>
        <span>${note.description}</span>
      </div>
      <div class="bottom-content">
        <span>${note.date}</span>
        <div class="settings">
          <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
          <ul class="menu">
            <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
            <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
          </ul>
        </div>
      </div>
    </li>`;

    addBox.insertAdjacentHTML("afterend", liTag);
  });


}
showNotes();

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?")
  if(!confirmDel) return;
  
  notes.splice(noteId, 1);// removing selected note from array'
  // saving updated notes to localstorage
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, desc) {
  isUpdate = true;
  updateId = noteId;
  addBox.click();
  titleTag.value = title;
  descTag.value = desc;
  addBtn.innerText = "Update Note";
  popupTitle.innerText = "Update a Note";
  console.log(noteId, title, desc);
}

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if(e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  })
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked");
  let noteTitle = titleTag.value;
  let noteDesc = descTag.value;

  if (noteTitle.trim() || noteDesc.trim()) {
    // getting month, day, year from current date object
    let dateObj = new Date(),
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear();

    //creating obj of title desc and date
    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day}, ${year}`
    };

    if(!isUpdate){
      notes.push(noteInfo); //adding new note to notes
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo; // updating specified note
    }
    
    // saving notes to local storage
    // also converting object to string before storing
    localStorage.setItem("notes", JSON.stringify(notes));
    //close add note popup after adding note
    closeIcon.click();
    showNotes();
  }

});