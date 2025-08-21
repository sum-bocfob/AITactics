$(function () {
  // オープニングアニメーション============================================================
  // 訪問済みならアニメーションを表示しない
  if (sessionStorage.getItem('visited')) {
    $('.opening').hide();
    // オープニングアニメーション表示しない分、タイトルアニメーションの開始を早める
    const title = $('.hero h2').css('animation-delay', '0.5s');
    title.addClass('visited');
    // bodyをスクロール可能に
    $('body.index').css({
      position: 'static',
      width: 'auto',
    });
  }

  // 未訪問
  if (!sessionStorage.getItem('visited')) {
    // オープニングアニメーションが終わったらスクロール可能にする
    $('.opening').on('animationend', function (event) {
      if (event.originalEvent.animationName === 'translateOpening') {
        $('body.index').css({
          position: 'static',
          width: 'auto',
        });

        // 訪問済みにする
        sessionStorage.setItem("visited", "true");
      }
    });
  }

  // ハンバーガー============================================================
  const hamburger = $('.hamburger');
  const gnavWrapper = $('.gnav_wrapper');

  // アニメーション終了時にcloseクラスを削除(1回だけ実行するため)
  gnavWrapper.on('animationend', function () {
    gnavWrapper.removeClass('close');
  });

  hamburger.click(function () {
    $(this).toggleClass('open');
    if (gnavWrapper.hasClass('open')) {
      gnavWrapper.removeClass('open');
      gnavWrapper.addClass('close');
    } else {
      gnavWrapper.addClass('open');
    }
  });
  // 背景クリックでメニュー閉じる
  gnavWrapper.click(function () {
    gnavWrapper.removeClass('open')
    gnavWrapper.addClass('close');
    hamburger.removeClass('open');
  });

  // 現在のページにクラス追加============================================================
  const links = $(".gnav li a");
  for (let link of links) {
    if ($(link).attr("href") === "#") {
      $(link).addClass("current_page");
    } else {
      $(link).removeClass("current_page");
    }
  }

  // マウスカーソル変更============================================================
  const cursor = $('#cursor');
  const stalker1 = $('#stalker1');
  const stalker2 = $('#stalker2');
  // マウス移動時に追従させる
  $(document).on('mousemove', function (event) {
    cursor.css({
      opacity: 1,
      top: event.clientY + 'px',
      left: event.clientX + 'px',
    });
    // 小さいカーソルを少し遅れて追従させる
    setTimeout(function () {
      stalker1.css({
        opacity: 1,
        top: event.clientY + 'px',
        left: event.clientX + 'px',
      });
    }, 50);
    setTimeout(function () {
      stalker2.css({
        opacity: 1,
        top: event.clientY + 'px',
        left: event.clientX + 'px',
      });
    }, 100);
  });
  //リンクにマウス乗ったらカーソル拡大
  $('a').on({
    'mouseenter': function () {
      cursor.addClass('onlink');
      stalker1.addClass('onlink');
      stalker2.addClass('onlink');
    },
    'mouseleave': function () {
      cursor.removeClass('onlink');
      stalker1.removeClass('onlink');
      stalker2.removeClass('onlink');
    }
  });

  //タイトルにストロボ風効果追加============================================================
  let strobeArray = [];
  const title = $('.hero h2');
  // タイトルアニメーション終了時に要素を未作成なら作成
  title.on('animationend', function () {
    if (strobeArray.length === 0) {
      const W_COUNT = 30;
      const DIAMETER = Math.ceil(title.width() / W_COUNT);
      const H_COUNT = Math.ceil(title.height() / DIAMETER);
      // 親作成
      const strobeParent = $('<div></div>').insertAfter(title);
      strobeParent.css({
        display: 'grid',
        gridTemplateColumns: `repeat(${W_COUNT}, 1fr)`,
        width: `${title.width()}px`,
        position: 'absolute',
        top: title.css('marginTop'),
        left: 0,
        pointerEvents: 'none',
      });
      // 子の基本CSS
      const props = {
        width: `${DIAMETER}px`,
        height: `${DIAMETER}px`,
        backgroundColor: '#fff',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: 0,
      }
      // 子をstrobeParentに追加して、ランダムなopacityを指定
      for (let i = 0; i < W_COUNT; i++) {
        for (let j = 0; j < H_COUNT; j++) {
          const strobe = $('<div>').appendTo(strobeParent);
          strobe.css({
            ...props,
            borderRadius: `${Math.random() * 50}%`,
          });
          strobeArray = [...strobeArray, strobe];
        }
      }
    }
  });

  // タイトルにマウスを乗せたら
  title.mousemove(function () {
    strobeArray.forEach((s) => {
      $(s).css({
        opacity: Math.random(),
      });
    });
  });
  title.mouseleave(function () {
    strobeArray.forEach((s) => {
      $(s).css({
        opacity: 0,
      });
    });
  });

  // IntersectionObserver============================================================
  // クラスを付与する関数
  function addViewedClass(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('viewed');
        observer.unobserve(entry.target);
      }
    });
  }

  // サービスのリストをIntersectionObserverで監視してクラス付与
  const serviceList = $('.service_list li');
  const observer = new IntersectionObserver(addViewedClass, {
    rootMargin: '-20% 0%',
  });
  serviceList.each((idx, s) => {
    observer.observe(s);
  });


  //CEOの写真をIntersectionObserverで監視してクラス付与
  const ceo_img_wrapper = $('.ceo_img_wrapper');
  const observer2 = new IntersectionObserver(addViewedClass, {
    rootMargin: '-50% 0%',
  });
  if (ceo_img_wrapper.length) {
    observer2.observe(ceo_img_wrapper.get(0));
  }
});
