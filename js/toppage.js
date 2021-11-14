// Import the functions you need from the SDKs you need
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUy1E0IFrIsByIZnmjFiRvSUOu96tsaAQ",
  authDomain: "health-check-fd5a1.firebaseapp.com",
  projectId: "health-check-fd5a1",
  storageBucket: "health-check-fd5a1.appspot.com",
  messagingSenderId: "1065531527870",
  appId: "1:1065531527870:web:48572790a6b3940ddb84ef",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

$(window).on("load", function () {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const _view_date = params.get("view_date");
  // ヘッダーの日付を設定する
  // TODO: 今日の日付を取得して好きなフォーマットに加工して.dayを変更する
  let today = _view_date ? new Date(_view_date) : new Date();
  let day = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  $(".day").text(
    `今日(${today.getFullYear()}年${
      today.getMonth() + 1
    }月${today.getDate()}日)`
  );
  $("#js-prev_date").attr(
    "href",
    `./index.html?view_date=${today.getFullYear()}/${today.getMonth() + 1}/${
      today.getDate() - 1
    }`
  );
  $("#js-next_date").attr(
    "href",
    `./index.html?view_date=${today.getFullYear()}/${today.getMonth() + 1}/${
      today.getDate() + 1
    }`
  );

  let personal = get_personal();
  personal.then(function (result) {
    console.log(result[0]);
    // 目標までの日数を計算して表示
    let date1 = Date.parse(result[0].goalday);
    let date2 = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    termDay = (date1 - date2) / 86400000;
    $(".target-days").text(termDay);
    // 目標体重を表示
    $(".targetweight").text(result[0].targetweight);
  });

  // ##let meals = get_meal("2021/11/14");

  // 円グラフの制御
  // ##
  // ##
  // TODO: 本日の食事情報をこっちに移動(余裕あったらでおｋ)
  let meals = get_meal(day);
  console.log(meals);
  meals.then(function (result) {
    console.log(result[0]);
    $.each(result[0].breakfast, function (i, val) {
      $(".inoculation")
        .find(".breadfast")
        .find("ul")
        .append(
          `<li><span>${val.name}</span><span>${val.amount}</span><span>${val.kcal}</span></li>`
        );
    });
  });
});

//=========== 円グラフ（ドーナッツ型） ============//
$("#chart02").on("inview", function (event, isInView) {
  //画面上に入ったらグラフを描画
  if (isInView) {
    let ctx = document.getElementById("chart02"); //グラフを描画したい場所のid
    let chart = new Chart(ctx, {
      type: "doughnut", //グラフのタイプ
      data: {
        //グラフのデータ
        datasets: [
          {
            backgroundColor: ["#000088", "#aaa"], //グラフの背景色
            data: ["0", "100"], //データ
          },
        ],
      },

      options: {
        //グラフのオプション
        maintainAspectRatio: false, //CSSで大きさを調整するため、自動縮小をさせない
        cutoutPercentage: 70, //中央からの空円の太さ。グラフの太さ変更
        legend: {
          display: true, //グラフの説明を表示
        },
        tooltips: {
          //グラフへカーソルを合わせた際の詳細表示の設定
          callbacks: {
            label: function (tooltipItem, data) {
              return (
                data.labels[tooltipItem.index] +
                ": " +
                data.datasets[0].data[tooltipItem.index] +
                "%"
              ); //%を最後につける
            },
          },
        },
        title: {
          //上部タイトル表示の設定
          display: true,
          fontSize: 16,
          text: "のこり摂取カロリー",
        },
      },
    });
  }
});

async function get_meal(date) {
  let snapShot = await db
    .collection("meal_history")
    .where("dateTime", "==", date)
    .get();
  const data = snapShot.docs.map((doc) => {
    return doc.data();
  });
  return data;
}

async function get_personal() {
  let snapShot = await db.collection("personal").get();

  const data = snapShot.docs.map((doc) => {
    return doc.data();
  });
  console.log(data);
  return data;
}

//値をグラフに表示させる
Chart.plugins.register({
  afterDatasetsDraw: function (chart, easing) {
    let ctx = chart.ctx;

    chart.data.datasets.forEach(function (dataset, i) {
      let meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach(function (element, index) {
          // 値の表示
          ctx.fillStyle = "rgb(254, 254, 254, 1)"; //文字の色
          let fontSize = 12; //フォントサイズ
          let dataString = dataset.data[index].toString();

          // 値の位置
          ctx.textAlign = "center"; //テキストを中央寄せ
          ctx.textBaseline = "middle"; //テキストベースラインの位置を中央揃え

          let padding = -5; //余白
          let position = element.tooltipPosition();
          ctx.fillText(
            dataString,
            position.x,
            position.y - fontSize / 2 - padding
          );
        });
      }
    });
  },
});
