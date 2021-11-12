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
            data: ["70", "30"], //データ
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
