<template>
  <div
    id="mySidenav"
    class="sidenav d-flex flex-column flex-shrink-0 text-black widthSide"
    style="height: 100vh; align-items: stretch"
  >
    <span class="fs-4 text-center text-white" style="padding-left: 40px"
      >Sidebar</span
    >

    <hr />
    <ul
      class="
        mc
        nav nav-pills
        flex-column
        mb-auto
        text-center
        align-items-stretch
        justify-content-around
        flex-column
        h-100
      "
      style="padding-left: 0%"
    >
      <li class="nav-item">
        <a href="#" class="nav-link text-white" aria-current="page">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#home"></use>
          </svg>
          Home
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white mc">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#speedometer2"></use>
          </svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white m">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#table"></use>
          </svg>
          Orders
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#grid"></use>
          </svg>
          Products
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#people-circle"></use>
          </svg>
          Customers
        </a>
      </li>
    </ul>
    <hr />
  </div>
</template>
<style lang="scss" scoped>
li:hover {
  background-color: #16205c;
}
.sidenav {
  background-color: #0c1844;
  height: 100%;
  width: 0%;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  transition: 0.5s;
  position: fixed;
}

.sidenav a {
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  font-size: 25px;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: rgb(255, 255, 255);
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
  border: none;

  opacity: 1;
}

.closebtn {
  display: none;
  opacity: 0;
}

.widthSide {
  width: 15%;
}

@media screen and (max-width: 720px) {
  .widthSide {
    width: 100% !important;
    min-height: 100%;
  }
  .sidenav a {
    font-size: 8em !important;
  }
}
@media screen and (min-width: 720px) {
  .widthSide {
    width: 15% !important;
  }
  .widthSide ul {
    justify-content: start !important;
  }
}

@media screen and (max-height: 450px) {
  .sidenav {
  }

  .sidenav a {
    font-size: 18px;
  }
}
.card_style {
  background-color: #16205c;
}

.widthSide {
  width: 15%;
}
</style>
