// step 1 요구 사항
// MENU 추가
// [x] 에스프레소 메뉴에 새로운 메뉴를 엔터키 입력으로 추가한다.
// [x] 에스프레소 메뉴에 새로운 메뉴를 확인키로 추가한다.
// [x] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// MENU 수정
// [x] 메뉴의 수정 버튼을 클릭하면, 메뉴 모달창이 떠서 메뉴 이름 수정할 수 있다.
// [x] 메뉴 수정시 브라우저에서 제공하는 `prompt` 인터페이스를 활용한다. 이름을 입력받고 확인으로 수정할 수 있다


// MENU 삭제
// [ ] 메뉴 삭제 버튼을 큻릭하면, 메뉴 삭제 모달창이 뜬다.
// [ ] 메뉴 삭제시 브라우저에서 제공하는 `confirm` 인터페이스를 활용한다. 확인 버튼 클릭시 삭제

const $ = (selector) => document.querySelector(selector);

function App() {
  const updateMenuCount = () => {
    const menuCount = document.querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`
  }

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
      const espressoMenuName = $("#espresso-menu-name").value;
      const menuItemTmeplate = (espressoMenuName) => {
        return `
        <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
      };
      $("#espresso-menu-list").insertAdjacentHTML(
        "beforeend", 
        menuItemTmeplate(espressoMenuName)
      );
      updateMenuCount();
      $("#espresso-menu-name").value = "";
  }

  const updateMenuName = (e) => {
    if (e.target.className.includes("menu-edit-button")) {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedName = prompt("메뉴 이름을 수정해주세요!", $menuName.innerText);
      $menuName.innerText = updatedName;
    }
  }

  const removeMenuName = (e) => {
    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("삭제하시겠습니까?")) {
        e.target.closest("li").remove();
        updateMenuCount();
      }
    }
  }
  $("#espresso-menu-list")
    .addEventListener("click", (e) => {
      updateMenuName(e);
      removeMenuName(e);
    })

  $("#espresso-menu-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    })

  $("#espresso-menu-name")
    .addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    })

  $("#espresso-menu-submit-button")
    .addEventListener("click", addMenuName);
}

App();


/*
step1. 배운것

- 요구사항들중에서도 쪼개서 다시 요구사항을 확인한다

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
*/