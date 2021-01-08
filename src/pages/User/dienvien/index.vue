<template>
  <v-container>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"><v-icon size="45">mdi-human</v-icon> DIỄN VIÊN</v-list-item-title>
          <v-list-item-subtitle>Dánh sách thông tin diễn viên</v-list-item-subtitle>
        </v-list-item-content>
        <!-- <v-btn color="teal" @click="createMenu()">
          <v-icon left color="white">mdi-plus</v-icon>
          <span style="color: white">Tạo Menu</span>
        </v-btn> -->
      </v-list-item>
    </v-card>
    <br />
    <v-row>
      <v-col>
        <v-card class="mb-1">
          <v-card-title class="pa-6 pb-4">
            <p><v-icon size="30">mdi-gender-female</v-icon> DIỄN VIÊN</p>
            <v-spacer></v-spacer>
            <div style="width: 500px" class="mr-4">
              <v-row>
                <v-col cols="5">
                  <v-select
                    v-model="filterType"
                    item-text="name"
                    item-value="value"
                    :items="dataType"
                    placeholder="Tìm kiếm theo"
                    hide-details
                  ></v-select
                ></v-col>
                <v-col cols="7">
                  <v-text-field
                    append-icon="mdi-magnify"
                    v-model="search"
                    label="Tìm kiếm"
                    clearable
                    single-line
                    hide-details
                  ></v-text-field
                ></v-col>
              </v-row>
            </div>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filterData"
            :items-per-page="10"
            class="elevation-1"
            loading-text="Đang tải dữ liệu ..."
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1 mt-2  "
                ><v-icon size="30">mdi-chart-bar</v-icon> BIỂU ĐỒ THỐNG KÊ</v-list-item-title
              >
              <v-checkbox v-model="checkbox" label="Thống kê dữ liệu rỗng"></v-checkbox>
            </v-list-item-content>
            <div style="width: 400px">
              <v-select
                v-model="field"
                :items="fields"
                placeholder="Lựa chọn thuộc tính"
                item-text="name"
                item-value="value"
              ></v-select>
            </div>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="field">
        <chart-bar :type="field" :nullValue="checkbox" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import json from "./acctress.json";
import ChartBar from "./Chart";
import {debounce} from "lodash";

export default {
  components: {
    ChartBar,
  },
  data() {
    let tData = json.map(el => ({
      ...el,
      keyword: `${el.name}${el.japanName}${el.hobby}${el.prefectures}${el.blood_type}`,
    }));
    return {
      field: null,
      search: "",
      checkbox: false,
      filterType: "general",
      dataType: [
        {name: "Chiều cao", value: "height"},
        {name: "Tuổi", value: "birthday"},
        {name: "Vòng 1", value: "bust"},
        {name: "Vòng 2", value: "waist"},
        {name: "Vòng 3", value: "hip"},
        {name: "Chung", value: "general"},
      ],
      fields: [
        {name: "Chiều cao", value: "height"},
        {name: "Tuổi", value: "age"},
        {name: "Vòng 1", value: "bust"},
        {name: "Vòng 2", value: "waist"},
        {name: "Vòng 3", value: "hip"},
        {name: "Nhóm máu", value: "blood_type"},
        {name: "Quận, thành phố", value: "prefectures"},
        {name: "Sở thích", value: "hobby"},
      ],
      dataAcctress: tData,
      filterData: tData,
      headers: [
        {text: "Name", value: "name"},
        {text: "Japan Name", value: "japanName"},
        {text: "Ngày sinh", value: "birthday"},
        {text: "V-1", value: "bust"},
        {text: "V-2", value: "waist"},
        {text: "V-3", value: "hip"},
        {text: "Chiều cao", value: "height"},
        {text: "Nhóm máu", value: "blood_type"},
        {text: "Sở thích", value: "hobby"},
        {text: "Quận, thành phố", value: "prefectures"},
      ],
      ages: [],
    };
  },
  watch: {
    search: debounce(function(val) {
      if (val) {
        let isGreaterThan = null;
        let tmp_1 = val.split(">");
        let tmp_2 = val.split("<");
        let n_tmp_1 = parseFloat(tmp_1[1]) || Number.MAX_SAFE_INTEGER;
        let n_tmp_2 = parseFloat(tmp_2[1]) || -Number.MAX_SAFE_INTEGER;
        if (tmp_2.length === 2) isGreaterThan = true;
        else if (tmp_1.length === 2) isGreaterThan = false;
        console.log(this.filterType, isGreaterThan);
        switch (this.filterType) {
          case "birthday":
            this.filterData = this.dataAcctress.filter(el =>
              el.birthday && (isGreaterThan === null
                ? el.birthday?.includes(val)
                : isGreaterThan
                ? el.birthday < tmp_2[1]
                : el.birthday > tmp_1[1])
            );
            break;
          case "general":
            this.filterData = this.dataAcctress.filter(el =>
              el.keyword.toLocaleLowerCase().includes(val.toLocaleLowerCase())
            );
            break;
          default:
            this.filterData = this.dataAcctress.filter(
              el =>
                el[this.filterType] &&
                (isGreaterThan === null
                  ? el[this.filterType] === val
                  : isGreaterThan
                  ? el[this.filterType] < n_tmp_2
                  : el[this.filterType] > n_tmp_1)
            );
            break;
        }
      } else {
        this.filterData = this.dataAcctress;
      }
    }, 500),
  },
  created() {},
  methods: {},
};
</script>
