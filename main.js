//!ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//!htmlden gelen elemanlar
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

//!localStorage'dan notları al ve eğer yoksa boş dizi dönder
let notes = JSON.parse(localStorage.getItem("notes")) || [];
console.log(notes);
//!güncelleme için değişkenler
let isUpdate = false;
let updateId = null;
//!fonksiyonlar ve olay izleyicileri

//add boxa tıklanınca bir fonksiyon tetikle
addBox.addEventListener("click", () => {
  //popupBoxContainer ve popupBoxa bir class ekle
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  //arka plandaki sayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});
//closeBtn tıklayınca popupbox ve popupboxcontainera eklenen class kaldır yani popup kapan
closeBtn.addEventListener("click", () => {
  popupBox.classList.remove("show");
  popupBoxContainer.classList.remove("show");
  //arka plan kaydırmasını aktif et
  document.querySelector("body").style.overflow = "auto";
});
//menu kısmını ayarlayan fonksiyon
function showMenu(elem) {
  //parentElement bir elemanın kapsam elemanına erişmek için kullanılır.
  //tıklanılan elemanın kapsamına eriştikten sonra buna bir class ekledik
  elem.parentElement.classList.add("showing");
  //tıklanılan yer menu kısmı haricinde ise showing classını kaldır.
  document.addEventListener("click", (e) => {
    //tıklanılan kısım i etiketi değilse yada kapsam dışında ise showing classını kaldır.
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("showing");
    }
  });
}

//wrapper kısmındaki tıklanmaları izle
wrapper.addEventListener("click", (e) => {
  //eğer üç noktaya tıklanıldıysa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  //eğer sil ikonuna tıklandıysa
  else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediğinizden emin misiniz?");
    if (res) {
      //tıklanılan note elemanına eriş
      const note = e.target.closest(".note");
      //note id ye eriş
      const noteId = note.dataset.id;
      //notes dizisini dön ve id si noteIdye eşit olmayanı diziden kaldır.
      notes = notes.filter((note) => note.id != noteId);
      //localStorage güncelle
      localStorage.setItem("notes", JSON.stringify(notes));
      //render fonk çalıştır
      renderNotes();
    }
  }
  //eğer güncelle ikonuna tıklandıysa
  else if (e.target.classList.contains("updateIcon")) {
    //tıklanılan note elemanına eriş
    const note = e.target.closest(".note");
    //note elemananının id ye eriş
    const noteId = parseInt(note.dataset.id);
    //note dizisi içinden id si bilinen elemanı bul
    const foundedNote = notes.find((note) => note.id === noteId);
    //popup içindeki elemanlara note değerlerini ata

    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;
    //güncelleme modunu aktif et
    isUpdate = true;
    updateId = noteId;
    //popup aç
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");
    //popup içerisindeki gerekli alanları update e göre düzenle
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});

//forma olay izleyicisi ekle ve form içerisindeki verilere eriş

form.addEventListener("submit", (e) => {
  //form gönderildiğinde sayfa yenilemesini engelle
  e.preventDefault();
  //form gönderildiğinde form içerisindeki elemanlara eriş
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  //form elemanlarının içerisindeki değerlere eriş.trim boşluk kaldırıyor.
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();
  //eğer title ve description değeri yoksa uyarı var
  if (!title && !description) {
    alert(`Lütfen formdaki gerekli kısımları doldurunuz`);
  }
  //eğer title ve description varsa gerekli bilgileri oluştur
  const date = new Date();
  let id = new Date().getTime();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];
  //eğer güncelleme modundaysa
  // Eğer güncelleme modundaysa
  if (isUpdate) {
    // Güncelleme yapılacak elemanın dizi içerisindeki indexini bul
    const noteIndex = notes.findIndex((note) => {
      return note.id == updateId;
    });

    // Dizi içerisinde yukarıda bulunan index'deki elemanın değerlerini güncelle
    notes[noteIndex] = {
      title,
      description,
      id,
      date: `${month} ${day},${year}`,
    };
    // Güncelleme modunu kapat ve popup içerisindeki elemanları eskiye çevir
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    // Elde edilen verileri bir note objesi altında topla
    let noteInfo = {
      title,
      description,
      date: `${month} ${day},${year}`,
      id,
    };
    // noteInfo objesini notes dizisine ekle
    notes.push(noteInfo);
  }
  //notes dizisini localStorage a ekle
  localStorage.setItem(`notes`, JSON.stringify(notes));
  //form içerisindeki elemanları temizle
  titleInput.value = ``;
  descriptionInput.value = ``;
  //popup'ı kapat
  popupBox.classList.remove("show");
  popupBoxContainer.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
  //not eklendıkten sonra notları render et
  renderNotes();
});

//! localStorage daki verilere göre ekrana not kartları render eden fonksiyon
function renderNotes() {
  //eğer localStorage da not verisi yoksa fonksiyonu durdur.
  if (!notes) return;
  //önce mevcut notları kaldır.
  document.querySelectorAll(".note").forEach((li) => li.remove());
  //note dizisindeki her bir eleman için ekrana bir note kartı render et
  notes.forEach((note) => {
    //dataid yi elemanlara id vermek için kullandık
    let liTag = `<li class="note" data-id=${note.id}>
       
        <div class="details">
          <p class="title">${note.title} </p>
          <p class="description">${note.description}</p>
        </div>
        <div class="bottom-content">
          <span>${note.date} </span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='updateIcon'><i class="bx bx-edit"></i> Düzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;
    //insertAdjacentHTML metodu belirli bir ögeyi bir HTML elemanına göre sıralı şekilde eklemek için kullanılır bu metot hangi konuma ekleme yapılacak ve hangi eleman eklenecek bunu belirtmemizi ister.
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
//sayfa yüklendiğinde rendernotes fonksiyonunu çalıştır.
document.addEventListener("DOMContentLoaded", () => renderNotes());
