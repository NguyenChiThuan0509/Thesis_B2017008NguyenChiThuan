<template>
    <div class="sidebar">
        <ul>
            <!-- Home -->
            <router-link to="/" class="router-link" @click="closeAllMenus()">
                <li :class="isActive('/') ? 'active-menu' : ''">
                    <i class="fa-brands fa-windows"></i> Trang chủ
                </li>
            </router-link>

            <!-- Chiêu sinh -->
            <router-link to="/addstudent" class="router-link" @click="closeAllMenus()">
                <li :class="isActive('/addstudent') ? 'active-menu' : ''">
                    <i class="fa-solid fa-plus"></i> Chiêu sinh
                </li>
            </router-link>

            <!-- Lịch thi -->
            <router-link to="/examschedule" class="router-link" @click="closeAllMenus()">
                <li :class="isActive('/examschedule') ? 'active-menu' : ''">
                    <i class="fa-solid fa-calendar-days"></i> Lịch thi
                </li>
            </router-link>

            <!-- Tra Cứu (Collapsible) -->
            <li>
                <div @click="toggleMenu('traCuu')">
                    <span
                        :class="[isTraCuuOpen ? 'open-menu' : '', isActive('/searchresult') || isActive('/searchdegree') ? 'active-menu' : '']">
                        <i class="fa-solid fa-heart"></i> Kết quả thi
                    </span>
                    <i class="icon" :class="isTraCuuOpen ? 'rotate' : ''">▼</i>
                </div>
                <ul v-if="isTraCuuOpen" class="sub-menu">
                    <router-link to="/searchresult" class="router-link">
                        <li :class="isActive('/searchresult') ? 'active-submenu' : ''">
                            <i class="fa-solid fa-address-card"></i> Theo cá nhân
                        </li>
                    </router-link>
                    <router-link to="/searchresultclass" class="router-link">
                        <li :class="isActive('/searchresultclass') ? 'active-submenu' : ''">
                            <i class="fa-solid fa-star"></i> Theo lớp
                        </li>
                    </router-link>
                </ul>
            </li>

            <!-- Liên Hệ -->
            <router-link to="/contact" class="router-link" @click="closeAllMenus()">
                <li :class="isActive('/contact') ? 'active-menu' : ''">
                    <i class="fa-brands fa-whatsapp"></i> Liên hệ
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script>
export default {
    name: "SideBar",
    data() {
        return {
            isHocTapOpen: false,
            isTraCuuOpen: false,
        };
    },
    methods: {
        toggleMenu(menu) {
            if (menu === "hocTap") {
                this.isHocTapOpen = !this.isHocTapOpen;
                this.isTraCuuOpen = false; // Close "Tra Cứu" if "Học Tập" is opened
            } else if (menu === "traCuu") {
                this.isTraCuuOpen = !this.isTraCuuOpen;
                this.isHocTapOpen = false; // Close "Học Tập" if "Tra Cứu" is opened
            }
        },
        closeAllMenus() {
            this.isHocTapOpen = false;
            this.isTraCuuOpen = false;
        },
        isActive(route) {
            return this.$route.path === route;
        }
    }
};
</script>

<style scoped>
.sidebar {
    left: 0;
    top: 68px;
    width: 17%;
    position: fixed;
    min-height: 100%;
    overflow-y: auto;
    height: calc(100% - 68px);
    background-color: #f4f4f4;
    padding: 10px;
    border-right: 1px solid #ccc;
}

.sidebar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.sidebar ul li {
    margin: 10px 0;
    padding: 10px 20px;
    background-color: #ffffff;
    color: #333;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    border: solid 1px #ddd;
    transition: background-color 0.3s;
}

.sidebar ul li:hover {
    background-color: #133E87;
    color: white;
}

span {
    font-weight: bold;
}

.sub-menu {
    list-style-type: none;
    padding-left: 20px;

}

.sub-menu li {
    margin: 5px 0;
    padding: 5px 15px;
    background-color: #f0f0f0;
    color: #333;
    border: solid 1px #ddd;
    border-radius: 8px;
}

.sub-menu li:hover {
    background-color: #ccc;
}

.icon {
    float: right;
    transition: transform 0.3s;
}

.rotate {
    transform: rotate(180deg);
}

/* ------------------------------------------------------------------------- */
</style>
