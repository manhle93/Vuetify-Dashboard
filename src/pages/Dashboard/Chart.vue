<template>
  <canvas id="myChart" width="400" height="150"></canvas>
</template>
<script>
import Chart from "chart.js";
import json from "../../dataAcctress/acctress.json";

export default {
  props: ["type", "nullValue"],
  data() {
    return {
      data: json,
      chart: undefined,
    };
  },
  watch: {
    type(val) {
      if (val) {
        this.getChart();
      }
    },
    nullValue() {
      this.getChart();
    },
  },
  methods: {
    getChart() {
      if (this.chart) {
        this.chart.destroy();
      }
      var ctx = document.getElementById("myChart");
      let label = [];
      let data = [];
      let colors = [];
      if (this.type == "age") {
        this.data.forEach(el => {
          if (this.nullValue) {
            if (el.birthday && el.birthday.substr(0, 4) && !label.includes(2020 - Number(el.birthday.substr(0, 4)))) {
              label.push(2020 - Number(el.birthday.substr(0, 4)));
            } else if (!el.birthday) {
              if (!isNaN(label[0])) {
                label.unshift(NaN);
              }
            }
          } else {
            if (el.birthday && el.birthday.substr(0, 4) && !label.includes(2020 - Number(el.birthday.substr(0, 4)))) {
              label.push(2020 - Number(el.birthday.substr(0, 4)));
            }
          }
        });
        label.sort(function(a, b) {
          return a - b;
        });
        label.forEach(el => {
          let n = this.data.filter(it => it.birthday && 2020 - Number(it.birthday.substr(0, 4)) == el).length;
          data.push(n);
        });
        if (this.nullValue) {
          let na = this.data.filter(it => !it.birthday).length;
          if (!isNaN(data[0])) {
            data.unshift(na);
          }
        }
      } else {
        this.data.forEach(el => {
          if (this.nullValue) {
            if (!label.includes(el[this.type])) {
              label.push(el[this.type]);
            }
          } else {
            if (el[this.type] && !label.includes(el[this.type])) {
              label.push(el[this.type]);
            }
          }
        });
        label.sort(function(a, b) {
          return a - b;
        });
        label.forEach(el => {
          let n = this.data.filter(it => it[this.type] == el).length;
          data.push(n);
        });
      }
      colors = this.randomColor(label.length);
      console.log(colors);
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: label,
          datasets: [
            {
              label: "Diễn viên",
              data: data,
              backgroundColor: '#2E86C1',
              borderColor: "#2E86C1",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          zoom: {
            enabled: true,
            mode: "x",
          },
        },
      });
    },
    randomColorFactor() {
      return Math.round(Math.random() * 255);
    },

    randomColor(length) {
      let data = [];
      for (let i = 0; i < length; i++) {
        data.push(
          "rgba(" +
            this.randomColorFactor() +
            "," +
            this.randomColorFactor() +
            "," +
            this.randomColorFactor() +
            "," +
            0.8 +
            ")"
        );
      }
      return data;
    },
  },
  mounted() {
    this.getChart();
  },
};
</script>
