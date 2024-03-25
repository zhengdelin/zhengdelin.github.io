// 興趣的 value 和 label 對應關係
const interestsObject = {
  reading: "閱讀",
  music: "音樂",
  sports: "運動",
  traveling: "旅遊",
};

// 學制的 value 和 label 對應關係
const educationObject = {
  五專: "五專",
  二技: "二技",
  四技: "四技",
};

// 性別的 value 和 label 對應關係
const genderObject = {
  male: "男",
  female: "女",
  other: "其他",
};

// 專業的 value 和 label 對應關係
const professionsObject = {
  it: "資訊科技",
  engineering: "工程學",
  business: "商業",
  arts: "藝術",
};

const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 防止表單提交到預設的動作

  // 獲取姓名
  const name = form.querySelector("#name").value;

  // 獲取興趣
  const interestsSelect = form.querySelector("#interests");
  const interests = Array.from(interestsSelect.selectedOptions).map((option) => option.value);

  // 獲取學制
  const education = form.querySelector("#education").value;

  // 獲取性別
  const gender = form.querySelector("input[name='gender']:checked").value;

  // 獲取專業
  const professions = Array.from(form.querySelectorAll("input[name='profession[]']:checked")).map((checkbox) => checkbox.value);

  // 在這裡你可以對獲取的值進行任何你需要的處理，比如顯示在控制台或發送到後端

  // 範例：將獲取的值顯示在控制台
  console.log("姓名:", name);
  console.log("興趣:", interests);
  console.log("學制:", education);
  console.log("性別:", gender);
  console.log("專業:", professions);

  showResult({ name, interests, education, gender, professions });
});

function showResult({ name, interests, education, gender, professions }) {
  const resultContainer = document.querySelector(".result");
  resultContainer.innerHTML = "";

  function createItem(label, value) {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <div class="label">${label}</div>
      <div class="value">${value}</div>
    `;
    resultContainer.appendChild(div);
  }
  createItem("姓名", name);
  createItem("興趣", interests.map((interest) => interestsObject[interest]).join(", "));
  createItem("學制", educationObject[education]);
  createItem("性別", genderObject[gender]);
  createItem("專業", professions.map((profession) => professionsObject[profession]).join(", "));
}
