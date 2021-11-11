///////// 選択タブ（活動レベル）///////////
      const mix = {
        text: [
          "おにぎり",
          "パン",
          "カレーライス",
          "ラーメン",
          "サラダチキン",
        ],
        number: [100, 200, 300, 400, 500],
      };
      // optionタグの生成
      const start = 0;
      const end = 4;
      let option = "";
      for (let i = start; i <= end; i++) {
        option += "<option>" + mix.text[i] + "</option>";
      }
      $("#select").html(option);
      $("#select").html(option);