// ## 🎯 step2 요구사항 - 상태 관리로 메뉴 관리하기
// TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다
//    - [x] 데이터를 추가할 때
//    - [x] 데이터를 수정할 때
//    - [x] 데이터를 삭제할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 접근할 때 localStorage에 에스프레소 메뉴를 읽어 온다.
// - [x] 에스프레소 메뉴를 rendering한다.

// TODO 품절 상태 관리
// - [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
// - [x] 품절 버튼을 추가
// - [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [x] 클릭 이벤트에서 가장 가까운 li태그 클래서에 sold-out class 추가
// - [x] 품절 상태 메뉴의 마크업

import { $ } from "./utils/dom.js";
import store from "./store/index.js";


function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: []
  }
  this.currentCategory = "espresso";
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListener();
  }
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`
  }

  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
      const espressoMenuName = $("#menu-name").value;
      this.menu[this.currentCategory].push({ name : espressoMenuName });
      store.setLocalStorage(this.menu);
      render();
      $("#menu-name").value = "";
  }

  const render = () => {
    const template = this.menu[this.currentCategory].map((item, index) => {
      return `
      <li data-menu-Id=${index} class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${item.name}</span>
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

  const updateMenuName = (e) => {
    if (e.target.className.includes("menu-edit-button")) {
      const menuId = e.target.closest("li").dataset.menuId;
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedName = prompt("메뉴 이름을 수정해주세요!", $menuName.innerText);
      this.menu[this.currentCategory][menuId].name = updatedName;
      store.setLocalStorage(this.menu);
      render();
    }
  }

  const removeMenuName = (e) => {
    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("삭제하시겠습니까?")) {
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[this.currentCategory].splice(menuId, 1);
        store.setLocalStorage(this.menu);
        render();
      }
    }
  }

  const soldOutMenu = (e) => {
    if (e.target.classList.contains("menu-sold-out-button")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
      store.setLocalStorage(this.menu);
      render();
    }
  }

  const initEventListener = () => {
    $("nav")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("cafe-category-name")) {
          const categoryName = e.target.dataset.categoryName;
          this.currentCategory = categoryName;
          $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
          render();
        }
      })
  
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

/*
step1. 배운것

- 요구사항들중에서도 쪼개서 다시 요구사항을 확인한다. (최대한 나눠주고, 큰 카테고리로 나눠준다)

- 변수명 고민할 때
최대한 html페이지의 클래스명이나 힌트들을 최대한 활용
그래야 다른 사람들이 코드 읽을때도 자연스럽다

- 리팩토링
중복을 줄이고 가독성을 높히는 방향으로
기능끼리 모으기, 함수는 함수, 변수는 변수
변수, 함수이름은 통일성 있게, 동사도 통일시켜주기
수정하고 나서 기능이 정상 작동하는지 확인하기

특정 코드들이 재사용되지 않더라도 함수로 만들어 사용하면 좋은점은
코드를 전부 읽어보지 않고 함수명만으로도 그 부분에서 어떤 일을 하는지 알 수 있다.

내가 구현한 부분 말고는 다른 함수들은 접어두고 보면 전체적인 흐름, 그림을 보기 쉽다.

step2. 배운것
데이터는 정말 꼭 관리해야 될 것만 관리하기, 최소한의 것들만
아니면 코드가 복잡해질 수 있다.

데이터 상태 초기화 이유
어떤 데이터 형태가 들어오는지 협업할때 다른 사람한테 알려줄 수 있음

state 관리를 통해서 사용자와 인터랙션이 가능하고, 동적인 페이지를 만들 수 있다

리팩토링 하면서 기존의 값을 지우고 재사용하기 좋은 값으로 바꿔준다. (espresso => none)
리팩토링 통일성 네이밍이나 전체적인 흐름의 통일성 지키자

상태값 중요성! 적절히 배열로 객체로 만들어서 재사용쉽게 구성하자 그에 맞춰 렌더링
한 파일에 객체는 하나만
한 파일의 파일명이 내부에 선언된것을 대표하는 것이 좋기 때문에
*/


// ```js
// <li class="menu-list-item d-flex items-center py-2">
//   <span class="w-100 pl-2 menu-name sold-out">${name}</span>
//   <button
//     type="button"
//     class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
//   >
//     품절
//   </button>
//   <button
//     type="button"
//     class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
//   >
//     수정
//   </button>
//   <button
//     type="button"
//     class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
//   >
//     삭제
//   </button>
// </li>
// ```
