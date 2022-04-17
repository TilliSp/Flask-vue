<template>
  <div class="all-content-wrapper d-flex" style="align-items:stretch">
        <!-- тут будет кнопка абсолют-->

        <div id="mySidenav" class="sidenav d-flex flex-column flex-shrink-0 text-white " style=" height: 100vh; align-items:stretch">
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
            <span class="fs-4 text-center" style="padding-left:40px">Sidebar</span>

            <hr>
            <ul class="mc nav nav-pills flex-column mb-auto text-center align-items-stretch justify-content-around flex-column h-100" style="padding-left: 0%">
                <li class="nav-item ">
                    <a href="#" class="nav-link text-white" aria-current="page">
                        <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#home"></use>
            </svg> Home
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-link text-white mc">
                        <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#speedometer2"></use>
            </svg> Dashboard
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-link text-white m">
                        <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#table"></use>
            </svg> Orders
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-link text-white">
                        <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#grid"></use>
            </svg> Products
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-link text-white">
                        <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#people-circle"></use>
            </svg> Customers
                    </a>
                </li>
            </ul>
            <hr>

        </div>

        <div id="content" class="" style="background-color:#050b34">
            <p style="font-size:40px;cursor:pointer" class="position-fixed" onclick="openNav()"> ☰ </p>
            <div class="container-fluid ">

                <div class="row align-items-stretch mb-3">
                    <div class="col-xxl-10 d-flex justify-content-end align-items-stretch" style="height: 100%;">

                        <div class="card card_style mb-3">
                            <div class="card-header">Camera src </div>
                            <div class="card-body m-2">
                                <div class="w-auto"><video src="" class="" autoplay loop style="width: 1280px; height: 720px;background-color: black;"></video></div>
                                <h5 class="card-title">Название</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Подзаголовок </h6>
                                <p class="card-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate delectus nostrum in facilis. Omnis tempora officiis accusamus? A, provident facilis.</p>
                                <br> <br> <br> <br> <br> <br> <br><br><br><br>
                                <p class="card-text"> A, provident facilis.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-2 d-flex flex-column bd-highlight justify-content-evenly ">

                        <div class="card card_style bd-highlight mb-3 ">
                            <div class="card-body m-2" id="divWorkVisitorsAll">
                            </div>
                        </div>

                        <div class="card card_style bd-highlight mb-3 ">
                            <div class="card-body m-2" id="divWorkVisitorsGood">
                                <h5 class=" card-title ">Название</h5>
                                <h6 class="card-subtitle mb-2 text-muted ">Подзаголовок </h6>
                                <p class="card-text ">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate delectus nostrum in facilis. Omnis tempora officiis accusamus? A, provident facilis.</p>

                            </div>
                        </div>

                        <div class="card card_style bd-highlight mb-3 ">
                            <div class="card-body m-2 " id="divWorkVisitorsBad">
                                <h5 class="card-title ">Название</h5>
                                <h6 class="card-subtitle mb-2 text-muted ">Подзаголовок </h6>
                                <p class="card-text ">Lorem ipsum dolor sit amet consectetur, adipcilis.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
function openNav() {
            document.getElementById("mySidenav ").className += " widthSide ";
        }

        function closeNav() {
            console.log("KRYA ")
            document.getElementById("mySidenav ").className = document.getElementById("mySidenav ").className.replace(/(?:^|\s)widthSide(?!\S)/g, '');
            console.log(document.getElementById("mySidenav ").className)
        }
@Component
export default class About extends Vue {}
</script>
