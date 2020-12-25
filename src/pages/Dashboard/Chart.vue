<template>
  <canvas id="myChart" width="400" height="150"></canvas>
</template>
<script>
import Chart from "chart.js";
import json from "../../dataAcctress/acctress.json";

export default {
  props: ["type"],
  data() {
    return {
      data: json,
    };
  },
  mounted() {
    console.log(this.type);
    var ctx = document.getElementById("myChart");
    let label = [];
    let data = [];
    if (this.type == "age") {
      this.data.forEach(el => {
        if (el.birthday && el.birthday.substr(0, 4) && !label.includes(2020 - Number(el.birthday.substr(0, 4)))) {
          label.push(2020 - Number(el.birthday.substr(0, 4)));
        // } else if (!el.birthday) {
        //   if (!isNaN(label[0])) {
        //     label.unshift(NaN);
        //   }
        }
      });
      label.sort(function(a, b) {
        return a - b;
      });
      label.forEach(el => {
        let n = this.data.filter(it => it.birthday && 2020 - Number(it.birthday.substr(0, 4)) == el).length;
        data.push(n);
      });
    //   let na = this.data.filter(it => !it.birthday).length;
    //   if (!isNaN(data[0])) {
    //     data.unshift(na);
    //   }
    } else {
      this.data.forEach(el => {
        if (!label.includes(+el[this.type])) {
          label.push(+el[this.type]);
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

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: label,
        datasets: [
          {
            label: "# of Votes",
            data: data,
            backgroundColor: "#2E86C1",
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
      },
    });
  },
};
</script>
