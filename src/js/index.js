import { $ } from "./utils/dom.js";
import MenuAPI from "./api/index.js";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: []
  }
  this.currentCategory = "espresso";
  this.init = async() => {
    render();
    initEventListener();
  }
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`
  }

  const addMenuName = async() => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    
    const duplicatedItem = this.menu[this.currentCategory].find(menuItem => 
      menuItem.name === $("#menu-name").value
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 등록해주세요");
      return;
    }
    
    const menuName = $("#menu-name").value;
    await MenuAPI.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  }

  const render = async () => {
    this.menu[this.currentCategory] =  await MenuAPI.getAllMenuByCategory(this.currentCategory);
    const template = this.menu[this.currentCategory].map((item) => {
      return `
      <li data-menu-Id=${item.id} class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>
      `
    }).join("");
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  }

  const updateMenuName = async (e) => {
    if (e.target.className.includes("menu-edit-button")) {
      const menuId = e.target.closest("li").dataset.menuId;
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedName = prompt("메뉴 이름을 수정해주세요!", $menuName.innerText);
      await MenuAPI.updateMenu(this.currentCategory, updatedName, menuId);
      render();
    }
  }

  const removeMenuName = async (e) => {
    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("삭제하시겠습니까?")) {
        const menuId = e.target.closest("li").dataset.menuId;
        await MenuAPI.deleteMenu(this.currentCategory, menuId);
        render();
      }
    }
  }

  const soldOutMenu = async (e) => {
    if (e.target.classList.contains("menu-sold-out-button")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuAPI.toggleSoldOutMenu(this.currentCategory, menuId);
      render();
    }
  }
  
  const changeCategory = async (e) => {
    if (e.target.classList.contains("cafe-category-name")) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  }
  const initEventListener = () => {
    $("nav")
      .addEventListener("click", changeCategory);
  
    $("#menu-list")
      .addEventListener("click", (e) => {
        updateMenuName(e);
        removeMenuName(e);
        soldOutMenu(e);
      })
  
    $("#menu-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
      })
  
    $("#menu-name")
      .addEventListener("keypress", (e) => {
        if (e.key !== "Enter") {
          return;
        }
        addMenuName();
      })
  
    $("#menu-submit-button")
      .addEventListener("click", addMenuName);
  
  }
}

const app = new App();
app.init();
